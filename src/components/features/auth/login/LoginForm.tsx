"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resendConfirmationEmail,
  signIn,
} from "@/app/server-actions/auth/login";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setUnconfirmedEmail(null);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await signIn(formData);

      if (result.status === "success" && result.email) {
        try {
          const response = await fetch("/api/get-slug", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: result.email }),
          });

          const data = await response.json();

          if (!data?.slug || !data?.role) {
            console.log("erreur trouvée :", error);
            setError("Impossible de récupérer votre espace personnel.");
            toast.error(
              "Vous ne semblez pas avoir de compte utilisateur, veuillez vous connecter d'abord."
            );
            return;
          }

          const role = data.role.toUpperCase();

          toast.success("Connexion réussie ! Redirection en cours...");
          setRedirecting(true);

          setTimeout(() => {
            if (role === "ADMIN" || role === "CLIENT") {
              router.push(`/espace_client/${data.slug}/newsletter`);
            } else if (role === "SUPERADMIN") {
              router.push(`/espace_admin/${data.slug}/newsletter`);
            } else {
              setError(
                "Vous n'êtes pas autorisé à accéder à cet espace. Veuillez contacter l'administrateur."
              );
              toast.error(
                "Vous n'êtes pas autorisé à accéder à cet espace. Veuillez contacter l'administrateur."
              );
              setRedirecting(false);
            }
          }, 3000);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
            toast.error(err.message);
          } else {
            setError("Erreur lors de la récupération des données.");
            toast.error("Erreur lors de la récupération des données.");
          }
        }
      } else if (result.status === "error") {
        switch (result.reason) {
          case "invalid_credentials":
            toast.error("Les données saisies semblent incorrectes.");
            break;
          case "user_not_found":
            toast.error("Cet utilisateur n'existe pas.");
            break;
          case "email_not_confirmed":
            toast.error(
              "Votre email n'est pas encore vérifié. Veuillez vérifier votre boîte de réception."
            );
            setUnconfirmedEmail(result.email);
            break;
          default:
            toast.error("Une erreur est survenue lors de la connexion.");
        }
        setError(result.reason || "Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-md shadow-xl border border-[#e8a530]/20 p-6">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-[#e8a530]">
            Bon retour !
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connectez-vous à votre compte pour continuer
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#e8a530] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="jean.dupont@example.com"
                required
                className="h-11 border-gray-200 focus:border-[#e8a530] focus:ring-[#e8a530]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#e8a530] font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="h-11 border-gray-200 focus:border-[#e8a530] focus:ring-[#e8a530]/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-[#e8a530]  hover:underline transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            disabled={loading || redirecting}
            className="w-full h-11 bg-[#e8a530]  text-white transition-colors shadow-md hover:shadow-lg"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>

          {redirecting && (
            <p className="text-sm text-center text-[#e8a530 ] font-medium">
              Redirection en cours...
            </p>
          )}

          {unconfirmedEmail && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#e8a530] text-[#e8a530] "
              onClick={async () => {
                const res = await resendConfirmationEmail(unconfirmedEmail);
                if (res.status === "success") {
                  toast.success(res.message);
                } else {
                  toast.error(res.message);
                }
              }}
            >
              Renvoyer l&apos;email de confirmation
            </Button>
          )}

          <p className="text-sm text-center text-gray-600">
            Vous n&apos;avez pas encore de compte ?{" "}
            <Link
              href="/register/"
              className="text-[#e8a530] hover:underline font-medium transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginForm;
