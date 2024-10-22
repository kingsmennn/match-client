export const marketAbi = [
  {
    inputs: [],
    name: "Marketplace_InvalidUser",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace_UserAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__IndexOutOfBounds",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__InsufficientFunds",
    type: "error",
  },
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
    name: "Marketplace__PriceCannotBeZero",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__RequestAlreadyPaid",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__RequestLocked",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__RequestNotAccepted",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__RequestNotLocked",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__RequestNotPaid",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__UnSupportedChainId",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__UnauthorizedBuyer",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__UnauthorizedRemoval",
    type: "error",
  },
  {
    inputs: [],
    name: "Marketplace__UnknownPaymentType",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
    ],
    name: "LocationEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "offerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAccepted",
        type: "bool",
      },
    ],
    name: "OfferAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "offerId",
        type: "uint256",
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
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "images",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sellerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "sellerIds",
        type: "uint256[]",
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
        internalType: "uint256",
        name: "offerId",
        type: "uint256",
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
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "offerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "sellerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sellersPriceQuote",
        type: "uint256",
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
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
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
      {
        indexed: false,
        internalType: "string[]",
        name: "images",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "lifecycle",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "buyerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "sellerIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "sellersPriceQuote",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lockedSellerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
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
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "RequestDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "RequestMarkedAsCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "token",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sellerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "buyerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
    ],
    name: "RequestPaymentTransacted",
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
        internalType: "uint256",
        name: "storeId",
        type: "uint256",
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
        internalType: "uint256",
        name: "userId",
        type: "uint256",
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
        internalType: "uint256",
        name: "userId",
        type: "uint256",
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
    name: "UserUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_offerId",
        type: "uint256",
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
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "_images",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_storeName",
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
        name: "_name",
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
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
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
        internalType: "uint256",
        name: "_requestId",
        type: "uint256",
      },
    ],
    name: "deleteRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAggregatorV3",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLocationPreference",
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
        internalType: "uint256",
        name: "offerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getOfferImageByIndex",
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
        internalType: "uint256",
        name: "offerId",
        type: "uint256",
      },
    ],
    name: "getOfferImagesLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRequestImageByIndex",
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
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "getRequestImagesLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRequestSellerIdByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "getRequestSellerIdsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256",
      },
    ],
    name: "markRequestAsCompleted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "offers",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "storeName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "sellerId",
        type: "uint256",
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
      {
        internalType: "address",
        name: "authority",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "enum Marketplace.CoinPayment",
        name: "coin",
        type: "uint8",
      },
    ],
    name: "payForRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "enum Marketplace.CoinPayment",
        name: "coin",
        type: "uint8",
      },
    ],
    name: "payForRequestToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "requestPaymentInfo",
    outputs: [
      {
        internalType: "address",
        name: "authority",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "enum Marketplace.CoinPayment",
        name: "token",
        type: "uint8",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "requests",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "buyerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "sellersPriceQuote",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lockedSellerId",
        type: "uint256",
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
      {
        internalType: "bool",
        name: "paid",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "acceptedOfferId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "toggleLocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
    name: "updateUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "userStoreCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        internalType: "uint256",
        name: "",
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
    name: "userStores",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
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
        internalType: "uint256",
        name: "id",
        type: "uint256",
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
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "enum Marketplace.AccountType",
        name: "accountType",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "location_enabled",
        type: "bool",
      },
      {
        internalType: "address",
        name: "authority",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "usersById",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
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
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "enum Marketplace.AccountType",
        name: "accountType",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "location_enabled",
        type: "bool",
      },
      {
        internalType: "address",
        name: "authority",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
