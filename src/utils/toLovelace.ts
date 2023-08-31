export const toLovelace = (ada: number): bigint =>
  BigInt(ada) * BigInt(1000000);
