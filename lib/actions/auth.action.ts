"use server"; // Mark this file as server-side only code

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Server actions for authentication: sign up, sign in, sign out, session management

// Constants
// Session duration set to 1 week in seconds (60s * 60m * 24h * 7d)
const SESSION_DURATION = 60 * 60 * 24 * 7;

/**
 * Creates and sets a session cookie in the browser
 * @param idToken Firebase ID token from client authentication
 */
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create a session cookie that expires in 1 week
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // Convert to milliseconds for Firebase
  });

  // Set secure HTTP-only cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true, // Prevents JavaScript access to cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    path: "/", // Cookie available across all routes
    sameSite: "lax", // Protects against CSRF attacks
  });
}

/**
 * Signs up a new user in the database
 * @param params Object containing user signup data (uid, name, email)
 * @returns Success/failure message object
 */
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // Check if user already exists in Firestore
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // Create new user document in Firestore
    await db.collection("users").doc(uid).set({
      name,
      email,
      // Fields for future implementation:
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle specific Firebase error cases
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

/**
 * Signs in an existing user
 * @param params Object containing signin data (email, idToken)
 * @returns Success/failure message object
 */
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // Verify user exists in Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    // Create session cookie for persistent authentication
    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Sign in successfully.",
    };
  } catch (error: any) {
    console.log("Sign in error:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

/**
 * Signs out the current user by removing their session cookie
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session"); // Remove the session cookie
}

/**
 * Gets the currently logged in user's data from their session
 * @returns User object or null if no valid session exists
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  // Check for existing session cookie
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    // Verify the session cookie is valid and not expired
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Get user's full profile from Firestore
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    // Return user data with their document ID
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log("Session verification error:", error);
    return null; // Session is invalid or expired
  }
}

/**
 * Checks if there is a currently authenticated user
 * @returns boolean indicating if a user is logged in
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user; // Convert user object/null to boolean
}