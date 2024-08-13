import {
  AccountId,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  Hbar,
  LedgerId,
  TransferTransaction,
} from "@hashgraph/sdk";
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
    console.log(pairingData);
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
  long: number
) {
  if (pairingData === null) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addAddress(id);
    params.addAddress(username);
    params.addAddress(phone);
    params.addInt256(lat);
    params.addInt256(long);
    let transaction = new ContractExecuteTransaction()
      .setPayableAmount(Hbar.fromTinybars(10))
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
    params.addAddress(storeId);
    params.addAddress(name);
    params.addAddress(description);
    params.addInt256(latitude);
    params.addInt256(longitude);
    let transaction = new ContractExecuteTransaction()
      .setPayableAmount(Hbar.fromTinybars(10))
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
    params.addAddress(id);
    params.addAddress(name);
    params.addAddress(buyerId);
    params.addAddress(description);
    params.addAddress(images);
    params.addInt256(latitude);
    params.addInt256(longitude);
    let transaction = new ContractExecuteTransaction()
      .setPayableAmount(Hbar.fromTinybars(10))
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
    params.addAddress(id);
    params.addInt256(price);
    params.addAddress(images);
    params.addAddress(requestId);
    params.addAddress(storeName);
    params.addAddress(sellerId);
    let transaction = new ContractExecuteTransaction()
      .setPayableAmount(Hbar.fromTinybars(10))
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
    params.addAddress(offerId);
    let transaction = new ContractExecuteTransaction()
      .setPayableAmount(Hbar.fromTinybars(10))
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
      .setPayableAmount(Hbar.fromTinybars(10))
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000)
      .setFunction("removeOffer", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}
