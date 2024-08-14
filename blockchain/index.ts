import {
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  Hbar,
  LedgerId,
} from "@hashgraph/sdk";
import {
  HashConnect,
  HashConnectConnectionState,
  SessionData,
} from "hashconnect";
import { AccountType } from "types";

const appMetaData = {
  name: "Finder",
  description:
    "Finder is a blockchain application that allows buyers to find the best deals on products they want to buy.",
  icons: [],
  url: "",
};

const CONTRACT_ID = "0.0.1234";

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
  });

  hashconnect.disconnectionEvent.on((data) => {
    pairingData = null;
  });

  hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
    state = connectionStatus;
  });
}

async function createUser(
  id: string,
  username: string,
  phone: string,
  lat: number,
  long: number,
  account_type: AccountType
) {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(id);
    params.addString(username);
    params.addString(phone);
    params.addInt256(lat);
    params.addInt256(long);
    params.addInt256(account_type == AccountType.BUYER ? 0 : 1);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000)
      .setFunction("createUser", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

async function createStore(
  storeId: string,
  name: string,
  description: string,
  latitude: number,
  longitude: number
) {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(storeId);
    params.addString(name);
    params.addString(description);
    params.addInt256(latitude);
    params.addInt256(longitude);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000)
      .setFunction("createStore", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

async function createRequest(
  id: string,
  name: string,
  buyerId: string,
  description: string,
  images: string[],
  latitude: number,
  longitude: number
) {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(id);
    params.addString(name);
    params.addString(buyerId);
    params.addString(description);
    params.addStringArray(images);
    params.addInt256(latitude);
    params.addInt256(longitude);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000)
      .setFunction("createRequest", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

async function createOffer(
  id: string,
  price: number,
  images: string[],
  requestId: string,
  storeName: string,
  sellerId: string
) {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(id);
    params.addInt256(price);
    params.addStringArray(images);
    params.addString(requestId);
    params.addString(storeName);
    params.addString(sellerId);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000)
      .setFunction("createOffer", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

async function acceptOffer(offerId: string) {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(offerId);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000)
      .setFunction("acceptOffer", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

async function removeOffer(offerId: string) {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addAddress(offerId);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000)
      .setFunction("removeOffer", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}
