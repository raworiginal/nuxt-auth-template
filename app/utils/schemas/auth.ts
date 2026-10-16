import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or fewer"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "password must be 128 characters or fewer"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFromData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string(),
});

export type LoginSchemaFormData = z.infer<typeof loginSchema>;
