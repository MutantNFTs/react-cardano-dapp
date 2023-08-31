import { useCallback, useEffect, useState } from "react";

import { useWallet } from "./useWallet";

import { decodeBalance } from "../decoders/decodeBalance";

export const useLovelaceBalance = () => {
  const { walletApi } = useWallet();
  const [loading, setLoading] = useState(true);

  const [lovelaceBalance, setLovelaceBalance] = useState<bigint>(0n);

  const refresh = useCallback(() => {
    setLoading(true);

    walletApi?.getBalance().then((balance) => {
      const decodedBalance = decodeBalance(balance, { ignoreAssets: true });

      setLovelaceBalance(BigInt(decodedBalance.lovelace.toString()) || 0n);
      setLoading(false);
    });
  }, [walletApi]);

  useEffect(() => {
    refresh();
  }, [walletApi]);

  return { balance: lovelaceBalance, refresh, loading };
};
