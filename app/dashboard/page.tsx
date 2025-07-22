import React from 'react';
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "Dashboard - Government Service Feedback",
  description: "Your Government Service Feedback dashboard",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Citizen Dashboard</h1>
            <UserButton afterSignOutUrl="/signin" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Submit Feedback</h3>
                <p className="mt-1 text-sm text-gray-500">Share your feedback about government services</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">My Feedback</h3>
                <p className="mt-1 text-sm text-gray-500">View your submitted feedback</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Service Status</h3>
                <p className="mt-1 text-sm text-gray-500">Check the status of government services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
