import {
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  Hbar,
  LedgerId,
  TransactionReceipt,
} from "@hashgraph/sdk";
import {
  HashConnect,
  HashConnectConnectionState,
  SessionData,
} from "hashconnect";
import {
  AccountType,
  CreateOfferDTO,
  CreateRequestDTO,
  CreateStoreDTO,
  CreateUserDTO,
} from "@/types";

import { ethers } from "ethers";
import { marketAbi } from "./abi";

const HEDERA_JSON_RPC = {
  mainnet: "https://mainnet.hashio.io/api",
  testnet: "https://testnet.hashio.io/api",
};

const appMetaData = {
  name: "Finder",
  description:
    "Finder is a blockchain application that allows buyers to find the best deals on products they want to buy.",
  icons: [window.location.origin + "/favicon.ico"],
  url: window.location.origin,
};

const CONTRACT_ID = "0.0.4699855";

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

  await hashconnect.openPairingModal();
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

export async function createUser({
  username,
  phone,
  lat,
  long,
  account_type,
}: CreateUserDTO): Promise<TransactionReceipt | undefined> {
  if (!pairingData) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

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

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

export async function createStore({
  name,
  description,
  latitude,
  longitude,
}: CreateStoreDTO): Promise<TransactionReceipt | undefined> {
  if (!pairingData) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(name);
    params.addString(description);
    params.addInt256(latitude);
    params.addInt256(longitude);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000000)
      .setFunction("createStore", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

export async function createRequest({
  name,
  description,
  images,
  latitude,
  longitude,
}: CreateRequestDTO): Promise<TransactionReceipt | undefined> {
  if (!pairingData) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(name);
    params.addString(description);
    params.addStringArray(images);
    params.addInt256(latitude);
    params.addInt256(longitude);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000000)
      .setFunction("createRequest", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

export async function createOffer({
  price,
  images,
  requestId,
  storeName,
  sellerId,
}: CreateOfferDTO): Promise<TransactionReceipt | undefined> {
  if (!pairingData) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addInt256(price);
    params.addStringArray(images);
    params.addString(requestId);
    params.addString(storeName);
    params.addString(sellerId);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000000)
      .setFunction("createOffer", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

export async function acceptOffer(
  offerId: string
): Promise<TransactionReceipt | undefined> {
  if (!pairingData) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addString(offerId);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000000)
      .setFunction("acceptOffer", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

export async function removeOffer(
  offerId: string
): Promise<TransactionReceipt | undefined> {
  if (!pairingData) return;

  try {
    let accountId = AccountId.fromString(pairingData!.accountIds[0]);

    const params = new ContractFunctionParameters();
    params.addAddress(offerId);
    let transaction = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(CONTRACT_ID))
      .setGas(1000000)
      .setFunction("removeOffer", params);

    const receipt = await hashconnect.sendTransaction(accountId, transaction);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

function getContract() {
  const contractAddress = AccountId.fromString(CONTRACT_ID).toSolidityAddress();
  const provider = new ethers.JsonRpcProvider(HEDERA_JSON_RPC.testnet);

  return new ethers.Contract(`0x${contractAddress}`, marketAbi, provider);
}

export async function getUser(account_id: string) {
  if (!pairingData) return;
  const contract = getContract();
  const userAddress = AccountId.fromString(account_id).toSolidityAddress();
  // const userAddress = AccountId.fromString(
  //   pairingData.accountIds[0]
  // ).toSolidityAddress();

  const user = await contract.users(`0x${userAddress}`);

  return user;
}

export async function getOffer(id: number) {
  if (!pairingData) return;
  const contract = getContract();
  const offer = await contract.offers(id);

  return offer;
}

export async function getRequest(id: number) {
  if (!pairingData) return;
  const contract = getContract();
  const request = await contract.requests(id);

  return request;
}

export async function getUserStore(userAddress: string, storeId: number) {
  if (!pairingData) return;
  const contract = getContract();
  const store = await contract.userStores(userAddress, storeId);

  return store;
}

export async function getUserStoreIds(userAddress: string) {
  if (!pairingData) return;
  const contract = getContract();
  const storeIds = await contract.userStoreIds(userAddress);

  return storeIds;
}

export async function getBuyerOffers(userAddress: string, requestId: number) {
  if (!pairingData) return;
  const contract = getContract();
  const offers = await contract.buyerOffers(userAddress, requestId);

  return offers;
}
