"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const MainPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center px-7 py-10">
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <Button
            onClick={() => router.push("/signin")}
            className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
          >
            Se connecter
          </Button>

          <Button
            onClick={() => router.push("/signup")}
            className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
          >
            S&apos;inscrire
          </Button>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );
};

export default MainPage;
