"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { createUser } from "@/app/server-actions/auth/register";

export function RegistrationForm() {
  const { signUp, isLoaded } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;

    // Validation simple
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      // Création du compte Clerk
      const result = await signUp.create({
        emailAddress: email,
        password,
      });
      console.log(result);

      // Split nom complet
      const firstName = name.split(" ")[0];
      const lastName = name.split(" ").slice(1).join(" ");

      await signUp.update({ firstName, lastName });

      // Email verification via code (recommandé pour version récente)
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Enregistrement dans la base Prisma
      await createUser({
        nom: firstName,
        prenom: lastName,
        email,
        phone,
      });

      alert(
        "Compte créé ! Un code de vérification a été envoyé sur votre email."
      );

      // Réinitialiser le formulaire
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setIsLoading(false);
    } catch (err: unknown) {
      console.error("Erreur Clerk:", err);
      let message = "Une erreur est survenue.";

      if (err instanceof Error) {
        message = err.message;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as { errors: { message?: string }[] }).errors)
      ) {
        const clerkError = (err as { errors: { message?: string }[] })
          .errors[0];
        message = clerkError?.message || message;
      }

      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border bg-card shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-card-foreground">
          Créer un compte
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Entrez vos informations pour commencer
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              required
              placeholder="+261 34 12 345 67"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              placeholder="Min. 8 caractères"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              placeholder="Confirmez votre mot de passe"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div id="clerk-captcha" />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte...
              </>
            ) : (
              "Créer un compte"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <a href="/auth/connexion" className="text-accent hover:underline">
              Se connecter
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
