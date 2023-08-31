/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect } from "react";

import {
  LOCAL_STORAGE_WALLET_KEY,
  WalletContext,
} from "../contexts/WalletContext";
import { CardanoWalletApi } from "../types";

let connecting = false;

export const useWallet = () => {
  const {
    setWalletApi,
    setConnectedWalletId,
    connectedWalletId,
    walletApi,
    setWalletInfo,
    walletInfo,
  } = useContext(WalletContext);

  const disconnect = useCallback(() => {
    window.localStorage.removeItem(LOCAL_STORAGE_WALLET_KEY);

    setConnectedWalletId?.(undefined);
    setWalletApi?.(undefined);
    setWalletInfo?.(undefined);
  }, []);

  const connect = useCallback(async (walletId: string) => {
    try {
      if (connecting) {
        return;
      }

      connecting = true;

      const walletInfo = (window as any).cardano?.[walletId];

      if (!walletInfo) {
        // Sometimes extension takes a while to load
        setTimeout(() => {
          connect(walletId);
        }, 5000);
      }

      const enabledWallet = await walletInfo?.enable?.();

      if (enabledWallet && !enabledWallet?.error) {
        window.localStorage.setItem(LOCAL_STORAGE_WALLET_KEY, walletId);

        setWalletInfo?.(walletInfo);
        setConnectedWalletId?.(walletId);
        setWalletApi?.(enabledWallet as CardanoWalletApi);
      }
    } catch (e) {
      console.log("Error when trying to connect wallet", e);

      return false;
    } finally {
      connecting = false;
    }
  }, []);

  useEffect(() => {
    if (!walletApi && connectedWalletId) {
      connect(connectedWalletId);
    }
  }, [connectedWalletId, walletApi]);

  return { connect, disconnect, walletApi, walletInfo, connectedWalletId };
};
