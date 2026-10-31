export default defineNuxtRouteMiddleware(async (to) => {
  const isAdminRoute = to.path === "/admin" || to.path.startsWith("/admin/");

  if (!isAdminRoute) {
    return;
  }

  const { data: session } = await useSession(useFetch);

  if (!session.value) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else if (session.value.user.role !== "admin") {
    return navigateTo({
      path: "/app",
      query: { redirect: to.fullPath },
    });
  }
});
