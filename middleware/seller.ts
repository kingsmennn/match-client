import { User, AccountType } from '@/types'
export default defineNuxtRouteMiddleware(async (to, from) => {
  const userCookie = useCookie<User>('user')

  // redirect the user to the login page
  if (!userCookie.value?.accountType || userCookie.value?.accountType !== AccountType.SELLER) {
    console.log('only sellers can access dashboard page')
    return navigateTo({
      path: '/',
      query: {
        redirect: to.fullPath,
      },
    })
  }
})