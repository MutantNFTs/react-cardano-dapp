import { CIP_68_ASSET_PREFIX } from "./cip68";
import { hexToString } from "./hexToString";

export const decodeAssetName = (assetName: string) => {
  return assetName.startsWith(CIP_68_ASSET_PREFIX)
    ? hexToString(assetName.substring(CIP_68_ASSET_PREFIX.length))
    : hexToString(assetName);
};
