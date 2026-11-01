import { z } from "zod";
import { listUsersOptionsSchema } from "~/utils/schemas/admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
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
