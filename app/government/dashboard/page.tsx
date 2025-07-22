import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function GovernmentDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Government Administrator Dashboard</h1>
            <UserButton afterSignOutUrl="/signin" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Feedback Overview</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage citizen feedback</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Service Management</h3>
                <p className="mt-1 text-sm text-gray-500">Manage government services</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Reports</h3>
                <p className="mt-1 text-sm text-gray-500">Generate and view reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 