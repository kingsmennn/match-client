import {
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  // ContractExecuteTransaction,
  // ContractFunctionParameters,
  // ContractId,
  // Hbar,
  LedgerId,
  TokenAssociateTransaction,
  TokenId,
  TransactionReceipt,
  // TransactionReceipt,
} from "@hashgraph/sdk";
import { ethers } from "ethers";
import { marketAbi } from "@/blockchain/abi";
import {
  HashConnect,
  HashConnectConnectionState,
  SessionData,
} from "hashconnect";
import { defineStore } from "pinia";
import {
  AccountType,
  BlockchainUser,
  CreateUserDTO,
  STORE_KEY,
  STORE_KEY_MIDDLEWARE,
  User,
  Location,
  Store,
  CoinPayment,
  CoinPaymentAddress,
} from "@/types";
import {
  appMetaData,
  DEBUG,
  HEDERA_JSON_RPC,
  LOCATION_DECIMALS,
  PROJECT_ID,
} from "@/utils/constants";
import { getAccountInfo } from "@/utils/contract-utils";
import { useStoreStore } from "./store";
import { erc20Abi } from "@/blockchain/erc20abi";

type UserStore = {
  connecting: boolean;
  accountId: string | null;
  contract: {
    state: HashConnectConnectionState;
    pairingData: SessionData | null;
    hashconnect: HashConnect;
  };
  userDetails?: BlockchainUser;
  storeDetails?: Store[];
  blockchainError: {
    userNotFound: boolean;
  };
  locationEnabled: boolean;
};

