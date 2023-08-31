import { useCallback, useEffect, useState } from "react";

import { useWallet } from "./useWallet";

import { hexToStakeAddr } from "../utils/hexToStakeAddr";

export const useStakeAddress = () => {
  const { walletApi } = useWallet();
  const [loading, setLoading] = useState(true);

  const [stakeAddress, setStakeAddress] = useState<string>();

  const refresh = useCallback(() => {
    setLoading(true);

    walletApi?.getUnusedAddresses().then(async (unusedAddresses: string[]) => {
      let hexAddr: string | null = null;

      if (!unusedAddresses?.length) {
        const usedAddresses = await walletApi.getUsedAddresses();

        if (usedAddresses?.length) {
          hexAddr = usedAddresses[0];
        }
      } else {
        hexAddr = unusedAddresses[0];
      }

      if (hexAddr) {
        setStakeAddress(hexToStakeAddr(hexAddr));
        setLoading(false);
      }
    });
  }, [walletApi]);

  useEffect(() => {
    refresh();
  }, [walletApi]);

  return { stakeAddress, refresh, loading };
};
