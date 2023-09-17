import { useMemo } from "react";

export const useAvailableWallets = () => {
  const cardano = window.cardano;

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
