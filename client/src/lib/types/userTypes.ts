import { UserRole } from "@/features/auth/types";

export type MeData = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};
