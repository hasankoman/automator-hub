export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth();

  if (status.value === "authenticated" && to.meta.isAuthPage) {
    return "/";
  }

  if (status.value === "unauthenticated" && to.meta.authRequired) {
    return "/auth?redirect=" + to.path;
  }
});
