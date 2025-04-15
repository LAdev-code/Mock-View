// Firebase Admin SDK initialization for server-side authentication and Firestore
// Server-side Firebase Admin SDK configuration and initialization
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Initialize Firebase Admin SDK for server-side operations
 * This gives elevated privileges for admin operations like:
 * - Verifying session cookies
 * - Managing users
 * - Direct database access
 */
function initFirebaseAdmin() {
  const apps = getApps();

  // Only initialize if no Firebase admin apps exist
  // Prevents multiple initialization in development with hot reloading
  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines in the private key string
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  // Return Firebase Admin services for use in server-side code
  return {
    auth: getAuth(),      // Admin Authentication service
    db: getFirestore(),   // Admin Firestore service
  };
}

// Export initialized Firebase Admin services
export const { auth, db } = initFirebaseAdmin();
