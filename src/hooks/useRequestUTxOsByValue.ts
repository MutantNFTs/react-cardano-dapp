import { selectUtxosByValue, Value } from "@mutants/cardano-tx-builder";

import { CardanoWallet } from "../CardanoWallet";
import { CARDANO_DAPP_SPENT_UTXOS_STORAGE_KEY } from "../constants";

export const useRequestUTxOsByValue = () => {
  return async (requestedValue: Value) => {
    const walletUtxos = await CardanoWallet.getUTxOs();

    const storageSpentInputs =
      window.sessionStorage.getItem(CARDANO_DAPP_SPENT_UTXOS_STORAGE_KEY) || "";

    const availableUtxos = walletUtxos.filter(
      (utxo) => !storageSpentInputs.includes(`${utxo.txHash}|${utxo.txIndex}`)
    );

    return selectUtxosByValue(availableUtxos, requestedValue);
  };
};
