export default defineNuxtRouteMiddleware((to) => {
  try {
    const { loggedIn } = useUserSession();
    if (loggedIn.value && (to.name === "login" || to.name === "register")) {
      return navigateTo("/");
    }
  } catch (error) {
    console.log(error);
  }
});
