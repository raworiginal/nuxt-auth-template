import { getHeaders, readBody, setResponseHeader } from "h3";
import {
  revokeAdminUserSessionResultSchema,
  selectedAdminUserSessionIdSchema,
} from "#shared/auth/schemas/admin";

export default defineEventHandler(async (event) => {
  setResponseHeader(event as never, "cache-control", "no-store");

  const parsed = selectedAdminUserSessionIdSchema.safeParse(
    await readBody(event as never),
  );
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid user and session are required.",
    });
  }

  const auth = serverAuth();
  const headers = getHeaders(event as never);
  const authApi = auth.api as typeof auth.api & {
    listUserSessions: (input: {
      body: { userId: string };
      headers: Record<string, string>;
    }) => Promise<{ sessions: Array<{ id: string; token: string }> }>;
    revokeUserSession: (input: {
      body: { sessionToken: string };
      headers: Record<string, string>;
    }) => Promise<{ success: boolean }>;
  };

  const result = await authApi.listUserSessions({
    body: { userId: parsed.data.userId },
    headers,
  });
  const selectedSession = result.sessions.find(
    (session) => session.id === parsed.data.sessionId,
  );

  if (!selectedSession) {
    throw createError({
      statusCode: 404,
      statusMessage: "The selected session was not found.",
    });
  }

  const revokeResult = await authApi.revokeUserSession({
    body: { sessionToken: selectedSession.token },
    headers,
  });

  return revokeAdminUserSessionResultSchema.parse(revokeResult);
});
