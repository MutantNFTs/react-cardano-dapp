import { selectUtxosByValue, Value } from "@mutants/cardano-tx-builder";

import { CardanoWallet } from "../CardanoWallet";

export const useRequestUTxOsByValue = () => {
  return async (requestedValue: Value) => {
    const availableUtxos = await CardanoWallet.getUTxOs();

    return selectUtxosByValue(availableUtxos, requestedValue);
  };
};
