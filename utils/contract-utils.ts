import { AccountResponse } from "types";

export const getAccountInfo = async (
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

export const hbarToWei = (hbar: any) => {
  return +hbar * 10 ** 8;
};
export const weiToHbar = (wei: any) => {
  return +wei / 10 ** 8;
};
