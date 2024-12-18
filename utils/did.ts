import {
    DidMethodOperation,
    HcsDid,
  HcsIdentityNetwork,
  HcsIdentityNetworkBuilder,
} from "@hashgraph/did-sdk-js";
import { Hbar, PrivateKey } from "@hashgraph/sdk";

const getIdNetwork = (): Promise<HcsIdentityNetwork> => {
  const privateKey = PrivateKey.generate();

  // Derive the public key
  const publicKey = privateKey.publicKey;
  const identityNetwork = new HcsIdentityNetworkBuilder()
    .setNetwork("testnet") // or "mainnet"
    .setAppnetName("MatchAppnet")
    .setPublicKey(publicKey)
    .setMaxTransactionFee(new Hbar(2))
    .setDidTopicMemo("MatchAppnet DID topic")
    .setVCTopicMemo("MatchAppnet VC topic")
    .execute(client);
  return identityNetwork;
};

const saveUserDetails = async () => {
  const identityNetwork = await getIdNetwork();
  const didRootKey = HcsDid.generateDidRootKey();
  const hcsDid = identityNetwork.generateDid(didRootKey.publicKey, true);

  const phoneNumber = "+1234567890"; // Example phone number

  const didDocument = hcsDid.generateDidDocument();
  didDocument.addCustomProperty("phoneNumber", phoneNumber);

  const didDocumentJson = didDocument.toJson();
  console.log("DID Document:", didDocumentJson);
  await identityNetwork
    .createDidTransaction(DidMethodOperation.CREATE)
    .setDidDocument(didDocumentJson)
    .signMessage((doc) => didRootKey.sign(doc))
    .buildAndSignTransaction((tx) => tx.setMaxTransactionFee(new Hbar(2)))
    .onMessageConfirmed((msg) => {
      console.log("DID Document published!", msg);
    })
    .execute(client);
};

const resolveDid = async (did: string) => {
  const identityNetwork = await getIdNetwork();
  const didDocument = await identityNetwork.resolveDid(did);
  console.log("DID Document:", didDocument);
};
