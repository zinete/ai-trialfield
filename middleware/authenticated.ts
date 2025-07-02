export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    const redirectUrl = encodeURIComponent(to.fullPath);
    return navigateTo(`/login?redirect=${redirectUrl}`);
  }
});
