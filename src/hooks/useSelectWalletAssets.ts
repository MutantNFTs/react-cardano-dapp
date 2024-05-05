import { useMemo } from "react";

import { AssetMap } from "@mutants/cardano-tx-builder";

import { useBalance } from "./useBalance";

type UseWalletAssetsOpts = {
  policyIds?: string[];
};

export const useSelectWalletAssets = (
  opts?: UseWalletAssetsOpts
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
  }, [loading, opts?.policyIds]);

  return { nfts: filteredAssets, loading };
};
