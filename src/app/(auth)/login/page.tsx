"use client";

import LoginForm from "@/components/features/auth/login/LoginForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C3875D]/20 via-white to-[#C3875D]/10 flex items-center justify-center p-4">
      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-[#C3875D] hover:text-[#A86D49] hover:bg-[#C3875D]/10"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <LoginForm />

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        toastStyle={{
          backgroundColor: "white",
          color: "#C3875D",
          border: "1px solid #C3875D20",
          width: "500px",
        }}
      />
    </div>
  );
};

export default LoginPage;
