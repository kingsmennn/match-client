<template>
  <div class="tw-max-w-7xl tw-mx-auto">
    <div class="tw-p-6 sm:tw-p-10 tw-text-2xl">
      <NuxtLink
        :to="'/accounts/'+user?.uid"
        class="tw-text-xl tw-font-medium tw-inline-flex tw-items-center tw-gap-2">
        <v-icon>mdi-chevron-left</v-icon>
        <span>Back</span>
      </NuxtLink>

      <h1 class="tw-text-5xl tw-font-bold tw-mt-4">New request creation</h1>
      <p class="tw-text-gray-500">
        Please provide some details and images of the item you want to buy.
      </p>

      <form @submit.prevent="handleNewRequest" class="tw-text-2xl">
        <div class="tw-grid tw-grid-cols-3 tw-items-end tw-gap-10 tw-mt-6">
          <div class="tw-col-span-3 sm:tw-col-span-2 tw-row-start-1">
            <label class="tw-relative tw-block">
              <span class="tw-absolute tw-text-base tw-pl-4 tw-pt-1">Name of item</span>
              <input
                v-model="form.name"
                type="text"
                placeholder="Plastic Spatula"
                :required="true"
                class="tw-w-full tw-bg-gray-100 tw-p-4 tw-pt-7 tw-rounded-md tw-outline-black">
            </label>

            <label class="tw-relative tw-block tw-mt-6">
              <span class="tw-absolute tw-top-px tw-left-1 tw-text-base tw-pl-3 tw-pt-[3px] tw-bg-gray-100">Describe this items</span>
              <textarea
                v-model="form.description"
                placeholder="Any spatular made of plastic is fine but it must be black"
                :required="true"
                class="tw-w-full tw-bg-gray-100 tw-p-4 tw-pt-7 tw-rounded-md tw-outline-black
                tw-min-h-[120px] tw-max-h-[120px]">
              </textarea>
            </label>

            <div class="tw-flex tw-bg-gray-100 tw-mt-4 tw-relative tw-rounded-lg">
              <span class="tw-absolute tw-text-base tw-pl-4 tw-pt-1">What state are you searching?</span>
              <label for="state" class="tw-block tw-flex-grow sm:tw-max-w-[50%]">
                <select
                  v-model="form.state"
                  class="tw-block tw-w-full tw-outline-none tw-p-4 tw-pt-7 tw-capitalize 
                  placeholder:tw-text-gray-700"
                  name="state" id="state" :required="true">
                  <option value="">SELECT STATE</option>
                  <option v-for="(state,i) in stateNames" :key="i" :value="state">{{ state }}</option>
                </select>
              </label>
              <label for="lga" class="tw-block tw-border-l-2 tw-flex-grow sm:tw-max-w-[50%]">
                <select
                  v-model="form.lga"
                  class="tw-block tw-w-full tw-outline-none tw-p-4 tw-pt-7 tw-capitalize
                  placeholder:tw-text-gray-700"
                  name="lga" id="lga" :required="true">
                  <option value="">SELECT LGA</option>
                  <option v-for="(lga,i) in activeLgas" :key="i" :value="lga">{{ lga }}</option>
                </select>
              </label>
            </div>
            
            <label v-show="!!form.lga" for="lga" class="tw-block tw-mt-4 tw-relative">
              <span class="tw-absolute tw-text-base tw-pl-4 tw-pt-1">What market should we notify</span>
              <select
                v-model="form.market"
                class="tw-block tw-w-full tw-outline-none tw-p-4 tw-pt-7 tw-capitalize
                placeholder:tw-text-gray-700 tw-bg-gray-100 tw-rounded-lg"
                name="lga" id="lga" :required="false">
                <option value="">SELECT MARKET</option>
                <option v-for="(market,i) in marketsInActiveLga" :key="i" :value="market">{{ market }}</option>
              </select>
            </label>
            <small
              v-if="!!form.lga && !marketsInActiveLga.length"
              class="tw-bg-black tw-text-white tw-px-1 tw-mt-2 tw-leading-tight">
              <v-icon size="20">mdi-alert-circle</v-icon>
              Seems like we haven't added markets in this area. Please contact us to add it.
            </small>
          </div>

          <button
            class="tw-w-full tw-bg-black tw-text-white tw-py-4 tw-rounded-md tw-font-medium
            tw-row-start-4 sm:tw-row-start-2 tw-col-start-1 tw-col-span-full sm:tw-col-span-2
            disabled:tw-bg-black/20"
            :disabled="submiting || uploadingImage">
            <template v-if="!submiting">
              Create!
            </template>
            <v-progress-circular
              v-else
              indeterminate
              color="white"
              size="20" width="2">
            </v-progress-circular>
          </button>

          <div class="tw-col-span-3 sm:tw-col-span-1">
            <div class="tw-h-[300px] tw-bg-gray-100 tw-relative tw-rounded-lg tw-overflow-hidden">
              <v-col class="tw-h-full pa-0">
                <ClientOnly>
                  <v-carousel v-model="carousel" cycle :show-arrows="true"
                    hide-delimiter-background hide-delimiters height="100%">
                    <v-carousel-item ripple v-for="(image, n) in renderedCarouselImages" :key="n" :src="image" cover>
                    </v-carousel-item>
                  </v-carousel>
                </ClientOnly>
              </v-col>

              <!-- image upload progress -->
              <div class="tw-absolute tw-inset-0 tw-flex tw-items-end tw-pointer-events-none">
                <div v-show="!readyForAnotherUpload" class="tw-h-4 tw-w-full">
                  <div
                    :style="`width: ${Number(uploadProgress)*100}%`"
                    class="tw-w-0 tw-h-full tw-bg-black/90 tw-transition-all tw-duration-300">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tw-col-span-full sm:tw-col-span-1">
            <p v-if="files?.length === 1" class="tw-text-xs tw-inline-flex tw-items-center">
              Selected file: <strong>{{ files.item(0)!.name }}</strong>
              <v-icon @click="resetFiles" size="28">mdi-minus-circle</v-icon>
            </p>
            <button
              type="button"
              @click="handleAddImaageBtnClick"
              class="tw-w-full tw-bg-black tw-text-white tw-py-3 tw-mt-2 tw-rounded-md tw-font-medium tw-text-base"
              :disabled="uploadingImage">
              <template v-if="!uploadingImage">
                <span>{{ files?.length === 1 ? 'Upload selected image' : 'Add image' }}</span>
              </template>
              <v-progress-circular
                v-else
                indeterminate
                color="white"
                size="20" width="2">
              </v-progress-circular>
            </button>
          </div>
        </div>
      </form>
    </div>
    <v-dialog v-model="successModal" max-width="300">
      <div class="tw-bg-white tw-p-6 tw-text-black tw-flex tw-flex-col tw-items-center">
        <div class="tw-text-center">
          <h2 class="tw-text-5xl tw-font-bold">Success!!!</h2>
          <p>Your request has been broadcasted</p>
        </div>

        <div class="tw-pb-6 tw-mt-10">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/i-get-am.appspot.com/o/giphy.gif?alt=media&token=06ec1248-5943-4153-aa62-9e4e28d8c9f2"
            class="tw-h-[200px] tw-w-[200px] tw-object-cover tw-object-left tw-rounded-xl">
        </div>
        <p class="tw-text-center tw-font-medium">Redirecting you in 3 seconds...</p>
      </div>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { getDatabase, ref as RTDBRef, set, push, serverTimestamp } from "firebase/database";
