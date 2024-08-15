export const marketAbi = [
  {
    inputs: [],
    name: "Marketplace__InvalidAccountType",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__OfferAlreadyAccepted",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__OfferAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__OfferNotRemovable",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__OnlyBuyersAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__OnlySellersAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__UnauthorizedRemoval",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "offerId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sellerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "storeName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "price",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "requestId",
        type: "string",
      },
    ],
    name: "OfferCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "offerId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sellerAddress",
        type: "address",
      },
    ],
    name: "OfferRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "requestId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "offerId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sellerAddress",
        type: "address",
      },
    ],
    name: "RequestAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "requestId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "requestName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "latitude",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "longitude",
        type: "int256",
      },
    ],
    name: "RequestCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sellerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "storeName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "latitude",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "longitude",
        type: "int256",
      },
    ],
    name: "StoreCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "userId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "accountType",
        type: "uint8",
      },
    ],
    name: "UserCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_offerId",
        type: "string",
      },
    ],
    name: "acceptOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "buyerOffers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "int256",
        name: "_price",
        type: "int256",
      },
      {
        internalType: "string[]",
        name: "_images",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_requestId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_storeName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_sellerId",
        type: "string",
      },
    ],
    name: "createOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_buyerId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_images",
        type: "string[]",
      },
      {
        internalType: "int256",
        name: "_latitude",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "_longitude",
        type: "int256",
      },
    ],
    name: "createRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_storeId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "int256",
        name: "_latitude",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "_longitude",
        type: "int256",
      },
    ],
    name: "createStore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_username",
        type: "string",
      },
      {
        internalType: "string",
        name: "_phone",
        type: "string",
      },
      {
        internalType: "int256",
        name: "_latitude",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "_longitude",
        type: "int256",
      },
      {
        internalType: "enum Marketplace.AccountType",
        name: "_accountType",
        type: "uint8",
      },
    ],
    name: "createUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "offers",
    outputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "int256",
        name: "price",
        type: "int256",
      },
      {
        internalType: "string",
        name: "requestId",
        type: "string",
      },
      {
        internalType: "string",
        name: "storeName",
        type: "string",
      },
      {
        internalType: "string",
        name: "sellerId",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isAccepted",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_offerId",
        type: "string",
      },
    ],
    name: "removeOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "requests",
    outputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "buyerId",
        type: "string",
      },
      {
        internalType: "int256",
        name: "sellersPriceQuote",
        type: "int256",
      },
      {
        internalType: "string",
        name: "lockedSellerId",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "enum Marketplace.RequestLifecycle",
        name: "lifecycle",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "int256",
            name: "latitude",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "longitude",
            type: "int256",
          },
        ],
        internalType: "struct Marketplace.Location",
        name: "location",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userStoreIds",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "userStores",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        components: [
          {
            internalType: "int256",
            name: "latitude",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "longitude",
            type: "int256",
          },
        ],
        internalType: "struct Marketplace.Location",
        name: "location",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "phone",
        type: "string",
      },
      {
        components: [
          {
            internalType: "int256",
            name: "latitude",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "longitude",
            type: "int256",
          },
        ],
        internalType: "struct Marketplace.Location",
        name: "location",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "enum Marketplace.AccountType",
        name: "accountType",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
