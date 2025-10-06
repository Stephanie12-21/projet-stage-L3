"use server";

import { prisma } from "@/lib/prisma"; // Assure-toi que ton client Prisma est exposé ici

interface CreateUserParams {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
}

export async function createUser({
  nom,
  prenom,
  email,
  phone,
}: CreateUserParams) {
  try {
    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        phone,
        role: "PARENT", // Par défaut, tu peux changer
      },
    });
    return user;
  } catch (err) {
    console.error("Erreur en créant l'utilisateur :", err);
    throw err;
  }
}
