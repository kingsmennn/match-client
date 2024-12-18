<script setup lang="ts">
import { useUserStore } from "@/pinia/user";
import { tokens } from "~/utils/constants";
import { CoinDecimals, CoinPayment } from "@/types";

const userStore = useUserStore();

type Balance = {
  coin: CoinPayment;
  balance: number;
}
const balances = ref<Balance[]>([])
const fetching = ref(true);
const fetchBalance = async () => {
  fetching.value = true;
  balances.value = [];
  try {
    const promises = Object.values(CoinPayment).map(async (coin) => {
      const res = await userStore.getSellerBalance(userStore.accountId!, coin);
      const index = Object.values(CoinPayment).indexOf(coin);
      return { coin, balance: Number(res) /
        10 **
        CoinDecimals[coin] };
    });
    const results = await Promise.all(promises);
    balances.value = results;
  } catch (error) {
    console.log(error);
  } finally {
    fetching.value = false;
  }
};
onMounted(fetchBalance)

const handleWithdraw = async (coin: CoinPayment) => {
  await userStore.withdrawSellerProfit(coin)
}
</script>

<template>
  <div
    class="tw-flex tw-flex-col tw-gap-3 tw-ring-1
    tw-ring-black/10 tw-rounded-xl tw-p-4 tw-bg-black/5">
    <div class="tw-flex tw-items-center tw-justify-between">
      <h2 class="tw-text-3xl tw-font-bold tw-text-black/30">Balance</h2>
      <button
        @click="fetchBalance"
        class="tw-text-black tw-text-sm"
        :class="{ 'tw-animate-spin': fetching }"
        :disabled="fetching">
        <v-icon>mdi-refresh</v-icon>
      </button>
    </div>
    <ul class="tw-grid md:tw-grid-cols-2 tw-gap-4">
      <li
        v-for="(balance, index) in balances" :key="index"
        class="tw-ring-1 tw-ring-black/10 tw-rounded-md tw-p-4 tw-bg-white
        tw-flex tw-items-start md:tw-items-center tw-justify-between">
        <span class="tw-uppercase">{{ balance.balance + ' ' + balance.coin }}</span>
        <button
          :id="`withdraw-${balance.coin}`"
          class="tw-bg-black tw-text-white tw-rounded-full tw-py-2
          tw-px-4 tw-text-sm tw-font-bold"
          :class="{ 'tw-bg-black/80': fetching || balance.balance <= 0 }"
          :disabled="fetching || balance.balance <= 0">
          Withdraw
        </button>

        <v-menu
          :activator="`#withdraw-${balance.coin}`"
          transition="slide-y-transition">
          <div
            class="tw-bg-white tw-mt-2 tw-p-2 tw-rounded-lg
            tw-flex tw-flex-col tw-gap-3 tw-shadow-lg">
            <span class="tw-text-sm tw-border-b tw-px-3 tw-py-2 tw-pb-1.5">
              Are you sure you want <br />to withdraw your {{ balance.coin }}?
            </span>

            <button
              @click="handleWithdraw(balance.coin)"
              class="tw-p-2 tw-px-4 tw-rounded-full tw-bg-emerald-600 tw-select-none tw-text-white
              hover:tw-bg-emerald-600/80 tw-transition-all tw-duration-300 tw-font-medium">
              Confirm
            </button>
          </div>
        </v-menu>
      </li>
      <template v-if="fetching">
        <li
          v-for="(item, index) in 2" :key="index"
          class="tw-ring-1 tw-ring-black/10 tw-rounded-md tw-p-4 tw-bg-white
          tw-uppercase tw-animate-pulse tw-font-bold tw-text-black/50">
          <span>...</span>
        </li>
      </template>
    </ul>
  </div>
</template>