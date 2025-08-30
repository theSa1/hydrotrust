"use client";

import { create } from "zustand";

type UserState = {
  address: string | null;
  role: string | null;
  setUser: (user: { address: string | null; role: string | null }) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  address: null,
  role: null,
  setUser: (user) => set({ address: user.address, role: user.role }),
  resetUser: () => set({ address: null, role: null }),
}));
