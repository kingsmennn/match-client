import { defineStore } from 'pinia';
import { CreateOfferDTO, CreateRequestDTO, Offer, RequestResponse } from '@/types';
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
    },
    async getRequest(requestId: number) {
      const userStore = useUserStore();
      if (!userStore.contract.pairingData) return;

      try {
        const contract = userStore.getContract();
        const res = await contract.requests(requestId);
  
        const request: RequestResponse = {
          requestId: Number(res[0]),
          requestName: res[1],
          buyerId: Number(res[2]),
          sellersPriceQuote: Number(res[3]),
          lockedSellerId: Number(res[4]),
          description: res[5],
          lifecycle: Number(res[7]),
          longitude: Number(res[8][0]),
          latitude: Number(res[8][1]),
          createdAt: Number(res[6]),
          updatedAt: Number(res[9]),
          images: [],
        }
        const images = await this.getRequestImages(request.requestId)
        request.images = images || []
        return request;
      } catch (error) {
        console.log(error)
      }
    },
    async getRequestImages(
      request_id: number
    ): Promise<string[] | undefined> {
      const userStore = useUserStore();
      if (!userStore.contract.pairingData) return;

      const contract = userStore.getContract();
      const length = await contract.getRequestImagesLength(request_id);
    
      const images = [];
      for (let i = 0; i < length; i++) {
        const image = await contract.getRequestImageByIndex(request_id, i);
        images.push(image);
      }
      return images;
    },
    
    // SELLERS
    async fetchNearbyRequestsForSellers({lat, long}: { lat: number, long: number}) {
      const env = useRuntimeConfig().public

      try {
        const res = await $fetch<RequestResponse[]>(
          `${env.matchApiUrl}/requests`,
          {
            method: 'POST',
            body: {
              sellerLat: lat,
              sellerLong: long
            }
          }
        )
        
        this.list = res
        return res
      } catch (error) {
        console.log({error})
      }

    },
    async createOffer({
      price,
      images,
      requestId,
      storeName,
    }: CreateOfferDTO): Promise<TransactionReceipt | undefined> {
      const userStore = useUserStore();
      if (!userStore.contract.pairingData) return;
      const env = useRuntimeConfig().public
    
      try {
        let accountId = AccountId.fromString(userStore.accountId!);
    
        const params = new ContractFunctionParameters();
        params.addInt256(price);
        params.addStringArray(images);
        params.addUint256(requestId);
        params.addString(storeName);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("createOffer", params);
    
        const receipt = await userStore.contract.hashconnect.sendTransaction(accountId, transaction);
        return receipt;
      } catch (error) {
        console.error(error);
      }
    },
    async acceptOffer(
      offerId: number
    ): Promise<TransactionReceipt | undefined> {
      const userStore = useUserStore();
      if (!userStore.contract.pairingData) return;
      const env = useRuntimeConfig().public
    
      try {
        let accountId = AccountId.fromString(userStore.accountId!);
    
        const params = new ContractFunctionParameters();
        params.addUint256(offerId);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("acceptOffer", params);
    
        const receipt = await userStore.contract.hashconnect.sendTransaction(accountId, transaction);
        return receipt;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAllOffers(requestId: number) {
      const env = useRuntimeConfig().public

      try {
        const res = await $fetch<Offer[]>(`${env.matchApiUrl}/offers/${requestId}`, {
          method: 'GET'
        })
        // this.list = res
        return res
      } catch (error) {
        console.log({error})
      }
    }
  }
});