import { decodeAssetName } from "./decodeAssetName";

export const getAssetDetails = (asset: string) => {
  if (asset.includes(".")) {
    asset = asset.replace(".", "");
  }

  const assetPolicy = asset.substring(0, 56);
  const assetName = asset.substring(56);

  return {
    assetPolicy,
    assetName,
    name: decodeAssetName(assetName),
  };
};
