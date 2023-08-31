export type CardanoWalletInfo = {
  name: string;
  icon: string;
  enable?: () => Promise<void>;
};

export type CardanoWalletApi = {
  getBalance: () => Promise<string>;
  getCollateral: () => Promise<string[]>;
  getUtxos: () => Promise<string[]>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
};

export * from "./decoders/types";
