import { useMemo } from "react";

import { toStakeAddress } from "@mutants/cardano-utils";

import { usePaymentAddress } from "./usePaymentAddress";

export const useWalletAddress = () => {
  const {
    paymentAddress,
    refresh: refreshPaymentAddress,
    loading,
  } = usePaymentAddress();

  const stakeAddress = useMemo(
    () => (paymentAddress ? toStakeAddress(paymentAddress) : null),
    [paymentAddress]
  );

  return {
    stakeAddress,
    paymentAddress,
    loading,
    refresh: refreshPaymentAddress,
  };
};
