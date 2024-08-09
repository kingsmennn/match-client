export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser()

  // user is logged in, redirect to home page
  if (user) {
    return navigateTo({
      path: `/accounts/${user.uid}`,
      query: {
        redirect: to.fullPath,
      },
    })
  }
})