import states from '@/nigerian-states.json'
import { RequestLifecycle } from '@/types'

import { useFileDialog } from '@vueuse/core'
import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage, useStorageFile, useCurrentUser } from 'vuefire'

definePageMeta({
  middleware: ['auth', 'buyer'],
  requiresAuth: true,
})

const snackbar = ref({
  show: false,
  text: ''
})

const carousel = ref(0)
const spatularImages = [
  "https://firebasestorage.googleapis.com/v0/b/i-get-am.appspot.com/o/istockphoto-1167356564-612x612.jpg?alt=media&token=ec1b8ee2-d532-4204-a1f3-c66833ee694e",
  "https://firebasestorage.googleapis.com/v0/b/i-get-am.appspot.com/o/istockphoto-1270011649-612x612.jpg?alt=media&token=210f6704-b960-437a-b30b-3ea4c3a146ff",
  "https://firebasestorage.googleapis.com/v0/b/i-get-am.appspot.com/o/istockphoto-134724298-612x612.jpg?alt=media&token=adf99e2d-daef-41f9-af29-4fc4fbb72284"
]
const renderedCarouselImages = computed(()=>form.value.images.length ? form.value.images : spatularImages)

const user = useCurrentUser()
const form = ref({
  name: '',
  description: '',
  images: [] as string[],
  state: '',
  lga: '',
  market: '',
})
const resetForm = ()=>{
  form.value = {
    name: '',
    description: '',
    images: [] as string[],
    state: '',
    lga: '',
    market: '',
  }
}

