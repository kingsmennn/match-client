import { defineStore } from 'pinia';
import { CreateStoreDTO, STORE_STORE_KEY } from '@/types';
import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, ContractId, TransactionReceipt } from '@hashgraph/sdk';
import { useUserStore } from './user';
import { CONTRACT_ID } from '@/constants';

export const useStoreStore = defineStore(STORE_STORE_KEY, {
  state: () => ({
    
  }),
  getters: {
    
  },
  actions: {
    async createStore({
      name,
      description,
      latitude,
      longitude,
    }: CreateStoreDTO): Promise<TransactionReceipt | undefined> {
      const userStore = useUserStore()
      if (!userStore.contract.pairingData) return;
    
      try {
        let accountId = AccountId.fromString(userStore.accountId!);
    
        const params = new ContractFunctionParameters();
        params.addString(name);
        params.addString(description);
        params.addInt256(latitude);
        params.addInt256(longitude);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(CONTRACT_ID))
          .setGas(1000000)
          .setFunction("createStore", params);
    
        const receipt = await userStore.contract.hashconnect.sendTransaction(accountId, transaction);
        return receipt;
      } catch (error) {
        console.error(error);
      }
    }
    
  }
});