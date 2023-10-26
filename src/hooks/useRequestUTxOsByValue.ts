import { selectUtxosByValue, Value } from "@mutants/cardano-tx-builder";

import { useUTxOs } from "./useUTxOs";

import { CardanoWallet } from "../CardanoWallet";

export const useRequestUTxOsByValue = () => {
  const { utxos, refresh } = useUTxOs();

  return async (requestedValue: Value) => {
    const availableUtxos = utxos.length
      ? utxos
      : await CardanoWallet.getUTxOs();

    let result = selectUtxosByValue(availableUtxos, requestedValue);

    if (result.missing) {
      // take another shot since decoded UTxOs are cached.
      await refresh();

      result = selectUtxosByValue(
        await CardanoWallet.getUTxOs(),
        requestedValue
      );
    }

    return result;
  };
};
