<template>
  <div>
    <div class="tw-relative">
      <div class="tw-max-w-7xl tw-mx-auto lg:tw-absolute tw-inset-0 tw-p-6 sm:tw-p-10 tw-z-10">
        <div class="lg:tw-w-1/2 tw-min-h-full tw-bg-white sm:tw-p-6">
          <!-- this Tabs component isn't visually rendered, only used to detect the tab user was
          coming from on the landing page OR the signup form to display -->
          <Tabs :tab_list="tab_list" query_name="user_type" :value="tab" @model-value="handleInitAccountSelected"></Tabs>

          <div>
            <h2 class="tw-text-5xl tw-font-bold">Create an account</h2>
            <form @submit.prevent="handleSignup" class="tw-mt-4 tw-text-2xl">
              <label class="tw-relative tw-block">
                <span class="tw-absolute tw-text-base tw-pl-4 tw-pt-1">Enter email</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="email@example.com"
                  :required="true"
                  class="tw-w-full tw-bg-gray-100 tw-p-4 tw-pt-7 tw-rounded-md tw-outline-black">
              </label>

              <label class="tw-relative tw-mt-4 tw-flex tw-items-center">
                <span class="tw-absolute tw-top-0 tw-text-base tw-pl-4 tw-pt-1">Create password</span>
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

              <label class="tw-block tw-cursor-pointer tw-select-none">
                <input
                  v-model="form.accountType"
                  type="radio"
                  name="account-type"
                  :value="AccountType.BUYER"
                  :required="true"
                  class="tw-appearance-none tw-peer">
                <div
                  class="tw-border-2 peer-checked:tw-border-black tw-text-gray-300 peer-checked:tw-text-black
                  tw-rounded-md tw-p-4 tw-font-medium tw-flex tw-justify-between">
                  <span>I am looking for items to buy</span>
                  <v-icon>mdi-check</v-icon>
                </div>
              </label>

              <label class="tw-block tw-cursor-pointer tw-select-none">
                <input
                  v-model="form.accountType"
                  type="radio"
                  name="account-type"
                  :value="AccountType.SELLER"
                  :required="true"
                  class="tw-appearance-none tw-peer">
                <div
                  class="tw-border-2 peer-checked:tw-border-black tw-text-gray-300 peer-checked:tw-text-black
                  tw-rounded-md tw-p-4 tw-font-medium tw-flex tw-justify-between">
                  <span>I sell stuff</span>
                  <v-icon>mdi-check</v-icon>
                </div>
              </label>

              <button
                class="tw-w-full tw-bg-black tw-text-white tw-py-4 tw-mt-10 tw-rounded-md tw-font-medium"
                :disabled="submiting">
                <template v-if="!submiting">
                  Create account
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
          class="tw-w-full tw-h-full tw-object-cover">
      </div>
    </div>
    <v-snackbar
      v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Tabs.vue'
import { AccountType, User } from '@/types';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { useFirebaseAuth, useFirestore } from 'vuefire'

useHead({
  title: 'iMarket Finder - Register',
})
definePageMeta({
  middleware: 'guest',
})

const tab = ref()
const tab_list:{ slug: string }[] = [
  { slug: AccountType.BUYER },
  { slug: AccountType.SELLER },
]

// export interface Store {
//   name: string
//   description?: string
//   location: {
//     state: string
//     lga: string
//     market: string
//   }
// }
const form = ref<User>({
  email: '',
  password: '',
  accountType: '' as AccountType,

  // secondary data to be collected later or generated
  location: {
    state: null,
    lga: null,
  },
  username: null,
  phone: null,
  stores: null,
  createdAt: new Date(),
})
const showPassword = ref(false)

const snackbar = ref({
  show: false,
  text: ''
})

const handleInitAccountSelected = (value: string) => {
  tab.value = value
  form.value.accountType = value as AccountType
}

const auth = useFirebaseAuth()! // only exists on client side
const db = useFirestore()
const router = useRouter()

const submiting = ref(false)
const handleSignup = () => {
  submiting.value = true
  createUserWithEmailAndPassword(auth, form.value.email, form.value?.password!)
    .then(async (userCredential) => {
      const user = userCredential.user
      console.log({ user })
      await saveUserToFirestore(user)
      await saveToCookie({
        ...form.value,
        // delete password from cookie
        password: null
      })
      snackbar.value = {
        show: true,
        text: 'Account created successfully'
      }
      setTimeout(() => router.push('/accounts/'+ user.uid), 1000)
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      snackbar.value = {
        show: true,
        text: errorCode==='auth/email-already-in-use' ?
          'Email already in use, please login' :
          errorMessage
      }
    })
    .finally(() => submiting.value = false)
}

// function interaction with firestore saves the rest of the user details
const saveUserToFirestore = async (user: any) => {
  const payload = {
    ...form.value,
      id: user.uid,
      createdAt: Timestamp.now() as unknown as Date,
  } as User
  delete payload.password

  await setDoc(doc(db, "users", user.email), payload)
}

const userCookie = useCookie<User>('user')
const saveToCookie = async (user: User) => {
  await new Promise((resolve) => {
    userCookie.value = user
    resolve(true)
  })
}
</script>