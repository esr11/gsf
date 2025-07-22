import React from 'react';
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "Sign In - Government Service Feedback",
  description: "Sign in to your Government Service Feedback account",
};

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            footerActionLink: 'text-blue-600 hover:text-blue-700'
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
        afterSignInUrl="/api/auth/verify-email"
      />
    </div>
  );
} 