import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Government Service Feedback</h1>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feedback Card */}
          <Link href="/feedback" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Submit Feedback</h2>
              <p className="text-gray-600">Share your experience with government services</p>
            </div>
          </Link>

          {/* View Feedback Card */}
          <Link href="/view-feedback" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">View Feedback</h2>
              <p className="text-gray-600">See feedback from other citizens</p>
            </div>
          </Link>

          {/* Profile Card */}
          <Link href="/profile" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">My Profile</h2>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
} 