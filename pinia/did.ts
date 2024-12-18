import {
  DidMethodOperation,
  HcsDid,
  HcsIdentityNetwork,
  HcsIdentityNetworkBuilder,
} from "@hashgraph/did-sdk-js";
import { AccountId, Hbar, PrivateKey } from "@hashgraph/sdk";
import { useUserStore } from "./user";

// const getIdNetwork = async (): Promise<HcsIdentityNetwork> => {
//   return HcsIdentityNetwork.fromAddressBook();
// };

// const saveUserDetails = async () => {
//   const identityNetwork = await getIdNetwork();
//   const didRootKey = HcsDid.generateDidRootKey();
//   const hcsDid = identityNetwork.generateDid(didRootKey.publicKey, true);

//   const phoneNumber = "+1234567890"; // Example phone number

//   const didDocument = hcsDid.generateDidDocument();
//   didDocument.addCustomProperty("phoneNumber", phoneNumber);

//   const didDocumentJson = didDocument.toJson();
//   console.log("DID Document:", didDocumentJson);
//   await identityNetwork
//     .createDidTransaction(DidMethodOperation.CREATE)
//     .setDidDocument(didDocumentJson)
//     .signMessage((doc) => didRootKey.sign(doc))
//     .buildAndSignTransaction((tx) => tx.setMaxTransactionFee(new Hbar(2)))
//     .onMessageConfirmed((msg) => {
//       console.log("DID Document published!", msg);
//     })
//     .execute(client);
// };

// const resolveDid = async (didString: string) => {
//   const identityNetwork = await getIdNetwork();
//   const NO_MORE_MESSAGES_TIMEOUT = 15 * 1000;
//   identityNetwork
//     .getDidResolver()
//     .addDid(didString)
//     .setTimeout(NO_MORE_MESSAGES_TIMEOUT)
//     .onError(onError)
//     .whenFinished((m) => mapRef.push(m))
//     .execute(this.client);
// };
