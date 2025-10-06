import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./context/provider";

// Définition de la police Poppins avec variable CSS et poids
const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // poids que tu veux utiliser
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SmartRide",
  description: "Projet Stage L3 réalisé par Stéphanie MAMINIAINA",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
