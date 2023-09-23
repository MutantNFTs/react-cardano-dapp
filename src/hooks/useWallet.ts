import { useCallback, useEffect, useState } from "react";

import { CardanoWallet } from "../CardanoWallet";
import { CardanoWalletApi, CardanoWalletInfo } from "../types";

export const useWallet = () => {
  const [walletApi, setWalletApi] = useState<CardanoWalletApi>();
  const [walletInfo, setWalletInfo] = useState<CardanoWalletInfo>();

  const onConnectionChange = useCallback(() => {
    setWalletApi(CardanoWallet.getWalletApi());
    setWalletInfo(CardanoWallet.getWalletInfo());
  }, []);

  useEffect(() => {
    CardanoWallet.listenConnection(onConnectionChange);

    return () => {
      CardanoWallet.unlistenConnection(onConnectionChange);
    };
  }, []);

  return { walletApi, walletInfo };
};
