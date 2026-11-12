import { getHeaders, readBody, setResponseHeader } from "h3";
import { inArray } from "drizzle-orm";
import {
  listAdminUserProvidersResultSchema,
  listAdminUserProvidersSchema,
} from "#shared/auth/schemas/admin";
import { account } from "../../db/schema/auth-schema";
import getDatabase from "../../utils/database";

const db = getDatabase();

export default defineEventHandler(async (event) => {
  setResponseHeader(event as never, "cache-control", "no-store");

  const parsed = listAdminUserProvidersSchema.safeParse(
    await readBody(event as never),
  );
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid list of users is required.",
    });
  }

  const auth = serverAuth();
  const session = await auth.api.getSession({
    headers: getHeaders(event as never),
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "You must be signed in to view user providers.",
    });
  }

  const sessionUser = session.user as typeof session.user & {
    role?: string | null;
  };
  if (sessionUser.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "You are not authorized to view user providers.",
    });
  }

  const userIds = [...new Set(parsed.data.userIds)];
  const providersByUserId = Object.fromEntries(
    userIds.map((userId) => [userId, [] as string[]]),
  );
  const accounts = await db
    .select({ userId: account.userId, providerId: account.providerId })
    .from(account)
    .where(inArray(account.userId, userIds));

  for (const linkedAccount of accounts) {
    const providers = providersByUserId[linkedAccount.userId];
    if (providers && !providers.includes(linkedAccount.providerId)) {
      providers.push(linkedAccount.providerId);
    }
  }

  for (const providers of Object.values(providersByUserId)) {
    providers.sort();
  }

  return listAdminUserProvidersResultSchema.parse({ providersByUserId });
});
