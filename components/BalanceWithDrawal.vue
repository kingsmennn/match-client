<script setup lang="ts">
import { useUserStore } from "@/pinia/user";
import { tokens } from "~/utils/constants";
import { CoinPayment } from "@/types";

const userStore = useUserStore();

const balances = ref<{
  coin: CoinPayment;
  balance: number;
}[]>([])
const fetching = ref(true);
const fetchBalance = async () => {
  fetching.value = true
  try {
    Object.values(CoinPayment).map(async (coin) => {
      const res = await userStore.getSellerBalance(userStore.accountId!, coin);
      console.log({coin, res})
      balances.value.push({
        coin,
        balance: res
      })
    })
  } catch (error) {
    console.log(error)
  } finally {
    fetching.value = false
  }
}
onMounted(fetchBalance)
</script>

<template>
  <div
    class="tw-flex tw-flex-col tw-gap-3 tw-ring-1
    tw-ring-black/10 tw-rounded-xl tw-p-4 tw-bg-black/5">
    <div class="tw-flex tw-items-center tw-justify-between">
      <h2 class="tw-text-3xl tw-font-bold">Balance</h2>
      <!-- refresh balance -->
      <button
        @click="fetchBalance"
        class="tw-text-black tw-text-sm"
        :class="{ 'tw-animate-spin': fetching }">
        <v-icon>mdi-refresh</v-icon>
      </button>
    </div>
    <ul class="tw-grid tw-grid-cols-2 tw-gap-4">
      <li
        v-for="(balance, index) in balances" :key="index"
        class="tw-ring-1 tw-ring-black/10 tw-rounded-md tw-p-4 tw-bg-white
        tw-flex tw-items-center tw-justify-between">
        <span>{{ balance.balance + balance.coin }}</span>
        <button
          @click="userStore.withdrawSellerProfit(balance.coin)"
          class="tw-bg-black tw-text-white tw-rounded-full tw-py-2
          tw-px-4 tw-text-sm tw-font-bold"
          :class="{ 'tw-bg-black/80': fetching || balance.balance <= 0 }"
          :disabled="fetching || balance.balance <= 0">
          Withdraw
        </button>
      </li>
    </ul>
  </div>
</template>