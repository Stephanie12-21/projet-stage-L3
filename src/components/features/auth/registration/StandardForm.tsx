"use client";

import { signUpAsAdmin } from "@/app/server-actions/auth/registration/asAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StandardForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signUpAsAdmin(formData);

    if (result.status === "success") {
      toast.success(
        "Inscription réussie ! Merci de confirmer votre email avant de vous connecter."
      );
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      toast.error("Une erreur est survenue lors de l'inscription.");
      setError(result.status);
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:gap-4 space-y-4 md:space-y-0">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" required className="h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                className="h-11"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">Il y a une erreur : {error}</p>
          )}
        </div>

        <div className="flex flex-col space-y-4 pt-10">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11  bg-[#C3875D] hover:bg-[#A86D49] text-white font-medium rounded-md"
          >
            {loading ? "Création en cours..." : "Créer mon compte"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </>
  );
};

export default StandardForm;
