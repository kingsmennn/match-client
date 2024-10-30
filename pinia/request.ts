import { defineStore } from "pinia";
import {
  CoinPayment,
  CoinPaymentAddress,
  CreateOfferDTO,
  CreateRequestDTO,
  Offer,
  RequestResponse,
} from "@/types";
import {
  AccountAllowanceApproveTransaction,
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  Hbar,
  HbarUnit,
  TokenId,
  TransactionReceipt,
} from "@hashgraph/sdk";
import { useUserStore } from "./user";

type RequestsStoreType = {
  list: RequestResponse[];
};
export const useRequestsStore = defineStore("requests", {
  state: (): RequestsStoreType => ({
    list: [],
  }),
  getters: {
    hasLocked() {
      return ({ updatedAt, period }: { updatedAt: Date; period: number }) => {
        const updatedAtTime = updatedAt.getTime();
        const currentTime = Date.now();

        return currentTime >= updatedAtTime + period;
      };
    },
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
      const env = useRuntimeConfig().public;

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

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchAllUserRequests(accountId: string) {
      const env = useRuntimeConfig().public;
      const userAddress = await getEvmAddress(accountId);

      try {
        const res = await $fetch<RequestResponse[]>(
          `${env.matchApiUrl}/requests/${userAddress}`,
          {
            method: "GET",
          }
        );
        this.list = res;
        return res;
      } catch (error) {
        console.log({ error });
        throw error;
      }
    },
    async getRequest(requestId: number) {
      const userStore = useUserStore();

      try {
        const contract = userStore.getContract();

        const [images, res] = await Promise.all([
          this.getRequestImages(requestId),
          contract.requests(requestId),
        ]);

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
        };

        request.images = images || [];
        return request;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getRequestImages(request_id: number): Promise<string[] | undefined> {
      try {
        const userStore = useUserStore();

        const contract = userStore.getContract();
        const length = await contract.getRequestImagesLength(request_id);

        const images = [];
        for (let i = 0; i < length; i++) {
          const image = await contract.getRequestImageByIndex(request_id, i);
          images.push(image);
        }
        return images;
      } catch (_) {
        return [];
      }
    },
    async markRequestAsCompleted(requestId: number) {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        let accountId = AccountId.fromString(userStore.accountId!);

        const params = new ContractFunctionParameters();
        params.addUint256(requestId);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("markRequestAsCompleted", params);

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteRequest(requestId: number) {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        let accountId = AccountId.fromString(userStore.accountId!);

        const params = new ContractFunctionParameters();
        params.addUint256(requestId);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("deleteRequest", params);

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    removeDeletedRequestFromList(requestId: number) {
      this.list = this.list.filter(
        (request) => request.requestId !== requestId
      );
    },
    async payForRequest(requestId: number, coin: CoinPayment) {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        if (coin !== CoinPayment.HBAR) {
          throw new Error("Invalid payment method");
        }
        const contract = userStore.getContract();
        const requestInfo = await contract.requests(requestId);

        const inputHbar = Number(requestInfo[3]);
        let accountId = AccountId.fromString(userStore.accountId!);
        const index = Object.values(CoinPayment).indexOf(coin);
        const params = new ContractFunctionParameters();
        params.addUint256(requestId);
        params.addUint8(index);

        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setPayableAmount(Hbar.fromTinybars(inputHbar))
          .setFunction("payForRequest", params);

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async payForRequestToken(requestId: number, coin: CoinPayment) {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        if (coin === CoinPayment.HBAR) {
          throw new Error("Invalid payment method");
        }
        let accountId = AccountId.fromString(userStore.accountId!);

        const index = Object.values(CoinPayment).indexOf(coin);
        const coinAddress = Object.values(CoinPaymentAddress)[index];

        const contract = userStore.getContract();

        const exchangeRate = await contract.getConversionRate(requestId, index);

        const erc20Contract = userStore.getERC20Contract(coinAddress);

        const allowance = await erc20Contract.allowance(
          `0x${accountId.toSolidityAddress()}`,
          `0x${AccountId.fromString(env.contractId).toSolidityAddress()}`
        );

        if (allowance < exchangeRate) {
          const approveTx =
            new AccountAllowanceApproveTransaction().approveTokenAllowance(
              TokenId.fromString(coinAddress),
              accountId,
              env.contractId,
              Number(exchangeRate)
            );

          const _ = await userStore.contract.hashconnect.sendTransaction(
            accountId,
            approveTx
          );
        }

        const params = new ContractFunctionParameters();
        params.addUint256(requestId);
        params.addUint8(index);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("payForRequestToken", params);

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getTransactionHistory(): Promise<any> {
      const env = useRuntimeConfig().public;
      const userStore = useUserStore();
      try {
        const res = await $fetch<RequestResponse[]>(
          `${env.matchApiUrl}/transactions/${userStore.userId}`,
          {
            method: "GET",
          }
        );

        return res;
      } catch (e) {}
    },

    // SELLERS
    async fetchAllSellersRequests(accountId: string) {
      const env = useRuntimeConfig().public;
    },
    async fetchNearbyRequestsForSellers({
      lat,
      long,
    }: {
      lat: number;
      long: number;
    }) {
      const env = useRuntimeConfig().public;

      try {
        const res = await $fetch<RequestResponse[]>(
          `${env.matchApiUrl}/requests`,
          {
            method: "POST",
            body: {
              sellerLat: lat,
              sellerLong: long,
            },
          }
        );

        this.list = res;
        return res;
      } catch (error) {
        console.log({ error });
        throw error;
      }
    },
    async createOffer({
      price,
      images,
      requestId,
      storeName,
    }: CreateOfferDTO): Promise<TransactionReceipt | undefined> {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        let accountId = AccountId.fromString(userStore.accountId!);

        const params = new ContractFunctionParameters();
        params.addUint256(price);
        params.addStringArray(images);
        params.addUint256(requestId);
        params.addString(storeName);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("createOffer", params);

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async acceptOffer(
      offerId: number
    ): Promise<TransactionReceipt | undefined> {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        let accountId = AccountId.fromString(userStore.accountId!);

        const params = new ContractFunctionParameters();
        params.addUint256(offerId);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("acceptOffer", params);

        const receipt = await userStore.contract.hashconnect.sendTransaction(
          accountId,
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchAllOffers(requestId: number) {
      const env = useRuntimeConfig().public;

      try {
        const res = await $fetch<Offer[]>(
          `${env.matchApiUrl}/offers/${requestId}`,
          {
            method: "GET",
          }
        );
        // this.list = res
        return res;
      } catch (error) {
        console.log({ error });
      }
    },
  },
});
