import { adaToCurrency } from "./adaToCurrency";
import { toAda } from "./toAda";

export const lovelaceToCurrency = (lovelace: bigint): string =>
  adaToCurrency(toAda(lovelace));
