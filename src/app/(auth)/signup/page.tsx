"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const { signUp, isLoaded } = useSignUp();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoaded) return <div>Loading...</div>;

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Créer le compte
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // 2️⃣ Préparer la vérification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      alert("Compte créé ! Vérification email envoyée.");
      setStep(2);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("Erreur Step 1 :", message);
      setError(message);
      alert(`Erreur : ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Code envoyé :", code.trim());
    console.log("SignUp status avant :", signUp.status);

    try {
      // 3️⃣ Vérifier le code
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      console.log("Résultat vérification :", result);

      if (result.status === "complete") {
        alert("Vérification réussie ! Compte finalisé.");
      } else {
        console.log("Status incomplet :", result.status);
        setError("Code incorrect ou vérification incomplète");
        alert("Code incorrect ou vérification incomplète");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("Erreur complète :", err);
      console.error("Erreur Step 2 :", message);
      setError(message);
      alert(`Erreur : ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleStep1}
              className="flex flex-col gap-4"
            >
              <h2 className="text-2xl font-bold mb-4">Inscription</h2>
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="password"
                placeholder="Mot de passe (min 8 caractères)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
                minLength={8}
                required
              />
              <div id="clerk-captcha"></div>

              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Chargement..." : "Confirmer l'email"}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleStep2}
              className="flex flex-col gap-4"
            >
              <h2 className="text-2xl font-bold mb-4">
                Vérification de l&apos;email
              </h2>
              {error && <p className="text-red-500">{error}</p>}
              <p>Un code de vérification a été envoyé à {email}</p>
              <input
                type="text"
                placeholder="Code de vérification"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Vérification..." : "Valider le code"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUp;
