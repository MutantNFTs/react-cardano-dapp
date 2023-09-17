import { createContext } from "react";

import { UTxO } from "@mutants/cardano-tx-builder";

type UTxOsContextType = {
  utxos: UTxO[];
  refresh: () => Promise<void>;
};

export const UTxOsContext = createContext<UTxOsContextType>({
  utxos: [],
  refresh: () => Promise.resolve(),
});
