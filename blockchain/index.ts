import { AccountId, LedgerId, TransferTransaction } from "@hashgraph/sdk";
import {
  HashConnect,
  HashConnectConnectionState,
  SessionData,
} from "hashconnect";

const appMetaData = {
  name: "Finder",
  description:
    "Finder is a blockchain application that allows buyers to find the best deals on products they want to buy.",
  icons: [],
  url: "",
};

let hashconnect: HashConnect;
let state: HashConnectConnectionState = HashConnectConnectionState.Disconnected;
let pairingData: SessionData | null;

const PROJECT_ID = "73801621aec60dfaa2197c7640c15858";
const DEBUG = true;
export async function connectToHashConnect() {
  hashconnect = new HashConnect(
    LedgerId.TESTNET,
    PROJECT_ID,
    appMetaData,
    DEBUG
  );
  setUpHashConnectEvents();

  await hashconnect.init();
}

async function openPairing() {
  hashconnect.openPairingModal();
}

async function disconnect() {
  hashconnect.disconnect();
  pairingData = null;
}

async function setUpHashConnectEvents() {
  hashconnect.pairingEvent.on((newPairing) => {
    pairingData = newPairing;
    console.log(pairingData);
  });

  hashconnect.disconnectionEvent.on((data) => {
    pairingData = null;
  });

  hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
    state = connectionStatus;
  });
}

async function sendTransaction() {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    let transaction = new TransferTransaction()
      .addHbarTransfer(accountId, -1)
      .addHbarTransfer(AccountId.fromString("0.0.3"), 1);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
  } catch (error) {}
}
