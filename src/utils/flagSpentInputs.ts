import { UTxO } from "@mutants/cardano-tx-builder";

import { CARDANO_DAPP_SPENT_UTXOS_STORAGE_KEY } from "../constants";

export const flagSpentInputs = (utxos: UTxO[]) => {
  const storageSpentInputs = window.sessionStorage.getItem(
    CARDANO_DAPP_SPENT_UTXOS_STORAGE_KEY
  );

  const spentInputs = utxos.map((utxo) => `${utxo.txHash}|${utxo.txIndex}`);

  if (typeof storageSpentInputs === "string" && spentInputs.length) {
    window.sessionStorage.setItem(
      CARDANO_DAPP_SPENT_UTXOS_STORAGE_KEY,
      storageSpentInputs + "," + spentInputs.join(",")
    );
  } else {
    window.sessionStorage.setItem(
      CARDANO_DAPP_SPENT_UTXOS_STORAGE_KEY,
      spentInputs.join(",")
    );
  }
};
