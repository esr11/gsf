'use client';

import React from 'react';
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              footerActionLink: 'text-blue-600 hover:text-blue-700'
            }
          }}
          routing="path"
          path="/signin"
          signUpUrl="/signup"
          afterSignInUrl="/api/auth/verify-email"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
} 