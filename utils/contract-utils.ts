export const getEvmAddress = async (account_id: string) => {
  const env = useRuntimeConfig().public;
  const url = `${env.hederaBaseUrl}/api/v1/accounts/${account_id}?limit=1`;

  try {
    const res = await $fetch<{ evm_address: string }>(url);
    return res?.evm_address;
  } catch (error: any) {
    return error?.message || "Something went wrong";
  }
};

export const hbarToWei = (hbar: any) => {
  return +hbar * 10 ** 18;
};
export const weiToHbar = (wei: any) => {
  return +wei / 10 ** 18;
};
