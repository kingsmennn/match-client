import { defineStore } from 'pinia';
import { CreateStoreDTO, STORE_STORE_KEY } from '@/types';
import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, ContractId, TransactionReceipt } from '@hashgraph/sdk';
import { useUserStore } from './user';
import { CONTRACT_ID, LOCATION_DECIMALS } from '@/constants';

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

        const payload = {
          name,
          description,
          long: Math.trunc((longitude) * (10**LOCATION_DECIMALS)),
          lat: Math.trunc((latitude) * (10**LOCATION_DECIMALS)),
        }

        params.addString(payload.name);
        params.addString(payload.description);
        params.addInt256(payload.lat);
        params.addInt256(payload.long);
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