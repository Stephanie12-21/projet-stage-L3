import { User } from "@/generated/prisma";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>()(
  // Persister le store dans le localStorage, pour que même après un refresh, l'utilisateur reste connecté
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "supabase-user" } 
  )
);

export default useUserStore;
