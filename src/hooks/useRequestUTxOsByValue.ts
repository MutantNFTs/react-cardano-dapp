import { selectUtxosByValue, Value } from "@mutants/cardano-tx-builder";

import { useUTxOs } from "./useUTxOs";

export const useRequestUTxOsByValue = () => {
  const { utxos, refresh } = useUTxOs();

  return async (requestedValue: Value) => {
    let result = selectUtxosByValue(utxos, requestedValue);

    if (result.missing) {
      // take another shot since decoded UTxOs are cached.
      await refresh();

      result = selectUtxosByValue(utxos, requestedValue);
    }

    return result;
  };
};
