import { z } from "zod";
import {
  createAdminUserSchema,
  editAdminUserSchema,
  listUsersOptionsSchema,
  resetAdminUserPasswordSchema,
  banAdminUserSchema,
  unbanAdminUserSchema,
  listAdminUserSessionsSchema,
  adminUserSessionSchema,
  listAdminUserSessionsResultSchema,
  selectedAdminUserSessionIdSchema,
  selectedAdminUserIdSchema,
  revokeAllAdminUserSessionsSchema,
  revokeAdminUserSessionResultSchema,
  revokeAllAdminUserSessionsResultSchema,
  removeAdminUserResultSchema,
} from "~/utils/schemas/admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | Date | null;
};

export type ListUsersSearchOptions = {
  searchValue?: string;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
};

export type ListUsersResult = {
  users: AdminUser[];
  total: number;
  limit?: number;
  offset?: number;
};

export type ListUsersOptions = z.infer<typeof listUsersOptionsSchema>;

export type CreateAdminUserFormData = z.input<typeof createAdminUserSchema>;
export type CreateAdminUserInput = z.output<typeof createAdminUserSchema>;
export type CreateAdminUserResult = {
  user: AdminUser;
};

export type ResetAdminUserPasswordFormData = Omit<
  z.input<typeof resetAdminUserPasswordSchema>,
  "userId"
>;
export type ResetAdminUserPasswordInput = z.input<
  typeof resetAdminUserPasswordSchema
>;
export type ResetAdminUserPasswordResult = {
  status: boolean;
};

export type EditAdminUserFormData = Omit<
  z.input<typeof editAdminUserSchema>,
  "userId"
>;
export type EditAdminUserInput = z.output<typeof editAdminUserSchema>;
export type EditAdminUserResult = AdminUser;

export type BanAdminUserFormData = Omit<
  z.input<typeof banAdminUserSchema>,
  "userId"
>;
export type BanAdminUserInput = z.input<typeof banAdminUserSchema>;
export type BanAdminUserResult = {
  user: AdminUser;
};

export type UnbanAdminUserInput = z.input<typeof unbanAdminUserSchema>;
export type UnbanAdminUserResult = {
  user: AdminUser;
};

export type ListAdminUserSessionsInput = z.input<
  typeof listAdminUserSessionsSchema
>;
export type AdminUserSession = z.infer<typeof adminUserSessionSchema>;
export type ListAdminUserSessionsResult = z.infer<
  typeof listAdminUserSessionsResultSchema
>;
export type RevokeAdminUserSessionInput = z.input<
  typeof selectedAdminUserSessionIdSchema
>;
export type SelectedAdminUserIdInput = z.input<typeof selectedAdminUserIdSchema>;
export type RevokeAdminUserSessionResult = z.infer<
  typeof revokeAdminUserSessionResultSchema
>;
export type RevokeAllAdminUserSessionsInput = z.input<
  typeof revokeAllAdminUserSessionsSchema
>;
export type RevokeAllAdminUserSessionsResult = z.infer<
  typeof revokeAllAdminUserSessionsResultSchema
>;
export type RemoveAdminUserInput = z.input<typeof selectedAdminUserIdSchema>;
export type RemoveAdminUserResult = z.infer<
  typeof removeAdminUserResultSchema
>;
