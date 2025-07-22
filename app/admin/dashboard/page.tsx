import React from "react";

async function getDashboardStats() {
  try {
    const res = await fetch("http://localhost:5000/api/government-admin/dashboard/stats", {
      // You may need to add headers for authentication if required
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    const data = await res.json();
    return data.stats;
  } catch (error) {
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">System Administrator Dashboard</h1>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                <p className="mt-1 text-2xl font-bold text-gray-700">{stats ? stats.total_users : "-"}</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Government Admins</h3>
                <p className="mt-1 text-2xl font-bold text-gray-700">{stats ? stats.total_gov_admins : "-"}</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Regular Users</h3>
                <p className="mt-1 text-2xl font-bold text-gray-700">{stats ? stats.total_regular_users : "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 