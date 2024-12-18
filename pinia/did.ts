import {
  HcsIdentityNetworkBuilder,
  HcsDid,
  DidMethodOperation,
  HcsIdentityNetwork,
} from "@hashgraph/did-sdk-js";

import {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  Hbar,
  TopicInfoQuery,
  FileId,
  Key,
  PublicKey,
} from "@hashgraph/sdk";

const client = Client.forTestnet(); // Or `forMainnet()` if using mainnet
client.setOperator("process.env.OPERATOR_ID", "process.env.OPERATOR_KEY");

const getIdNetwork = async () => {
  const createdNetwork = await HcsIdentityNetwork.fromAddressBookFile(
    client,
    "testnet",
    FileId.fromString("0.0.5287570")
  );
  return createdNetwork;
};

const saveUserDetails = async () => {
  const identityNetwork = await getIdNetwork();

  console.log(identityNetwork);
  const ADDRESS_BOOK_JSON = `{"appnetName":"Test Identity SDK appnet","didTopicId":"${identityNetwork.getDidTopicId()}","vcTopicId":"${identityNetwork.getVcTopicId()}","appnetDidServers":["http://localhost:3000/api/v1"]}`;

  const response = await new FileCreateTransaction()
    .setContents(ADDRESS_BOOK_JSON)
    // .setKeys([client.operatorPublicKey])
    .setMaxTransactionFee(new Hbar(2))
    .execute(client);

  const receipt = await response.getReceipt(client);
  const addressBookFileId = receipt.fileId;
  const didRootKey = HcsDid.generateDidRootKey();
  const hcsDid = new HcsDid(
    "testnet",
    didRootKey.publicKey as any,
    addressBookFileId!
  );
  const didDocument = hcsDid.generateDidDocument();

  const didDocumentJson = didDocument.toJSON();
  console.log("DID Document:", didDocumentJson);
  await identityNetwork
    .createDidTransaction(DidMethodOperation.CREATE)
    .setDidDocument(didDocumentJson)
    .signMessage((doc) => didRootKey.sign(doc))
    .buildAndSignTransaction((tx) => tx.setMaxTransactionFee(new Hbar(2)))
    .execute(client);
};

const until = function (maxTime: number, untilFunction: any) {
  return new Promise((resolve, reject) => {
    let t: any, i: any;
    i = setInterval(() => {
      if (untilFunction()) {
        clearInterval(i);
        clearTimeout(t);
        resolve(null);
      }
    }, 100);
    t = setTimeout(() => {
      clearInterval(i);
      clearTimeout(t);
      resolve(null);
    }, maxTime);
  });
};

const resolveDid = async (didString: string) => {
  const identityNetwork = await getIdNetwork();
  const mapRef: any[] = [];
  const NO_MORE_MESSAGES_TIMEOUT = 15 * 1000;
  const MIRROR_NODE_TIMEOUT = 30 * 1000;
  identityNetwork
    .getDidResolver()
    .addDid(didString)
    .setTimeout(NO_MORE_MESSAGES_TIMEOUT)
    .onError((err) => console.error("Error resolving DID:", err))
    .whenFinished((m) => mapRef.push(m))
    .execute(client);

  await until(MIRROR_NODE_TIMEOUT, () => !!mapRef.length);

  try {
    return mapRef[0].get(didString);
  } catch (error) {
    return undefined;
  }
};
resolveDid(
  "did:hedera:testnet:5Pi8KJgjtGpEdeMumZ86dPjWrbVejLW8rYLRMwx2P2vc;hedera:testnet:fid=0.0.5287609"
).then((res) => {
  const msg = res.open();
  console.log(msg);
});

// const resolvedDidDocument = await identityNetwork.resolveDid(hcsDid.toString());
// const storedPhoneNumber = resolvedDidDocument.getCustomProperty("phoneNumber");

// console.log("Retrieved Phone Number:", storedPhoneNumber);