const statesAndLga = states as {
  code: string
  name: string
  lgas: string[]
}[]
const stateNames = computed(()=>{
  return statesAndLga.map(state=>state.name)
})
watch(()=>form.value.state, (value)=>{
  if(!value) return
  form.value.lga = ''
})
const activeLgas = computed(()=>{
  const state = statesAndLga.find(state=>state.name === form.value.state)
  return state?.lgas || []
})
// fetch this from firebase later
const recordedMarkets = {
  "aba": [
    "aba main market",
    "ahia ohuru (new market)",
    "eziukwu market",
    "ariaria international market",
    "cemetery market",
  ],
  "nsukka": [
    "odenigbo market",
    "orie oba market",
    "orie iheaka market",
    "orie ofulonu market",
    "orie nru market",
    "orie eha alumona market",
    "orie opi market",
    "orie edem market",
    "orie ibagwa market",
    "orie ovoko market",
    "ogige market",
  ],
  "onitsha-north": [
    "onitsha main market",
    "ogboefere market",
    "ogbo ogwu market",
    "ogbo ogwu new market",
    "ogbo ogwu timber market",
    "ogbo ogwu motor parts market",
    "ogbo ogwu building materials market",
    "ogbo ogwu electrical materials market",
    "ogbo ogwu auto spare parts market",
    "ogbo ogwu iron and steel market",
    "ogbo ogwu plastic market",
    "ogbo ogwu textile market",
    "ogbo ogwu foodstuff market",
    "ogbo ogwu yam market",
  ],
  "enugu-east": [
    "abakpa market",
    "new haven market",
  ],
}
const marketsInActiveLga = computed(()=>{
  const markets = recordedMarkets[form.value.lga]
  return markets || []
})
watch(()=>form.value.lga, (value)=>{
  if(!value) return
  form.value.market = ''
})

// IMAGE UPLOAD SECTION
const { files, open, reset: resetFiles } = useFileDialog()
const storage = useFirebaseStorage()
// let mountainFileRef = storageRef(storage, `uploads/${(new Date).toJSON()}`)
const mountainFileRef = computed(()=>{
  const num = Number(form.value.images.length + 1)
  return storageRef(storage, `uploads/${(new Date).toJSON()+num}`)
})
const {
  url,
  uploadProgress,
  uploadError,
  // firebase upload task
  uploadTask,
  upload,
} = useStorageFile(mountainFileRef)
const uploadingImage = ref(false)
const readyForAnotherUpload = ref(true)
const handleAddImaageBtnClick = async () => {
  // if a file has been selected
  if(files.value?.length === 1) {
    // start upload
    uploadingImage.value = true
    readyForAnotherUpload.value = false
    const data = files.value?.item(0)
    if (data) {
      await upload(data)
      uploadingImage.value = false
    }
    return
  }
  open({ accept: 'image/*', multiple: false })
}
// watch till when upload is complete
// then add image to image list(displayed)
watch(()=>url.value, (value)=>{
  if(!value) return
  form.value.images.push(value)
  setTimeout(()=>{
    readyForAnotherUpload.value = true
    resetFiles()
  }, 1000)
})

// SUBMIT REQUEST
const router = useRouter()
const successModal = ref(false)
const submiting = ref(false)
const handleNewRequest = async () => {
  // because image is required
  if(!form.value.images.length) {
    snackbar.value = {
      show: true,
      text: 'Please add at least one image of the item you want to buy'
    }
    return
  }

  submiting.value = true
  const db = getDatabase();
  const requestsRef = RTDBRef(db, 'requests')
  const newRequest = {
    ...form.value,
    buyerId: user.value?.uid,
    lifecycle: RequestLifecycle.PENDING,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  push(requestsRef, newRequest).then((res)=>{
    submiting.value = false
    successModal.value = true
    resetForm()
    resetFiles()
    setTimeout(()=>router.push('/requests/'+res.key), 3000)
  })
}
</script>