import { AccountResponse } from "types";

export const getEvmAddress = async (
  account_id: string
): Promise<AccountResponse> => {
  const env = useRuntimeConfig().public;
  const url = `${env.hederaBaseUrl}/api/v1/accounts/${account_id}?limit=1`;

  try {
    const res = await $fetch<AccountResponse>(url);
    return res;
  } catch (error: any) {
    return error?.message || "Something went wrong";
  }
};

// tokens = result['balance']['tokens']
//         for token in tokens:
//             if(token['token_id'] == token_Id):
//                 return float(token['balance'])
//         return 0.0

// const res = {
//   evm_address: "0x1234",
//   balance: {
//     hbar: 100,
//     tokens: [
//       {
//         token_id: "0x1234",
//         balance: 100,
//       },
//     ],
//   },
// };

export const hbarToWei = (hbar: any) => {
  return +hbar * 10 ** 8;
};
export const weiToHbar = (wei: any) => {
  return +wei / 10 ** 8;
};
