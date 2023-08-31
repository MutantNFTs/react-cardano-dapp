import { createContext } from "react";

import { CardanoWalletApi, CardanoWalletInfo } from "../types";

export const LOCAL_STORAGE_WALLET_KEY = "react-cardano-dapp-connected-wallet";

type WalletContextType = {
  walletInfo?: CardanoWalletInfo;
  walletApi?: CardanoWalletApi;
  connectedWalletId?: string;
  setWalletInfo?: (walletInfo: CardanoWalletInfo | undefined) => void;
  setWalletApi?: (walletApi: CardanoWalletApi | undefined) => void;
  setConnectedWalletId?: (walletId: string | undefined) => void;
};

export const WalletContext = createContext<WalletContextType>({});
