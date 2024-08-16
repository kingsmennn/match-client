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
          <button
            id="account-type"
            class="tw-inline-flex tw-items-center tw-p-1 tw-px-3 tw-rounded-full tw-bg-white
            tw-select-none tw-text-black hover:tw-bg-white/80
            tw-transition-all tw-duration-300"
            :disabled="connecting"
            @click="()=>userStore.isConnected ? null : handleWalletConnect()">
            <template v-if="!connecting">
              {{ userStore.isConnected ? 'Connected' : 'Connect' }}
            </template>
            <v-progress-circular
              v-else
              indeterminate
              color="black"
              size="20"
              width="2"
            >
            </v-progress-circular>
          </button>

          <v-menu v-if="userStore.isConnected" activator="#account-type" transition="slide-y-transition">
            <div
              class="tw-bg-white tw-mt-2 tw-rounded-lg tw-flex tw-flex-col
              tw-gap-3 tw-shadow-lg">
              <span class="tw-text-sm tw-border-b tw-px-3 tw-py-2 tw-pb-1.5">
                Active account id <strong>{{ userStore.accountId }}</strong>
              </span>
              <div class="tw-flex tw-flex-col tw-gap-y-3 tw-px-3 tw-pb-3">
                <button
                  class="tw-select-none tw-self-start tw-text-rose-700"
                  @click="disconnect">
                  disconnect
                </button>
                <NuxtLink
                  to="/account"
                  class="tw-bg-black tw-text-white tw-justify-center tw-rounded-md tw-px-2 tw-p-1 tw-select-none">
                  My account
                </NuxtLink>
              </div>
            </div>
          </v-menu>
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
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { User, AccountType } from '@/types'
import { useUserStore } from '@/pinia/user';

const env = useRuntimeConfig().public

const userCookie = useCookie<User>('user')
const isSeller = computed(() => userCookie.value?.accountType === AccountType.SELLER)




const userStore = useUserStore()
const connecting = ref(false)
const handleWalletConnect = async () => {
  connecting.value = true;
  try {
    await userStore.connectToHashConnect();
    // once connected the subscription function will update the user store
  } catch (e) {
    // haldle errors
    console.log(e);
  } finally {
    connecting.value = false;
  }
};
const disconnect = () => {
  userStore.disconnect()

  // only redirect if user is on a protected route
  // if (route.meta.requiresAuth) {
  //   router.push('/login')
  // }
}
const router = useRouter()
// check if connected user has been saved to the blockchain
watch([()=>userStore.blockchainError.userExists, ()=>userStore.accountId], ([userExists, accountId]) => {
  if (userExists && accountId) {
    // redirect to register page
    router.push('/register')
  }
})
</script>