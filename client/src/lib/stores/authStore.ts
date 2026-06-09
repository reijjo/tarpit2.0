import { create } from "zustand";

import { MeData } from "../types/userTypes";

type AuthStore = {
  me: MeData | null;
  setMe: (me: MeData | null) => void;
  clearMe: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  me: null,
  setMe: (me) => set({ me }),
  clearMe: () => set({ me: null }),
}));
