import { useCallback, useEffect, useState } from "react";

import { useWallet } from "./useWallet";

import { CardanoWallet } from "../CardanoWallet";

export const usePaymentAddress = (preferredAddress?: string) => {
  const { walletApi } = useWallet();

  const [loading, setLoading] = useState(true);

  const [paymentAddress, setPaymentAddress] = useState<string>();

  const refresh = useCallback(async () => {
    if (walletApi) {
      setLoading(true);

      const addr = await CardanoWallet.getPaymentAddress(preferredAddress);

      if (addr && addr !== paymentAddress) {
        setPaymentAddress(addr);
      }

      setLoading(false);
    }
  }, [walletApi, preferredAddress]);

  useEffect(() => {
    refresh();
  }, [walletApi, preferredAddress]);

  return {
    paymentAddress,
    loading,
    refresh,
  };
};
