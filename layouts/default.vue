<template>
  <div class="tw-flex tw-flex-col tw-items-center tw-min-h-screen tw-overflow-x-hidden">
    <header
      class="tw-w-full tw-bg-black tw-text-white">
      <div class="tw-px-6 sm:tw-px-10 tw-p-4 tw-max-w-7xl tw-mx-auto tw-flex tw-justify-between tw-items-center">
        <div class="tw-flex tw-items-center tw-gap-10">
          <span class="tw-select-none tw-relative">
            <span class="tw-tracking-tighter tw-text-2xl">
              {{ env.appName }}
            </span>
            <NuxtLink to="/" class="tw-absolute tw-inset-0"></NuxtLink>
          </span>
          <nav v-if="isSeller">
            <NuxtLink to="/requests">Active Requests</NuxtLink>
          </nav>
        </div>
  
        <div class="tw-space-x-2">
          <template v-if="!isAnonymous && isSignedIn">
            <button
              class="tw-bg-black tw-text-white tw-inline-block tw-rounded-md tw-px-2 tw-p-1 tw-select-none"
              @click="logout">
              Logout
            </button>
            <NuxtLink
              :to="`/accounts/${user?.uid}`"
              class="tw-inline-block tw-p-1 tw-px-3 tw-rounded-full tw-bg-white
              tw-select-none tw-text-black hover:tw-bg-white/80
              tw-transition-all tw-duration-300">
              My Account
            </NuxtLink>
          </template>

          <template v-else>
            <NuxtLink
              to="/login"
              class="tw-inline-block tw-p-1 tw-select-none">
              Login
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="tw-inline-block tw-p-1 tw-px-3 tw-rounded-full tw-bg-white
              tw-select-none tw-text-black hover:tw-bg-white/80
              tw-transition-all tw-duration-300">
              Signup
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <main class="tw-flex-grow tw-w-full">
      <slot />
    </main>

    <footer class="tw-max-w-7xl tw-w-full tw-mx-auto tw-px-6 sm:tw-px-10 tw-p-10">
      <div>
        <div class="tw-select-none">
          <span class="tw-font-black tw-text-gray-200 tw-tracking-tighter tw-text-6xl">
            {{ env.appName }}
          </span>
        </div>
      </div>
      <hr class="tw-max-w-7xl tw-w-full tw-mx-auto tw-mb-20 tw-mt-10">
      <div>
        <span class="tw-text-xs tw-text-gray-500">&copy;{{ env.appName }} 2023 | All rights reserved.</span>
        <div class="tw-flex tw-justify-between tw-items-end tw-text-sm">
          <div class="tw-space-x-4 tw-mt-3">
            <NuxtLink to="/">Terms of use</NuxtLink>
          </div>
          <GitBadge text="favourwright" link="http://github.com/favourwright" />
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  signInAnonymously,
  signOut,
} from 'firebase/auth'
import { User, AccountType } from '@/types'
import GitBadge from '@/components/GitBadge.vue';

const auth = useFirebaseAuth() // only exists on client side
const user = useCurrentUser()
// onMounted(async ()=>{
//   signOut(auth!)
//   // const user = await signInAnonymously(auth!)
// })

const env = useRuntimeConfig().public

const isAnonymous  = computed(() => user.value?.isAnonymous)
const isSignedIn = computed(() => user.value !== null)
const userCookie = useCookie<User>('user')
const isSeller = computed(() => userCookie.value?.accountType === AccountType.SELLER)
const isBuyer = computed(() => userCookie.value?.accountType === AccountType.BUYER)
const router = useRouter()
const route = useRoute()
const logout = async () => {
  await signOut(auth!).then(() => {
    userCookie.value = null as unknown as User
  })

  // only redirect if user is on a protected route
  if (route.meta.requiresAuth) {
    router.push('/login')
  }
}
</script>