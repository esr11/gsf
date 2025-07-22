'use client';

import React from 'react';
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleSignUpError = (error: any) => {
    console.error('Sign up error:', error);
    // You can add custom error handling here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Role
          </label>
          <select
            id="role-select"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => {
              const role = e.target.value;
              localStorage.setItem('selectedRole', role);
            }}
          >
            <option value="">Select a role</option>
            <option value="user">Citizen</option>
            <option value="government_admin">Government Administrator</option>
            <option value="system_admin">System Administrator</option>
          </select>
        </div>
        <SignUp
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              footerActionLink: 'text-blue-600 hover:text-blue-700'
            }
          }}
          routing="path"
          path="/signup"
          signInUrl="/signin"
          afterSignUpUrl="/api/auth/verify-email"
          redirectUrl="/dashboard"
          afterSignUp={(user) => {
            console.log('User signed up:', user);
            router.push('/dashboard');
          }}
          onError={handleSignUpError}
        />
      </div>
    </div>
  );
} 