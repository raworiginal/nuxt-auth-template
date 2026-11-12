import { z } from "zod";
import {
  passwordChangeSchema,
  loginSchema,
  profileSchema,
  registerSchema,
} from "#shared/auth/schemas/auth";

export type SocialProvider = "google" | "github";

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof passwordChangeSchema>;

export type RegisterInput = Omit<RegisterFormData, "confirmPassword">;
export type LoginInput = LoginFormData;
export type ChangePasswordInput = Omit<
  ChangePasswordFormData,
  "confirmPassword"
>;
export type ProfileInput = Omit<ProfileFormData, "image"> & {
  image: string | null;
};
