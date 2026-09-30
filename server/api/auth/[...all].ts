import { auth } from "~~/server/auth"; // path to your auth file

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});