export const useUserStore = defineStore(STORE_KEY, {
  state: (): UserStore => ({
    connecting: false,
    accountId: null,
    contract: {
      state: HashConnectConnectionState.Disconnected,
      pairingData: null,
      hashconnect: new HashConnect(
        LedgerId.TESTNET,
        PROJECT_ID,
        appMetaData,
        DEBUG
      ),
    },
    userDetails: undefined,
    blockchainError: {
      userNotFound: false,
    },
    locationEnabled: false,
  }),
  getters: {
    isConnected: (state) => !!state.accountId,
    userId: (state): number | undefined => state.userDetails?.[0],
    isNotOnboarded: (state) =>
      !!state.accountId && state.blockchainError.userNotFound,
    passedSecondaryCheck: (state) => {
      return state.userDetails?.[6] === AccountType.BUYER
        ? // buyers only need give access to their location
          !!state.userDetails?.[3][0]
        : // sellers need to setup their store
          !!state?.storeDetails?.[0]?.name;
    },
    username: (state) => state.userDetails?.[1],
    phone: (state) => state.userDetails?.[2],
    location: (state) => state.userDetails?.[3],
    accountType: (state) => state.userDetails?.[6],
  },
  actions: {
    async connectToHashConnect() {
      this.setUpHashConnectEvents();
      await this.contract.hashconnect.init();
      await this.contract.hashconnect.openPairingModal();
    },
    async setUpHashConnectEvents() {
      this.contract.hashconnect.pairingEvent.on(async (newPairing) => {
        this.contract.pairingData = newPairing;
        // set the account id of the user
        const userId: string = this.contract.pairingData.accountIds[0];
        this.accountId = userId;
        await this.associateTokenWithContract(CoinPaymentAddress.USDC);
        const blockchainUser = await this.fetchUser(this.accountId);
        this.locationEnabled = !![...blockchainUser][7];
        this.storeUserDetails(blockchainUser);

        // if user is a seller, we need to get their store details
        if (this.accountType !== AccountType.SELLER) return;
        const storeStore = useStoreStore();
        const res = await storeStore.getUserStores(this.accountId!);
        this.storeDetails = res || [];
      });

      this.contract.hashconnect.disconnectionEvent.on((data) => {
        this.contract.pairingData = null;
        this.accountId = null;
      });

      this.contract.hashconnect.connectionStatusChangeEvent.on(
        (connectionStatus) => {
          this.contract.state = connectionStatus;
        }
      );
    },
    async handleWalletConnectInComponent() {
      this.connecting = true;
      try {
        await this.connectToHashConnect();
        // once connected the subscription function will update the user store
      } catch (e) {
        // haldle errors
        console.log(e);
      } finally {
        this.connecting = false;
      }
    },
    async associateTokenWithContract(tokenAddress: string) {
      const userStore = useUserStore();
      const env = useRuntimeConfig().public;

      try {
        const contractInfo = await getAccountInfo(env.contractId);
        for (let info of contractInfo.balance.tokens) {
          if (info.token_id === tokenAddress) {
            return;
          }
        }
        let accountId = AccountId.fromString(userStore.accountId!);

        const params = new ContractFunctionParameters();
        params.addAddress(
          AccountId.fromString(tokenAddress).toSolidityAddress()
        );
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("associateToken", params);

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

    async disconnect() {
      await this.contract.hashconnect.disconnect();
      this.contract.pairingData = null;
      this.accountId = null;
      this.userDetails = undefined;
      this.blockchainError.userNotFound = false;
    },

    getContract() {
      const env = useRuntimeConfig().public;
      const contractAddress = AccountId.fromString(
        env.contractId
      ).toSolidityAddress();

      const provider = new ethers.JsonRpcProvider(HEDERA_JSON_RPC.testnet);

      return new ethers.Contract(`0x${contractAddress}`, marketAbi, provider);
    },
    getERC20Contract(contractAddress: string) {
      const env = useRuntimeConfig().public;
      const contractAddr =
        AccountId.fromString(contractAddress).toSolidityAddress();

      const provider = new ethers.JsonRpcProvider(HEDERA_JSON_RPC.testnet);
      return new ethers.Contract(`0x${contractAddr}`, erc20Abi, provider);
    },
    async fetchUser(account_id: string): Promise<BlockchainUser> {
      const contract = this.getContract();
      const accountInfo = await getAccountInfo(account_id);
      const userAddress = accountInfo.evm_address;

      const user = await contract.users(userAddress);
      return user;
    },
    async storeUserDetails(user: BlockchainUser) {
      const userCookie = useCookie<User>(STORE_KEY_MIDDLEWARE); // will be used by middleware

      // check if the user exists in the blockchain by checking id
      const hasId = !!user[0];
      if (hasId) {
        const details = {
          id: Number(user[0]),
          username: user[1],
          phone: user[2],
          location: {
            long: Number(user[3][0]),
            lat: Number(user[3][1]),
          },
          createdAt: Number(user[4]),
          updatedAt: Number(user[5]),
          accountType:
            Number(user[6]) === 0 ? AccountType.BUYER : AccountType.SELLER,
        };

        const { id, username, phone, location, createdAt, accountType } =
          details;

        this.userDetails = [
          id,
          username,
          phone,
          [location.long, location.lat],
          details.createdAt,
          details.updatedAt,
          accountType,
        ];

        userCookie.value = {
          id: this.accountId!,
          username: details.username,
          phone: details.phone,
          location: [details.location.long, details.location.lat],
          createdAt: new Date(details.createdAt),
          updatedAt: new Date(details.updatedAt),
          accountType: details.accountType,
        };
      } else if (!hasId && this.accountId) {
        this.blockchainError.userNotFound = true;
      }
    },

    // create new user
    async createUser({
      username,
      phone,
      lat,
      long,
      account_type,
    }: CreateUserDTO): Promise<TransactionReceipt | undefined> {
      const env = useRuntimeConfig().public;

      try {
        const params = new ContractFunctionParameters();
        params.addString(username);
        params.addString(phone);
        params.addInt256(lat);
        params.addInt256(long);
        params.addUint8(account_type === AccountType.BUYER ? 0 : 1);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("createUser", params);

        const receipt = await this.contract.hashconnect.sendTransaction(
          AccountId.fromString(this.accountId!),
          transaction
        );

        // wait a while for the previous contract to properly execute
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const blockchainUser = await this.fetchUser(this.accountId!);
        this.storeUserDetails(blockchainUser);

        // resets
        this.blockchainError.userNotFound = false;
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateUser({
      username,
      phone,
      lat,
      long,
      account_type,
    }: Partial<CreateUserDTO>): Promise<
      { receipt: TransactionReceipt; location: Location } | undefined
    > {
      const env = useRuntimeConfig().public;

      try {
        const params = new ContractFunctionParameters();

        const payload = {
          username: username || this.userDetails?.[1]!,
          phone: phone || this.userDetails?.[2]!,
          long: Math.trunc(
            (long || this.userDetails?.[3][0]!) * 10 ** LOCATION_DECIMALS
          ),
          lat: Math.trunc(
            (lat || this.userDetails?.[3][1]!) * 10 ** LOCATION_DECIMALS
          ),
          account_type:
            (account_type || this.userDetails?.[6]!) === AccountType.BUYER
              ? 0
              : 1,
        };

        params.addString(payload.username);
        params.addString(payload.phone);
        params.addInt256(payload.long);
        params.addInt256(payload.lat);
        params.addUint8(payload.account_type);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("updateUser", params);

        const receipt = await this.contract.hashconnect.sendTransaction(
          AccountId.fromString(this.accountId!),
          transaction
        );
        return { receipt, location: [payload.long, payload.lat] };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchUserById(userId: number) {
      try {
        const contract = this.getContract();
        const data = await contract.usersById(userId);

        const user: any = {
          id: Number(data[0]),
          username: data[1],
          phone: data[2],
          location: [Number(data[3][0]), Number(data[3][1])],
          createdAt: new Date(Number(data[4]) * 1000),
          updatedAt: new Date(Number(data[5]) * 1000),
          accountType:
            Number(data[6]) === 0 ? AccountType.BUYER : AccountType.SELLER,
          userAddress: data[8],
          stores: [],
        };

        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async toggleEnableLocation(value: boolean) {
      const env = useRuntimeConfig().public;

      try {
        const params = new ContractFunctionParameters();
        params.addBool(value);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("toggleLocation", params);

        const receipt = await this.contract.hashconnect.sendTransaction(
          AccountId.fromString(this.accountId!),
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async fetchLocationPreference(): Promise<boolean> {
      try {
        return true;
        // const contract = await this.getContract();
        // const [profilePda] = findProgramAddressSync(
        //   [utf8.encode(USER_TAG), this.anchorWallet!.publicKey!.toBuffer()],
        //   programID
        // );
        // const userData = await contract.account.user.fetch(profilePda);
        // return userData.locationEnabled;
      } catch (error) {
        console.error("Error fetching location preference:", error);
        throw error;
      }
    },
    async getSellerBalance(accountId: string, coin: CoinPayment) {
      const userStore = useUserStore();

      const accountInfo = await getAccountInfo(accountId);
      const userAddress = accountInfo.evm_address;
      const contract = userStore.getContract();

      if (coin === CoinPayment.HBAR) {
        const hbarBalance = await contract.balanceOfETH(userAddress);
        return hbarBalance;
      } else if (coin === CoinPayment.USDC) {
        const usdcBalance = await contract.balanceOfUSDC(userAddress);
        return usdcBalance;
      } else return 0;
    },
    async withdrawSellerProfit(coin: CoinPayment) {
      const env = useRuntimeConfig().public;

      try {
        const index = Object.values(CoinPayment).indexOf(coin);
        if (coin === CoinPayment.USDC) {
          // associate USDC token with seller
          const coinAddress = Object.values(CoinPaymentAddress)[index];
          const tokenAssoc = new TokenAssociateTransaction()
            .setAccountId(this.accountId!)
            .setTokenIds([TokenId.fromString(coinAddress)]);
          const _ = await this.contract.hashconnect.sendTransaction(
            AccountId.fromString(this.accountId!),
            tokenAssoc
          );
          // wait for the transaction to complete
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        const params = new ContractFunctionParameters();
        params.addUint8(index);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(env.contractId))
          .setGas(1000000)
          .setFunction("withdrawSellerProfit", params);

        const receipt = await this.contract.hashconnect.sendTransaction(
          AccountId.fromString(this.accountId!),
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  persist: {
    paths: [
      "accountId",
      "userDetails",
      "blockchainError.userNotFound",
      "storeDetails.name",
      "storeDetails.description",
      "storeDetails.location",
    ],
    async afterRestore(context) {
      context.store.$state.contract.hashconnect.init();
      context.store.setUpHashConnectEvents();
    },
  },
});
