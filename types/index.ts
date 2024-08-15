export enum AccountType {
  BUYER = 'buyer',
  SELLER = 'seller'
}

export interface Location {
  // state: string
  // lga: string
  // market?: string
  longitude: string
  latitude: string
}
export interface User {
  id?: string
  username: string
  // email: string
  phone: string
  location: Location
  createdAt: Date
  accountType: AccountType
  stores?: Store[]
}
export interface Store {
  name: string
  description?: string
  location: Location
}

export enum RequestLifecycle {
  PENDING = 'pending',
  ACCEPTED_BY_SELLER = 'accepted_by_seller',
  ACCEPTED_BY_BUYER = 'accepted_by_buyer',
  REQUEST_LOCKED = 'request_locked',
  COMPLETED = 'completed',
}

export interface Request {
  id?: string
  name: string
  buyerId: string
  sellersPriceQuote?: number,
  sellerIds?: string[]
  lockedSellerId?: string
  description: string
  images: string[]
  createdAt: Date
  lifecycle: RequestLifecycle
  market: string
  lga: string
  state: string
  updatedAt: Date
}

export interface Offer {
  id?: string
  price: number
  images: string[]
  requestId: string
  storeName: string
  sellerId: string
  isAccepted: boolean
  createdAt: Date
  updatedAt: Date
}

// contract types
export type CreateUserDTO = {
  username: string,
  phone: string,
  lat: number,
  long: number,
  account_type: AccountType
}

export type CreateStoreDTO = {
  name: string,
  description: string,
  latitude: number,
  longitude: number
}

export type CreateRequestDTO = {
  name: string,
  buyerId: string,
  description: string,
  images: string[],
  latitude: number,
  longitude: number
}

export type CreateOfferDTO = {
  price: number,
  images: string[],
  requestId: string,
  storeName: string,
  sellerId: string
}