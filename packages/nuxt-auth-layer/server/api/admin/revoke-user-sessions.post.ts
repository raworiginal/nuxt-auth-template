import { getHeaders, readBody, setResponseHeader } from "h3";
import {
  revokeAllAdminUserSessionsResultSchema,
  revokeAllAdminUserSessionsSchema,
} from "#layers/nuxt-auth-layer/app/utils/schemas/admin";

export default defineEventHandler(async (event) => {
  setResponseHeader(event as never, "cache-control", "no-store");

  const parsed = revokeAllAdminUserSessionsSchema.safeParse(
    await readBody(event as never),
  );
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid user is required.",
    });
  }

  const auth = serverAuth();
  const revokeUserSessions = (auth.api as typeof auth.api & {
    revokeUserSessions: (input: {
      body: { userId: string };
      headers: Record<string, string>;
    }) => Promise<{ success: boolean }>;
  }).revokeUserSessions;

  const result = await revokeUserSessions({
    body: parsed.data,
    headers: getHeaders(event as never),
  });

  return revokeAllAdminUserSessionsResultSchema.parse(result);
});
