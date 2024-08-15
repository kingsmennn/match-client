/* stores/user.js */
import { LedgerId } from '@hashgraph/sdk';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';
import { defineStore } from 'pinia';

type UserStore = {
  accountId: string | null;
  contract: {
    state: HashConnectConnectionState
    pairingData: SessionData | null
    hashconnect: HashConnect
  }
}

const PROJECT_ID = "73801621aec60dfaa2197c7640c15858";
const DEBUG = true;
const appMetaData = {
  name: "Finder",
  description:
    "Finder is a blockchain application that allows buyers to find the best deals on products they want to buy.",
  icons: [window.location.origin + "/favicon.ico"],
  url: window.location.origin,
};

export const useUserStore = defineStore('user', {
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
      )
    }
  }),
  getters: {
    isConnected: (state) => !!state.accountId,
  },
  actions: {
    async connectToHashConnect() {
      await this.contract.hashconnect.init();
      this.setUpHashConnectEvents();
      this.contract.hashconnect.openPairingModal();
    },
    async setUpHashConnectEvents() {
      this.contract.hashconnect.pairingEvent.on((newPairing) => {
        this.contract.pairingData = newPairing;
        // set the account id of the user
        const userId: string = this.contract.pairingData.accountIds[0];
        this.accountId = userId;
      });

      this.contract.hashconnect.disconnectionEvent.on((data) => {
        this.contract.pairingData = null;
        this.accountId = null;
      });

      this.contract.hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
        this.contract.state = connectionStatus;
      })
    },
    disconnect() {
      this.contract.hashconnect.disconnect();
      this.contract.pairingData = null;
      this.accountId = null;
    }
  },
  persist: true,
});