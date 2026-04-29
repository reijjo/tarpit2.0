import * as z from "zod";

const normalizeEmail = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().toLowerCase();
};

export const RegisterSchema = z.object({
  email: z.preprocess(normalizeEmail, z.email("Invalid email")),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.-]+$/, "Only numbers, letters, and ._- allowed")
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

export const LoginSchema = z.object({
  login: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "min 3 characters")
    .max(255, "max 255 characters"),
  password: z.string().min(8, "min 8 characters").max(50, "Max 50 characters"),
});

export type LoginData = z.infer<typeof LoginSchema>;
