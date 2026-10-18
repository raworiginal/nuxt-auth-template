export default defineNuxtRouteMiddleware(async (to) => {
  const isAppRoute = to.path === "/app" || to.path.startsWith("/app/");

  if (!isAppRoute) {
    return;
  }

  const { data: session } = await useSession(useFetch);

  if (!session.value) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
