export type Lovelace = bigint | number;
export type EncodedTxHash = Buffer;
export type EncodedPolicyId = Buffer;
export type EncodedAssetName = Buffer;
export type EncodedAddressHash = Buffer;

export type EncodedAssetMap = Map<
  EncodedPolicyId,
  Map<EncodedAssetName, bigint | number>
>;

export type EncodedValue = [Lovelace, EncodedAssetMap] | Lovelace;

export type Balance = {
  lovelace: Lovelace;
  assets: AssetMap;
};

export type AssetMap = {
  [policyId: string]: {
    [assetName: string]: bigint;
  };
};
