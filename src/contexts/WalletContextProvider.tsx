import React, { FC, PropsWithChildren, useState } from "react";

import { LOCAL_STORAGE_WALLET_KEY, WalletContext } from "./WalletContext";

import { CardanoWalletApi, CardanoWalletInfo } from "../types";

export const WalletContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const storageConnectedWallet =
    window.localStorage.getItem(LOCAL_STORAGE_WALLET_KEY) || undefined;

  const [connectedWalletId, setConnectedWalletId] = useState<
    string | undefined
  >(storageConnectedWallet);

  const [walletInfo, setWalletInfo] = useState<CardanoWalletInfo | undefined>();

  const [walletApi, setWalletApi] = useState<CardanoWalletApi>();

  return (
    <WalletContext.Provider
      value={{
        walletInfo,
        setWalletInfo,
        walletApi,
        setWalletApi,
        setConnectedWalletId,
        connectedWalletId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
