import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <h2 className="mt-4 text-xl text-gray-600">Page Not Found</h2>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <Link 
        href="/sign-in"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Go to Sign In
      </Link>
    </div>
  );
} 