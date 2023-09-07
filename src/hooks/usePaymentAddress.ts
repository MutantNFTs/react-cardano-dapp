import { useCallback, useEffect, useState } from "react";

import { toHexAddress, toPaymentAddress } from "@mutants/cardano-utils";

import { useWallet } from "./useWallet";

export const usePaymentAddress = (preferredAddress?: string) => {
  const { walletApi } = useWallet();
  const [loading, setLoading] = useState(true);

  const [paymentAddress, setPaymentAddress] = useState<string>();

  const refresh = useCallback(async () => {
    if (walletApi) {
      setLoading(true);

      const usedAddresses = await walletApi.getUsedAddresses();

      let hexAddr: string | null = null;

      if (!usedAddresses?.length) {
        const unusedAddresses = await walletApi.getUnusedAddresses();

        if (unusedAddresses?.length) {
          if (preferredAddress) {
            const hexPreferredAddress = toHexAddress(preferredAddress);

            hexAddr =
              usedAddresses.find((u) => u === hexPreferredAddress) ||
              unusedAddresses[0];
          } else {
            hexAddr = usedAddresses[0];
          }
        }
      } else {
        hexAddr = usedAddresses[0];
      }

      if (hexAddr) {
        setPaymentAddress(toPaymentAddress(hexAddr));
        setLoading(false);
      }
    }
  }, [walletApi]);

  useEffect(() => {
    refresh();
  }, [walletApi]);

  return {
    paymentAddress,
    loading,
    refresh,
  };
};
