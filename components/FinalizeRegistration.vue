<template>
  <div>
    <div
      class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 sm:tw-items-center tw-justify-between
      tw-bg-black tw-p-3 tw-rounded-lg tw-text-white md:tw-gap-10">
      <div class="tw-space-y-1">
        <div>
          <strong>Almost done!</strong> {{ heading }}
          <small class="tw-block tw-mb-2">
            <v-icon size="20">mdi-alert-circle</v-icon>
            {{ subHeading }}
          </small>
        </div>
        <div class="tw-h-3 tw-rounded-full tw-bg-white/40 tw-overflow-hidden">
          <span class="tw-block tw-h-full tw-w-[70%] tw-bg-white tw-rounded-full"></span>
        </div>
      </div>
  
      <button
        class="tw-px-3 tw-py-1 tw-rounded-full tw-bg-white tw-text-black
        hover:tw-bg-white/80 tw-transition-all tw-duration-300"
        @click="complete">
        Complete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/pinia/user';
import { AccountType, STORE_KEY_MIDDLEWARE, User } from '@/types';
import { toast } from 'vue-sonner';

const {
  location,
  getDevicePosition,
  locationWarnNotice
} = useGetLocation()

const heading = computed(()=>
  userStore.accountType === AccountType.BUYER ?
    'We just need access to your location 📍' :
    userStore.accountType === AccountType.SELLER ?
      'Lets help you setup your store' :
      null
)
const subHeading = computed(()=>
  userStore.accountType === AccountType.BUYER ?
    "For us to give you the best match for your items, you're advised to complete this step in the area you live" :
    userStore.accountType === AccountType.SELLER ?
      'This process is required for you to start using our platform as a '+AccountType.SELLER :
      null
)

const userStore = useUserStore()
const userCookie = useCookie<User>(STORE_KEY_MIDDLEWARE, { watch: true })
const router = useRouter()
const complete = () => {
  userStore.accountType === AccountType.BUYER ?
    getDevicePosition({
      // bePrecise:true,
      callback: async () => {
        try {
          const res = await userStore.updateUser({
            lat: location.value.lat,
            long: location.value.lng
          })
          if (userStore?.userDetails) {
            userStore.userDetails[3] = [
              res?.location[0]!,
              res?.location[1]!
            ]
            userCookie.value.location = [
              res?.location[0]!,
              res?.location[1]!
            ]
          }
        } catch (e){
          console.log(e)
        }
      },
      onError: (error) => {
        toast.error('Please try again: '+error.message)
      }
    }) :
    userStore.accountType === AccountType.SELLER ? router.push('/accounts/store-setup') : null
}
</script>