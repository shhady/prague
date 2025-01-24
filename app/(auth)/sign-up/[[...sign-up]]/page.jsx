import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-gradient-ocean hover:bg-gradient-ocean-dark',
          },
        }}
      />
    </div>
  );
}