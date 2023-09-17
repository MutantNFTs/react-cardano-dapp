import { useMemo } from "react";

import { AssetMap } from "@mutants/cardano-tx-builder";

import { useBalance } from "./useBalance";

type UseWalletNftsOpts = {
  policyIds?: string[];
};

export const useSelectWalletNfts = (
  opts?: UseWalletNftsOpts
): { loading: boolean; nfts: AssetMap } => {
  const { balance, loading } = useBalance();

  const filteredAssets = useMemo(() => {
    if (opts?.policyIds?.length) {
      return opts.policyIds.reduce<AssetMap>(
        (acc, key) => ({ ...acc, [key]: balance.assets[key] || {} }),
        {}
      );
    } else {
      return balance.assets;
    }
  }, [loading]);

  return { nfts: filteredAssets, loading };
};
