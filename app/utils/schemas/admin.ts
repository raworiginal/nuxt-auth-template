import { z } from "zod";

export const createAdminUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or fewer"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or fewer"),
    confirmPassword: z.string(),
    role: z.enum(["user", "admin"]).default("user"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetAdminUserPasswordSchema = z
  .object({
    userId: z.string().min(1, "User is required"),
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

export const editAdminUserSchema = z.object({
  userId: z.string().min(1, "User is required"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z.email("Enter a valid email address"),
  role: z.enum(["user", "admin"]),
});

export const banAdminUserSchema = z.object({
  userId: z.string().min(1, "User is required"),
  banReason: z
    .string()
    .trim()
    .max(500, "Ban reason must be 500 characters or fewer")
    .optional(),
  duration: z
    .number({ error: "Duration must be a number" })
    .positive("Duration must be greater than zero")
    .finite("Duration must be finite")
    .optional(),
  durationUnit: z.enum(["seconds", "minutes", "hours", "days"]),
});

export const unbanAdminUserSchema = z.object({
  userId: z.string().min(1, "User is required"),
});

export const listUsersOptionsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  searchValue: z.string().optional(),
  searchField: z.enum(["email", "name"]).optional(),
  searchOperator: z
    .enum(["contains", "starts_with", "ends_with"])
    .optional(),
});

export const listAdminUserSessionsSchema = z.object({
  userId: z.string().trim().min(1, "User is required"),
});

export const selectedAdminUserIdSchema = z.object({
  userId: z.string().trim().min(1, "User is required"),
});

export const selectedAdminUserSessionIdSchema = selectedAdminUserIdSchema.extend({
  sessionId: z.string().trim().min(1, "Session is required"),
});

export const revokeAllAdminUserSessionsSchema = selectedAdminUserIdSchema;

export const adminUserSessionSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  expiresAt: z.string().min(1),
});

export const listAdminUserSessionsResultSchema = z.object({
  userId: z.string().min(1),
  sessions: z.array(adminUserSessionSchema),
});

export const revokeAdminUserSessionResultSchema = z.object({
  success: z.boolean(),
});

export const revokeAllAdminUserSessionsResultSchema = z.object({
  success: z.boolean(),
});
