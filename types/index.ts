export enum AccountType {
  BUYER = 'buyer',
  SELLER = 'seller'
}

export type Location = [
  // state: string
  // lga: string
  // market?: string
  longitude: number,
  latitude: number
];
export type User = {
  id?: string;
  username: string;
  // email: string
  phone: string;
  location: Location;
  createdAt: Date;
  accountType: AccountType;
  stores?: Store[];
};
export type Store = {
  name: string;
  description?: string;
  location: Location;
};

export enum RequestLifecycle {
  PENDING = "pending",
  ACCEPTED_BY_SELLER = "accepted_by_seller",
  ACCEPTED_BY_BUYER = "accepted_by_buyer",
  REQUEST_LOCKED = "request_locked",
  COMPLETED = "completed",
}
export enum RequestLifecycleIndex {
  PENDING,
  ACCEPTED_BY_SELLER,
  ACCEPTED_BY_BUYER,
  REQUEST_LOCKED,
  COMPLETED,
}

export type Request = {
  id?: string;
  name: string;
  buyerId: string;
  sellersPriceQuote?: number;
  sellerIds?: string[];
  lockedSellerId?: string;
  description: string;
  images: string[];
  createdAt: Date;
  lifecycle: RequestLifecycle;
  market: string;
  lga: string;
  state: string;
  updatedAt: Date;
};

export type RequestResponse = {
  _id: string
  transactionHash: string
  address: string
  buyerAddress: string
  images: string[]
  lifecycle: RequestLifecycleIndex
  requestId: string
  signature: string
  createdAt: string
  updated_at: string
  buyerId: number
  description: string
  requestName: string
  sellerIds?: string[]
  lockedSellerId?: 0

  {
    "latitude": 6461710096179115000,
    "longitude": 7473966214619183000,
    "sellersPriceQuote": 0,
    "signature": "0x56ca0afdd5f54238e27cf178a4bd73abd99ea55a21defd28381b76d0761993ae",
    "updatedAt": 1724169044,
    "updated_at": "2024-08-20T16:08:28.207Z"
  }
}

export type Offer = {
  id?: string;
  price: number;
  images: string[];
  requestId: string;
  storeName: string;
  sellerId: string;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// contract types
export type CreateUserDTO = {
  username: string;
  phone: string;
  lat: number;
  long: number;
  account_type: AccountType;
};

type id = number;
type username = string;
type phone = string;
type createdAt = number;
export type BlockchainUser = [
  id,
  username,
  phone,
  Location,
  createdAt,
  AccountType
];

export type CreateStoreDTO = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

export type CreateRequestDTO = {
  name: string;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
};

export type CreateOfferDTO = {
  price: number;
  images: string[];
  requestId: string;
  storeName: string;
  sellerId: string;
};

export const STORE_KEY = "@userStore";
export const STORE_KEY_MIDDLEWARE = "@userStoreMiddleware";

export const STORE_STORE_KEY = '@StoreStore'