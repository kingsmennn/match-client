### Match - Connecting Buyers and Sellers on Hedera

---

**Match** is a decentralized application (dApp) built on the Hedera Hashgraph platform that connects buyers with sellers, allowing them to find the best deals on products and services. Using smart contracts on Hedera, Match ensures secure, transparent, and efficient transactions between parties.

### Team and Project Introduction

Our team consists of **Favour**, a Frontend Developer, and **David (DavyKing)**, a Blockchain Developer. With extensive experience in blockchain development, we've worked on various projects that leverage distributed ledger technologies to create secure and scalable applications. **Match** is our latest innovation, designed to address the challenges of connecting buyers and sellers in a decentralized, trustless environment using the unique capabilities of Hedera Hashgraph.

### Project Summary

**Match** aims to create a seamless, secure, and efficient marketplace on the Hedera network. By utilizing Hedera's fast, fair, and secure consensus mechanism, Match allows sellers to create and manage offers for products or services, while buyers can easily browse, accept, and complete transactions. The dApp leverages smart contracts to ensure that all interactions are transparent and tamper-proof. This approach addresses the issues of trust and security that often plague traditional online marketplaces.

Our solution is evaluated based on the following criteria:

1. **Innovation:** Match introduces a novel way of connecting buyers and sellers through a decentralized platform.
2. **Technical Complexity:** The use of smart contracts on Hedera and integration with HashConnect and Ethers.js demonstrates a high level of technical expertise.
3. **Usability:** The user interface built with Nuxt ensures a smooth user experience.
4. **Impact:** By decentralizing the marketplace, Match reduces the risk of fraud and increases transparency.
5. **Scalability:** Built on Hedera, Match can handle a high volume of transactions with minimal latency.
6. **Security:** Hedera's consensus mechanism ensures that all transactions are secure and immutable.
7. **Sustainability:** Match is designed to be energy-efficient, leveraging Hedera's low power consumption.

### Key Features

- **Create Offers:** Sellers can create offers for products or services, specifying price, images, and related details.
- **Accept Offers:** Buyers can review and accept offers that best meet their needs.
- **Remove Offers:** Sellers have the ability to remove offers if they are no longer available.
- **View Offers:** Buyers can view all offers related to their requests and select the most suitable one.
- **Get Request Details:** Users can retrieve detailed information about requests, including seller IDs and offer images.
- **Store Management:** Sellers can manage their stores, including viewing store details and retrieving store IDs.

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

### Demo

Check out our demo video to see Match in action! The video showcases the technical strengths, usability, and performance of our solution. Watch the walkthrough on [YouTube](https://www.youtube.com/watch?v=zecp5zHwz-8) to learn more about how Match can revolutionize the marketplace experience on Hedera.

### Price Feeds and USDC Integration

- **Price Feeds:** We are utilizing the latest price feed addresses on the Hedera network. You can find them here: [Chainlink Price Feeds](https://docs.chain.link/data-feeds/price-feeds/addresses?network=hedera&page=1).
- **USDC Integration:** We have integrated the Hedera Token Service into our smart contract to enable seamless USDC association, enhancing our transaction capabilities and ensuring efficient token management. [Hedera Token Service](https://hips.hedera.com/hip/hip-206)

### Future Roadmap

**Key Learnings:**

- The importance of a seamless user experience in dApps.
- The need for robust smart contract design to handle a wide range of marketplace scenarios.

**Next Steps:**

- **Enhanced User Profiles:** Adding more features to user profiles, including ratings and reviews.
- **Multi-Language Support:** Expanding the dApp's accessibility by supporting multiple languages.
- **Advanced Analytics:** Providing sellers with detailed analytics to better understand buyer behavior.
- **Mobile App Development:** Extending the platform to mobile devices to reach a broader audience.
- **Integration with Other Networks:** Exploring the possibility of integrating with other blockchain networks to offer cross-chain transactions.

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
      LIGHTHOUSE_API_KEY = 2XXX3.514XXXXXxfac947
      HEDERA_BASE_URL = https://testnet.mirrornode.hedera.com
      MATCH_API_URL = https://ninth-matter-407315.wn.r.appspot.com
      CONTRACT_ID = 0.0.5059450
      TIME_TILL_LOCK = 1 * 60 * 1000
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

### Indexer

- https://github.com/Kingsmen-hackers/finder-backend

### Contracts

- https://github.com/Kingsmen-hackers/match-contracts

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the existing code style and includes appropriate test coverage.

### License

Match is licensed under the MIT License.
