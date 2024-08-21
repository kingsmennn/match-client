### Match - Connecting Buyers and Sellers on Hedera

---

**Match** is a decentralized application (dApp) built on the Hedera Hashgraph platform that connects buyers with sellers, allowing them to find the best deals on products and services. Using smart contracts on Hedera, Match ensures secure, transparent, and efficient transactions between parties.

### Key Features

- **Create Offers:** Sellers can create offers for products or services, specifying price, images, and related details.
- **Accept Offers:** Buyers can review and accept offers that best meet their needs.
- **Remove Offers:** Sellers have the ability to remove offers if they are no longer available.
- **View Offers:** Buyers can view all offers related to their requests and select the most suitable one.
- **Get Request Details:** Users can retrieve detailed information about requests, including seller IDs and offer images.
- **Store Management:** Sellers can manage their stores, including viewing store details and retrieving store IDs.

### Technologies Used

- **Hedera Hashgraph:** A next-generation distributed ledger technology that provides fast, fair, and secure consensus.
- **HashConnect:** A library used to establish a secure connection between the dApp and users' Hedera accounts.
- **Ethers.js:** A JavaScript library for interacting with the Ethereum and compatible blockchains (used here for interacting with Hedera smart contracts).
- **TypeScript:** A typed superset of JavaScript that enhances development with static type checking.
- **Nuxt:** For building the user interface of the dApp.
- **Lighthouse:** For Storing images in IPFS

### How It Works

1. **Smart Contracts:** Match utilizes smart contracts deployed on the Hedera network. These contracts handle the creation, management, and retrieval of offers, requests, and user stores.
  
2. **Connection via HashConnect:** The dApp connects to users' Hedera accounts using HashConnect, enabling secure transactions and contract interactions.

3. **Contract Interactions:**
   - **CreateOffer:** Sellers can create an offer with specified parameters.
   - **AcceptOffer:** Buyers can accept an offer, initiating the transaction process.
   - **RemoveOffer:** Sellers can remove an existing offer.
   - **GetOffer:** Retrieve detailed information about a specific offer.
   - **GetRequest:** Retrieve details about a specific buyer request.
   - **GetUserStore:** Retrieve store information for a specific user.
   - **GetUserStoreIds:** Get all store IDs associated with a user.
   - **GetBuyerOffers:** Retrieve all offers related to a buyer's request.
   - **GetOfferImages:** Retrieve all images associated with a specific offer.
   - **GetRequestSellerIds:** Retrieve all seller IDs associated with a specific request.

### Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Kingsmen-hackers/match-client
   cd match-client
   ```

2. **Install Dependencies:**

   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```bash
    LIGHTHOUSE_API_KEY = 274fXXXXXXX.947
    HEDERA_BASE_URL = https://testnet.mirrornode.hedera.com
    MATCH_API_URL = https://ninth-matter-407315.wn.r.appspot.com
    CONTRACT_ID = 0.0.4708377
   ```

4. **Start the Development Server:**

   ```bash
   yarn start
   ```

5. **Build for Production:**

   ```bash
   yarn build
   ```

6. **Deploy the Application:** 

   Deploy the built application to your preferred hosting service.

### Usage

- **Creating Offers:** Sellers can log in, create new offers by providing the necessary details (price, images, etc.), and list them on the platform.
- **Accepting Offers:** Buyers can browse offers related to their requests, accept the most suitable ones, and initiate transactions.
- **Managing Stores:** Sellers can manage their stores, view store details, and retrieve all their store IDs.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the existing code style and includes appropriate test coverage.

### License

Match is licensed under the MIT License.

---

With Match, experience a seamless, secure, and efficient marketplace on the Hedera network, where buyers and sellers connect with confidence.