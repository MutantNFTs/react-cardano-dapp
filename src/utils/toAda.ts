export const toAda = (lovelace: bigint): number =>
  parseFloat((lovelace / 1000000n).toString());
