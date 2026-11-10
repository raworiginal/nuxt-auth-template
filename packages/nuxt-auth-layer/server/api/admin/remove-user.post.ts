import { getHeaders, readBody, setResponseHeader } from "h3";
import {
  removeAdminUserResultSchema,
  selectedAdminUserIdSchema,
} from "#layers/nuxt-auth-layer/app/utils/schemas/admin";

export default defineEventHandler(async (event) => {
  setResponseHeader(event as never, "cache-control", "no-store");

  const parsed = selectedAdminUserIdSchema.safeParse(
    await readBody(event as never),
  );
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid user is required.",
    });
  }

  const auth = serverAuth();
  const removeUser = (auth.api as typeof auth.api & {
    removeUser: (input: {
      body: { userId: string };
      headers: Record<string, string>;
    }) => Promise<{ success: boolean }>;
  }).removeUser;

  const result = await removeUser({
    body: parsed.data,
    headers: getHeaders(event as never),
  });

  return removeAdminUserResultSchema.parse(result);
});
