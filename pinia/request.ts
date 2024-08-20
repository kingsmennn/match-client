import { defineStore } from 'pinia';
import { CreateRequestDTO } from '@/types';
import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, ContractId, TransactionReceipt } from '@hashgraph/sdk';
import { useUserStore } from './user';

export const useRequestsStore = defineStore('requests', {
  state: () => ({
    
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

      try {
        let accountId = AccountId.fromString(userStore.accountId!);
    
        const params = new ContractFunctionParameters();
        params.addString(name);
        params.addString(description);
        params.addStringArray(images);
        params.addInt256(latitude);
        params.addInt256(longitude);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(CONTRACT_ID))
          .setGas(1000000)
          .setFunction("createRequest", params);
    
        const receipt = await userStore.contract.hashconnect.sendTransaction(accountId, transaction);
        return receipt;
      } catch (error) {
        console.error(error);
      }
    }
  }
});