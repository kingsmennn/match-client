<template>
  <div>
    <div class="tw-relative">
      <div
        class="tw-max-w-7xl tw-mx-auto lg:tw-absolute tw-inset-0 tw-p-6 sm:tw-p-10 tw-z-10"
      >
        <div class="lg:tw-w-1/2 tw-bg-white sm:tw-p-6">
          <div>
            <h2 class="tw-text-5xl tw-font-bold">Welcome back!</h2>
            <button
              class="tw-w-full tw-bg-black tw-text-white tw-py-4 tw-mt-10 tw-rounded-md tw-font-medium"
              :disabled="logingIn"
              @click="handleLogin"
            >
              <template v-if="!logingIn"> Connect </template>
              <v-progress-circular
                v-else
                indeterminate
                color="white"
                size="20"
                width="2"
              >
              </v-progress-circular>
            </button>
          </div>
        </div>
      </div>

      <div class="tw-hidden lg:tw-block tw-h-[calc(100vh-80px)] tw-bg-gray-50">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/i-get-am.appspot.com/o/pexels-laura-james-6097813.jpg?alt=media&token=87a84a9c-2917-4502-84b9-6d1d032b0770"
          class="tw-w-full tw-h-full tw-object-cover tw-object-top"
        />
      </div>
    </div>

    <v-snackbar v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { connectToHashConnect } from "../blockchain/";
import { User } from "types";

useHead({
  title: "iMarket Finder - Login",
});
definePageMeta({
  middleware: "guest",
});

const snackbar = ref({
  show: false,
  text: "",
});

const router = useRouter();
const logingIn = ref(false);
const userCookie = useCookie<User>("user");
const handleLogin = () => {
  logingIn.value = true;
  try {
    connectToHashConnect();
    // // on success
    // setTimeout(() => router.push("/accounts/" + `user.uid`), 1000);
  } catch (e) {
    // haldle errors
    console.log(e);
  } finally {
    logingIn.value = false;
  }
};
</script>
