import { useEffect, useState } from "react";

import { UTxO } from "@mutants/cardano-tx-builder";

import { useWallet } from "./useWallet";

import { CardanoWallet } from "../CardanoWallet";

export const useUTxOs = () => {
  const { walletApi } = useWallet();
  const [utxos, setUTxOs] = useState<UTxO[]>([]);

  useEffect(() => {
    if (walletApi) {
      CardanoWallet.getUTxOs().then((utxos) => {
        setUTxOs(utxos);
      });
    }
  }, [walletApi]);

  return {
    utxos,
    refresh: async () => {
      await CardanoWallet.refreshUTxOs();
      const refreshedUtxos = await CardanoWallet.getUTxOs();

      setUTxOs(refreshedUtxos);
    },
  };
};
