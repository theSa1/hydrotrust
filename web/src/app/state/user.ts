"use client";

import { create } from "zustand";

type UserState = {
  address: string | null;
  role: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: {
    address: string | null;
    role: string | null;
    isLoading: boolean;
    error: string | null;
  }) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  address: null,
  role: null,
  isLoading: false,
  error: null,
  setUser: (user) =>
    set({
      address: user.address,
      role: user.role,
      isLoading: user.isLoading,
      error: user.error,
    }),
  resetUser: () => set({ address: null, role: null }),
}));
