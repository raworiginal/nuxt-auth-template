import { readBody, setResponseHeader } from "h3";
import { inArray } from "drizzle-orm";
import {
  listAdminUserProvidersResultSchema,
  listAdminUserProvidersSchema,
} from "#shared/auth/schemas/admin";
import { db } from "@nuxthub/db";
import { account } from "#auth/schema";

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

  await requireUserSession(event, { user: { role: "admin" } });

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
