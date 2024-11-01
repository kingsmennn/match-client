import { defineStore } from "pinia";
import { CreateStoreDTO, Store, STORE_STORE_KEY } from "@/types";
import {
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  TransactionReceipt,
} from "@hashgraph/sdk";
import { useUserStore } from "./user";
import { LOCATION_DECIMALS } from "@/utils/constants";
import { getAccountInfo } from "@/utils/contract-utils";

export const useStoreStore = defineStore(STORE_STORE_KEY, {
  state: () => ({}),
  getters: {},
  actions: {
    async createStore({
      name,
      description,
      phone,
      latitude,
      longitude,
    }: CreateStoreDTO): Promise<TransactionReceipt | undefined> {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        let accountId = AccountId.fromString(userStore.accountId!);

        const params = new ContractFunctionParameters();

        const payload = {
          name,
          description,
          phone,
          long: Math.trunc(longitude * 10 ** LOCATION_DECIMALS),
          lat: Math.trunc(latitude * 10 ** LOCATION_DECIMALS),
        };

        params.addString(payload.name);
        params.addString(payload.description);
        params.addString(payload.phone);
        params.addInt256(payload.lat);
        params.addInt256(payload.long);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("createStore", params);

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        // save to store
        userStore.storeDetails = [
          {
            name: payload.name,
            description: payload.description,
            phone: payload.phone,
            location: [payload.long, payload.lat],
          },
        ];
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getUserStores(accountId: string): Promise<Store[] | undefined> {
      const userStore = useUserStore();

      try {
        const accountInfo = await getAccountInfo(accountId);
        const userAddress = accountInfo.evm_address;
        const contract = userStore.getContract();
        const storeCount = await contract.userStoreCount(userAddress);
        const stores = [];
        for (let i = 0; i < storeCount; i++) {
          const storeId = await contract.userStoreIds(userAddress, i);
          const store = await contract.userStores(userAddress, storeId);
          stores.push(store);
        }
        return stores;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getUserStoreIds(accountId: string, index: number) {
      const userStore = useUserStore();

      const accountInfo = await getAccountInfo(accountId);
      const userAddress = accountInfo.evm_address;

      const contract = userStore.getContract();
      const storeIds = await contract.userStoreIds(userAddress, index);
      return storeIds;
    },
    async getUserStore(accountId: string, storeId: number) {
      const userStore = useUserStore();

      const userAddress = await getAccountInfo(accountId);
      const contract = userStore.getContract();
      const store = await contract.userStores(userAddress, storeId);
      return store;
    },
  },
});
