import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "Sign Up - Government Service Feedback",
  description: "Create your Government Service Feedback account",
};

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            footerActionLink: 'text-blue-600 hover:text-blue-700'
          }
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
      />
    </div>
  );
} 