<template>
  <div>
    <div class="tw-relative">
      <div class="tw-max-w-7xl tw-mx-auto lg:tw-absolute tw-inset-0 tw-p-6 sm:tw-p-10 tw-z-10">
        <div class="lg:tw-w-1/2 tw-bg-white sm:tw-p-6">
          <div>
            <h2 class="tw-text-5xl tw-font-bold">Welcome back!</h2>
            <form @submit.prevent="handleLogin" class="tw-mt-4 tw-text-2xl">
              <label class="tw-relative tw-block">
                <span class="tw-absolute tw-text-base tw-pl-4 tw-pt-1">Enter your email</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="email@example.com"
                  :required="true"
                  class="tw-w-full tw-bg-gray-100 tw-p-4 tw-pt-7 tw-rounded-md tw-outline-black">
              </label>

              <label class="tw-relative tw-mt-4 tw-flex tw-items-center">
                <span class="tw-absolute tw-top-0 tw-text-base tw-pl-4 tw-pt-1">Enter your password</span>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="******"
                  :required="true"
                  class="tw-w-full tw-bg-gray-100 tw-p-4 tw-pt-7 tw-rounded-md tw-outline-black">
                  <v-icon
                    @click="()=>showPassword=!showPassword"
                    :class="[showPassword ? '!tw-text-black' : '!tw-text-gray-300']"
                    class="!tw-absolute !tw-right-0 !tw-mx-3 tw-bg-gray-100 !tw-rounded-2xl">
                    {{ showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
                  </v-icon>
              </label>

              <button
                class="tw-w-full tw-bg-black tw-text-white tw-py-4 tw-mt-10 tw-rounded-md tw-font-medium"
                :disabled="logingIn">
                <template v-if="!logingIn">
                  Login
                </template>
                <v-progress-circular
                  v-else
                  indeterminate
                  color="white"
                  size="20" width="2">
                </v-progress-circular>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="tw-hidden lg:tw-block tw-h-[calc(100vh-80px)] tw-bg-gray-50">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/i-get-am.appspot.com/o/pexels-laura-james-6097813.jpg?alt=media&token=87a84a9c-2917-4502-84b9-6d1d032b0770"
          class="tw-w-full tw-h-full tw-object-cover tw-object-top">
      </div>
    </div>

    <v-snackbar
      v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { useFirebaseAuth, useFirestore } from 'vuefire'
import { User } from 'types';

useHead({
  title: 'iMarket Finder - Login',
})
definePageMeta({
  middleware: 'guest',
})

const form = ref({
  email: '',
  password: '',
})
const showPassword = ref(false)

const snackbar = ref({
  show: false,
  text: ''
})

const auth = useFirebaseAuth()! // only exists on client side
const db = useFirestore()

const router = useRouter()
const logingIn = ref(false)
const userCookie = useCookie<User>('user')
const handleLogin = () => {
  logingIn.value = true
  signInWithEmailAndPassword(auth, form.value.email, form.value.password)
    .then(async (userCredential) => {
      const user = userCredential.user
      if (user) {
        const userFromFirestore = await getUserFromFirstore(user.email!)
        if (userFromFirestore) {
          userCookie.value = userFromFirestore
          router.push('/accounts/'+ user.uid)
        } else {
          snackbar.value = {
            show: true,
            text: 'Ok, this is weird. We could not find your account in our database. Please contact support'
          }
        }
      }
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      snackbar.value = {
        show: true,
        text: errorCode==='auth/user-not-found' ?
          'User not found' :
          errorMessage
      }
    })
    .finally(()=>logingIn.value = false)
}

const getUserFromFirstore = async (email: string) => {
  const userRef = doc(db, 'users', email)
  const userSnap = await getDoc(userRef)
  if (userSnap.exists()) {
    return userSnap.data() as User
  }
  return null
}
</script>