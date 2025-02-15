export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth();

  if (status.value === "authenticated" && to.meta.isAuthPage) {
    return "/";
  }
});
