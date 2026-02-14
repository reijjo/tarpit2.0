import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-Z0-9_.-]+$/, "Only numbers, letters, and ._- allowed")
    .min(3, "Min 3 characters on username")
    .max(20, "Max 20 characters on username"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .max(50, "Max 50 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(
      /[!@#$%&*_+\-=.?]/,
      "Must contain one special character (!@#$%&*_+-=.?)",
    ),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
