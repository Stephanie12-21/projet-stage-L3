"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/navigation";
import StandardForm from "@/components/features/auth/registration/StandardForm";

const LoginPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Formulaire */}
      <div className="flex w-full md:w-1/2 flex-col relative z-10">
        {/* Haut : Bouton retour + Logo */}
        <div className="flex justify-between items-center mb-20">
          <Button
            variant="outline"
            className="group text-[var(--color-lightning-yellow-900)] border-[var(--color-lightning-yellow-300)] hover:bg-[var(--color-lightning-yellow-100)] hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour
          </Button>

          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[var(--color-lightning-yellow-400)] to-[var(--color-lightning-yellow-500)] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <Image src="/logo.png" alt="Smart Ride" width={50} height={50} />
            </div>
          </div>
        </div>

        {/* Milieu : Formulaire */}
        <div className="flex flex-col items-center space-y-8 flex-1 justify-center">
          {/* En-tête */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[var(--color-lightning-yellow-900)]">
              Bienvenue
            </h1>
            <p className="text-[var(--color-lightning-yellow-700)] text-base font-medium">
              Créer votre compte sur{" "}
              <span className="font-bold text-[var(--color-lightning-yellow-800)]">
                SmartRide
              </span>
            </p>
          </div>
          <StandardForm />
        </div>
      </div>

      {/* Image avec overlay */}
      <div className="hidden min-h-screen md:flex w-1/2 relative overflow-hidden">
        <Image
          src="/illustration.jpg"
          alt="Illustration Login"
          className="object-cover w-full h-full "
          fill
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginPage;
