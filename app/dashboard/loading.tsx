export default function Loading() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
} 