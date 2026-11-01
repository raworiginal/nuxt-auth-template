import { getHeaders, readBody, setResponseHeader } from "h3";
import { listAdminUserSessionsSchema } from "~/utils/schemas/admin";

export default defineEventHandler(async (event) => {
  setResponseHeader(event as never, "cache-control", "no-store");

  const parsed = listAdminUserSessionsSchema.safeParse(
    await readBody(event as never),
  );
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid user is required.",
    });
  }

  const auth = serverAuth();
  const listUserSessions = (auth.api as typeof auth.api & {
    listUserSessions: (input: {
      body: { userId: string };
      headers: Record<string, string>;
    }) => Promise<{
      sessions: Array<{ createdAt: Date; expiresAt: Date }>;
    }>;
  }).listUserSessions;
  const result = await listUserSessions({
    body: parsed.data,
    headers: getHeaders(event as never),
  });

  return {
    userId: parsed.data.userId,
    sessions: result.sessions.map((session) => ({
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    })),
  };
});
