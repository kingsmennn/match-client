<template>
  <div class="tw-max-w-7xl tw-mx-auto">
    <div class="tw-p-6 sm:tw-p-10">
      <h1 class="tw-text-5xl tw-font-bold tw-mt-4">
        List of requests made in <span class="tw-capitalize">{{ userCookie?.stores?.[0]?.location.lga! || '???' }}</span>
      </h1>
      <p
        v-if="!(!!userCookie?.stores?.[0]?.location.lga!)"
        class="tw-text-white tw-bg-black">
        Please complete your profile in your account page to be able to view requests.
      </p>
      
      <div v-if="!loading" class="tw-grid sm:tw-grid-cols-2 tw-gap-3 tw-mt-10">
        <RequestItem
          v-for="request in userRequestList" :key="request.id"
          :requestId="request.id!"
          :lifecycle="request.lifecycle"
          :itemName="request.name"
          :thumbnail="request.images[0]"
          :created-at="request.createdAt"
          :buyerId="request.buyerId"
          :locked-seller-id="request.lockedSellerId ?? null"
          :sellers-price-quote="request.sellersPriceQuote ?? null"
          :account-type="userCookie?.accountType"
        />
      </div>

      <div
        v-else
        class="tw-p-6 tw-py-10 tw-text-center tw-border-4 tw-border-gray-400/5 tw-rounded-2xl
        tw-bg-gray-300/5 tw-my-10 tw-text-2xl tw-text-gray-500">
        <p>loading...</p>
      </div>

      <div
        v-if="!loading && !userRequestList.length"
        class="tw-p-6 tw-py-10 tw-text-center tw-border-4 tw-border-gray-400/5 tw-rounded-2xl
        tw-bg-gray-300/5 tw-my-10 tw-text-2xl tw-text-gray-500">
        <p>No requests have been made in this location</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDatabase, query, ref as RTDBRef, orderByChild, equalTo, onValue } from 'firebase/database';
import { User, Request } from '@/types';

definePageMeta({
  middleware: ['auth', 'seller'],
  requiresAuth: true,
})

// const user = useCurrentUser()
const userCookie = useCookie<User>('user')
const userRequestList = ref<Request[]>([])
const loading = ref(true)
// fetching from firebase RTDB
const fetchUserRequests = async () => {
  loading.value = true
  const db = getDatabase();
  const myRequestsRef = query(RTDBRef(db, 'requests/'), orderByChild('lga'), equalTo(userCookie.value?.stores?.[0]?.location.lga!))

  onValue(myRequestsRef, (snapshot) => {
    const newRequestList: Request[] = []
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      newRequestList.push({
        id: childKey,
        ...childData,
      } as Request)
    });
    userRequestList.value = newRequestList
    loading.value = false
  });
}
fetchUserRequests()
</script>