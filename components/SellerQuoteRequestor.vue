<template>
  <div>
    <div>
      <div class="tw-col-span-3 sm:tw-col-span-1">
        <div class="tw-h-[200px] tw-bg-gray-100 tw-relative">
          <v-col class="tw-h-full pa-0">
            <ClientOnly>
              <v-carousel v-model="carousel" cycle :show-arrows="images.length>1"
                hide-delimiter-background hide-delimiters height="100%">
                <v-carousel-item ripple v-for="(image, n) in images" :key="n" :src="image" cover>
                </v-carousel-item>
              </v-carousel>
            </ClientOnly>
          </v-col>
          <div v-if="!images.length" class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
            <v-icon>mdi-camera</v-icon>
          </div>
  
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
  
      <div v-if="!hasSubmittedOffer">
        <p v-if="files?.length === 1" class="tw-text-xs tw-inline-flex tw-items-center">
          Selected file: <strong>{{ files.item(0)!.name }}</strong>
          <v-icon @click="resetFiles" size="28">mdi-minus-circle</v-icon>
        </p>
        <button
          type="button"
          @click="handleAddImageBtnClick"
          class="tw-w-full tw-bg-black tw-text-white tw-py-3 tw-mt-2 tw-font-medium tw-text-base"
          :disabled="uploadingImage">
          <template v-if="!uploadingImage">
            <span>{{ files?.length === 1 ? 'Upload selected image' : 'Add proof image' }}</span>
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

    <div>
      <form @submit.prevent="handleFormSubmit" class="tw-text-2xl tw-mt-6">
        <div class="tw-space-y-4">
          <div class="tw-col-span-3 sm:tw-col-span-2 tw-row-start-1">
            <label class="tw-relative tw-block">
              <span class="tw-absolute tw-text-base tw-pl-4 tw-pt-1">How much are you selling(₦)?</span>
              <input
                v-model="form.price"
                type="number"
                placeholder="30000"
                min="0"
                :required="true"
                class="tw-w-full tw-bg-gray-100 tw-p-4 tw-pt-7 tw-rounded-md tw-outline-black">
            </label>
          </div>

          <button
            class="tw-w-full tw-bg-black tw-text-white tw-py-4 tw-rounded-md tw-font-medium
            tw-row-start-4 sm:tw-row-start-2 tw-col-start-1 tw-col-span-full sm:tw-col-span-2
            disabled:tw-bg-black/20"
            :disabled="submiting || uploadingImage || !!uploadTask">
            <template v-if="!submiting">
              {{ hasSubmittedOffer ? 'Update' : 'Submit' }} offer
            </template>
            <v-progress-circular
              v-else
              indeterminate
              color="white"
              size="20" width="2">
            </v-progress-circular>
          </button>
        </div>
      </form>
    </div>
    <v-snackbar
      v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage, useStorageFile, useCurrentUser } from 'vuefire'
import { child, getDatabase, push, ref as RTDBRef, update, serverTimestamp } from 'firebase/database';
import { User, RequestLifecycle } from '@/types';

interface Props {
  requestId: string
  sellerIds: string[]
  images: string[] | null // used to pass default images for after offer is submitted
  quotePrice: number | null // used to pass default price for after offer is submitted
  offerId: string | null // used to update offer
  lockedSellerId: string | null // used to check if seller is locked
}
const props = defineProps<Props>()
const carousel = ref(0)

const images = ref<string[]>([])
const { files, open, reset: resetFiles } = useFileDialog()
const storage = useFirebaseStorage()
const imageFileRef = computed(()=>{
  const num = Number(images.value.length + 1)
  return storageRef(storage, `uploads/${(new Date).toJSON()+num}`)
})
const {
  url,
  uploadProgress,
  uploadError,
  // firebase upload task
  uploadTask,
  upload,
} = useStorageFile(imageFileRef)
const uploadingImage = ref(false)
const readyForAnotherUpload = ref(true)
const handleAddImageBtnClick = async () => {
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
  images.value.push(value)
  setTimeout(()=>{
    readyForAnotherUpload.value = true
    resetFiles()
  }, 1000)
})

const snackbar = ref({
  show: false,
  text: ''
})
const user = useCurrentUser()
const userCookie = useCookie<User>('user')
const form = ref({
  price: null as number | null,
})
const unwatch = watch(()=>props.offerId, ()=>{
  form.value.price = props.quotePrice
  images.value = props.images || []
  unwatch()
})

const submiting = ref(false)
const handleFormSubmit = async () => {
  if(!images.value.length) {
    snackbar.value = {
      show: true,
      text: 'Please add proof image'
    }
    return
  }
  submiting.value = true
  const db = getDatabase();
  let newPostKey;
  if(!hasSubmittedOffer.value) newPostKey = push(child(RTDBRef(db), 'offers')).key;
  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates:any = {};
  // make sure sellerIds is unique
  // if offerId is provided, then update offer
  const offerId = newPostKey || props.offerId
  // this part is for updating offer
  updates[`/offers/${offerId}/price`] = form.value.price;
  updates[`/offers/${offerId}/isAccepted`] = false;
  updates[`/offers/${offerId}/${hasSubmittedOffer.value ? 'updatedAt' : 'createdAt'}`] = serverTimestamp();
  // if seller changes terms of offer, then these should be reset
  // then the buyer can choose another seller or accept the offer again
  if(props.lockedSellerId === user.value?.uid) {
    updates[`/requests/${props.requestId}/lifecycle`] = RequestLifecycle.ACCEPTED_BY_SELLER;
    updates[`/requests/${props.requestId}/lockedSellerId`] = null;
  }
  if(!hasSubmittedOffer.value) {
    updates[`/requests/${props.requestId}/sellerIds`] = Array.from(new Set([...props.sellerIds, user.value?.uid]));
    updates[`/offers/${offerId}/images`] = images.value;
    updates[`/offers/${offerId}/sellerId`] = user.value?.uid;
    updates[`/offers/${offerId}/requestId`] = props.requestId;
    updates[`/offers/${offerId}/storeName`] = userCookie.value?.stores?.[0]?.name || null; // TODO: the storename used should be up to the seller to decide
  }
  await update(RTDBRef(db), updates);
  submiting.value = false
  snackbar.value = {
    show: true,
    text: `You have successfully ${ hasSubmittedOffer.value ? 'updated your' : 'made an' } offer!`
  }
}

const hasSubmittedOffer = computed(()=>props.sellerIds.includes(user.value?.uid!))
</script>