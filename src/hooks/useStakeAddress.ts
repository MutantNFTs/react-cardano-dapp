import { useEffect, useState } from "react";

import { toStakeAddress } from "@mutants/cardano-utils";

import { usePaymentAddress } from "./usePaymentAddress";

export const useStakeAddress = () => {
  const [stakeAddress, setStakeAddress] = useState<string>();
  const {
    paymentAddress,
    refresh: refreshPaymentAddress,
    loading,
  } = usePaymentAddress();

  useEffect(() => {
    if (paymentAddress) {
      setStakeAddress(toStakeAddress(paymentAddress));
    }
  }, [paymentAddress]);

  return {
    stakeAddress,
    loading,
    refresh: refreshPaymentAddress,
  };
};
