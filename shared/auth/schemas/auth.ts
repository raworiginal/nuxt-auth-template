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

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string(),
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  image: z.url("Enter a valid URL").or(z.literal("")),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or fewer"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
