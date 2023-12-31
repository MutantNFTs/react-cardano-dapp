import { useCallback, useEffect, useState } from "react";

import { AssetMap, decodeBalance, Lovelace } from "@mutants/cardano-tx-builder";

import { useWallet } from "./useWallet";

type Balance = {
  lovelace: Lovelace;
  assets: AssetMap;
};

export const useBalance = () => {
  const [loading, setLoading] = useState(true);

  const { walletApi } = useWallet();

  const [balance, setBalance] = useState<Balance>({
    lovelace: 0n,
    assets: {},
  });

  const refresh = useCallback(() => {
    if (walletApi) {
      setLoading(true);

      walletApi?.getBalance().then((encodedBalance) => {
        const balance = decodeBalance(encodedBalance);

        setBalance(balance);
        setLoading(false);
      });
    }
  }, [walletApi]);

  useEffect(() => {
    refresh();
  }, [walletApi]);

  return { balance, refresh, loading };
};
