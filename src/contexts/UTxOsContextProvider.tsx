import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { decodeUtxo, UTxO } from "@mutants/cardano-tx-builder";

import { UTxOsContext } from "./UTxOsContext";

import { useWallet } from "../hooks/useWallet";

export const UTxOsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [decodedUTxOs, setDecodedUTxOs] = useState<UTxO[]>([]);

  const { walletApi } = useWallet();

  const decodeUTxOs = useCallback(async () => {
    if (!walletApi) {
      return;
    }

    const utxos = await walletApi?.getUtxos();

    setDecodedUTxOs(utxos.map(decodeUtxo));
  }, [walletApi]);

  useEffect(() => {
    decodeUTxOs();
  }, [walletApi, decodeUTxOs]);

  const memoizedResult = useMemo(
    () => ({
      utxos: decodedUTxOs,
      refresh: decodeUTxOs,
    }),
    [decodedUTxOs, decodeUTxOs]
  );

  return (
    <UTxOsContext.Provider value={memoizedResult}>
      {children}
    </UTxOsContext.Provider>
  );
};
