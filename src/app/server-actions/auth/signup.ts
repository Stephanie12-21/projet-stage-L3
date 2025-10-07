"use server";

import { prisma } from "@/lib/prisma";

export async function createUserInDB(data: {
  clerkId: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        phone: data.phone,
      },
    });

    console.log("✅ Utilisateur créé en base :", user);
    return { success: true, user };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Erreur Prisma :", err.message);
      return { success: false, error: err.message };
    } else {
      console.error("❌ Erreur Prisma :", err);
      return { success: false, error: "Une erreur inconnue est survenue." };
    }
  }
}
