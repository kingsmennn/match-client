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
import { AccountType, BlockchainUser, CreateUserDTO } from "@/types";

type UserStore = {
  accountId: string | null;
  contract: {
    state: HashConnectConnectionState;
    pairingData: SessionData | null;
    hashconnect: HashConnect;
  };
  userDetails?: BlockchainUser;
  blockchainError: {
    userNotFound: boolean;
  };
};

const HEDERA_JSON_RPC = {
  mainnet: "https://mainnet.hashio.io/api",
  testnet: "https://testnet.hashio.io/api",
};
const CONTRACT_ID = "0.0.4686833";
const PROJECT_ID = "73801621aec60dfaa2197c7640c15858";
const DEBUG = true;
const appMetaData = {
  name: "Finder",
  description:
    "Finder is a blockchain application that allows buyers to find the best deals on products they want to buy.",
  icons: [window.location.origin + "/favicon.ico"],
  url: window.location.origin,
};

export const useUserStore = defineStore("user", {
  state: (): UserStore => ({
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
  }),
  getters: {
    isConnected: (state) => !!state.accountId,
  },
  actions: {
    async connectToHashConnect() {
      this.setUpHashConnectEvents();
      await this.contract.hashconnect.init();
      await this.contract.hashconnect.openPairingModal();
    },
    async getEvmAddress(account_id: string) {
      const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${account_id}?limit=1`;
      const response = await fetch(url);
      const data = await response.json();
      return data?.evm_address;
    },
    async setUpHashConnectEvents() {
      this.contract.hashconnect.pairingEvent.on(async (newPairing) => {
        this.contract.pairingData = newPairing;
        // set the account id of the user
        const userId: string = this.contract.pairingData.accountIds[0];
        this.accountId = userId;

        const blockchainUser = await this.fetchUser(this.accountId);
        console.log({ blockchainUser });
        // check if the user exists in the blockchain by checking id
        const hasId = !!blockchainUser[0];
        if (!!blockchainUser[0]) {
          this.userDetails = [
            blockchainUser[0],
            blockchainUser[1],
            blockchainUser[2],
            blockchainUser[3],
            blockchainUser[4],
            blockchainUser[5],
          ];
        } else if (!hasId && this.accountId) {
          this.blockchainError.userNotFound = true;
        }
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
    disconnect() {
      this.contract.hashconnect.disconnect();
      this.contract.pairingData = null;
      this.accountId = null;
      this.userDetails = undefined;
      this.blockchainError.userNotFound = false;
    },

    getContract() {
      const contractAddress =
        AccountId.fromString(CONTRACT_ID).toSolidityAddress();
      const provider = new ethers.JsonRpcProvider(HEDERA_JSON_RPC.testnet);

      return new ethers.Contract(`0x${contractAddress}`, marketAbi, provider);
    },
    async fetchUser(account_id: string): Promise<BlockchainUser> {
      const contract = this.getContract();
      const userAddress = await this.getEvmAddress(account_id);

      const user = await contract.users(userAddress);

      return user;
    },

    // create new user
    async createUser({
      username,
      phone,
      lat,
      long,
      account_type,
    }: CreateUserDTO): Promise<TransactionReceipt | undefined> {
      if (!this.contract.pairingData || !this.accountId) return;

      try {
        const params = new ContractFunctionParameters();

        params.addString(username);
        params.addString(phone);
        params.addInt256(lat);
        params.addInt256(long);
        params.addUint8(account_type == AccountType.BUYER ? 0 : 1);
        let transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(CONTRACT_ID))
          .setGas(1000000)
          .setFunction("createUser", params);

        const receipt = await this.contract.hashconnect.sendTransaction(
          AccountId.fromString(this.accountId),
          transaction
        );
        return receipt;
      } catch (error) {
        console.error(error);
      }
    },
  },
  persist: {
    paths: [
      "accountId",
      "contract.state",
      "userDetails[0]",
      "blockchainError.userNotFound",
    ],
  },
});
