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
import { ethers } from "ethers";
import { marketAbi } from "./abi";

const HEDERA_JSON_RPC = {
  mainnet: "https://mainnet.hashio.io/api",
  testnet: "https://testnet.hashio.io/api",
};

const CONTRACT_ID = "0.0.4699855";

let hashconnect: HashConnect;
let pairingData: SessionData | null;

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

export async function getOfferImageByIndex(offerId: number, index: number) {
  if (!pairingData) return;
  const contract = getContract();
  const image = await contract.getOfferImageByIndex(offerId, index);

  return image;
}

export async function getOfferImages(
  offerId: number
): Promise<string[] | undefined> {
  if (!pairingData) return;
  const contract = getContract();
  const length = await contract.getOfferImagesLength(offerId);
  const images = [];

  for (let i = 0; i < length; i++) {
    const image = await contract.getOfferImageByIndex(offerId, i);
    images.push(image);
  }

  return images;
}

export async function getRequestSellerIds(
  requestId: number
): Promise<string[] | undefined> {
  if (!pairingData) return;
  const contract = getContract();
  const sellerIdsLength = await contract.getRequestSellerIdsLength(requestId);
  const sellerIds = [];

  for (let i = 0; i < sellerIdsLength; i++) {
    const sellerId = await contract.getRequestSellerIdByIndex(requestId, i);
    sellerIds.push(sellerId);
  }

  return sellerIds;
}
