import { defineStore } from 'pinia';
import { CreateRequestDTO, RequestResponse } from '@/types';
import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, ContractId, TransactionReceipt } from '@hashgraph/sdk';
import { useUserStore } from './user';

type RequestsStoreType = {
  list: RequestResponse[]
}
export const useRequestsStore = defineStore('requests', {
  state: (): RequestsStoreType => ({
    list: []
  }),
  getters: {
    
  },
  actions: {
    async createRequest({
      name,
      description,
      images,
      latitude,
      longitude,
    }: CreateRequestDTO): Promise<TransactionReceipt | undefined> {
      const userStore = useUserStore();
      if (!userStore.contract.pairingData) return;
      const env = useRuntimeConfig().public

      try {
        let accountId = AccountId.fromString(userStore.accountId!);
    
        const params = new ContractFunctionParameters();
        params.addString(name);
        params.addString(description);
        params.addStringArray(images);
        params.addInt256(latitude);
        params.addInt256(longitude);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("createRequest", params);
    
        const receipt = await userStore.contract.hashconnect.sendTransaction(accountId, transaction);
        return receipt;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAllUserRequests(accountId: string) {
      const env = useRuntimeConfig().public
      const userAddress = await getEvmAddress(accountId);

      try {
        const res = await $fetch<RequestResponse[]>(`${env.matchApiUrl}/requests/${userAddress}`, {
          method: 'GET'
        })
        this.list = res
        return res
      } catch (error) {
        console.log({error})
      }
    }
  }
});