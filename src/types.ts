export type CardanoWalletInfo = {
  name: string;
  icon: string;
  enable?: () => Promise<CardanoWalletApi>;
};

export type CardanoWalletApi = {
  getBalance: () => Promise<string>;
  getCollateral: () => Promise<string[]>;
  getUtxos: () => Promise<string[]>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  signTx: () => Promise<string>;
  submitTx: () => Promise<string>;
  signData: (
    hexAddress: string,
    hexPayload: string
  ) => Promise<{
    signature: string;
    key: string;
  }>;
  error?: string;
};

declare global {
  interface Window {
    cardano?: {
      [key: string]: CardanoWalletInfo;
    };
  }
}
