import { toAda } from "@mutants/cardano-utils";

import { adaToCurrency } from "./adaToCurrency";

export const lovelaceToCurrency = (lovelace: bigint): string =>
  adaToCurrency(toAda(lovelace));
