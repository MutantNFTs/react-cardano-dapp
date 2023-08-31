import { useMemo } from "react";

import { CardanoWalletInfo } from "../types";

type CardanoWindow = {
  cardano?: {
    [key: string]: CardanoWalletInfo;
  };
};

export const useAvailableWallets = () => {
  const cardano = (window as CardanoWindow).cardano;

  const cardanoWallets = useMemo(() => {
    return Object.entries(cardano || {})
      .filter(([, w]) => !!w.enable)
      .map(([id, w]) => ({
        id,
        ...w,
      }));
  }, [cardano]);

  return cardanoWallets;
};
