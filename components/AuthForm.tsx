"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

// AuthForm component handles both sign-in and sign-up forms
const AuthForm = ({ type }: { type: FormType }) => {
  // Next.js router for navigation after auth actions
  const router = useRouter();

  // Build the Zod schema based on form type (sign-in or sign-up)
  const formSchema = authFormSchema(type);
  // Initialize React Hook Form with Zod validation and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handles form submission for both sign-in and sign-up
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        // Destructure form data for sign-up
        const { name, email, password } = data;

        // Create user in Firebase Auth (client-side)
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Register user in Firestore via server action
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        // Handle sign-up errors
        if (!result.success) {
          toast.error(result.message);
          return;
        }

        // Success: notify and redirect to sign-in
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        // Destructure form data for sign-in
        const { email, password } = data;

        // Set Firebase Auth to use session persistence
        await setPersistence(auth, browserSessionPersistence);

        // Sign in user with Firebase Auth (client-side)
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Log current user for debugging
        console.log("Firebase Auth User:", auth.currentUser);

        // Get Firebase ID token for session
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        // Call server action to set session cookie and validate user
        await signIn({
          email,
          idToken,
        });

        // Success: notify and redirect to dashboard
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      // Handle and display any errors
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  // Boolean for conditional rendering (sign-in vs sign-up)
  const isSignIn = type === "sign-in";

  return (
    // Card container for the auth form
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        {/* Logo and title */}
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">MockView</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        {/* Main form using shadcn/ui Form and FormField components */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {/* Name field only for sign-up */}
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            {/* Submit button */}
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        {/* Link to switch between sign-in and sign-up */}
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

// Export the AuthForm component for use in auth pages
export default AuthForm;
