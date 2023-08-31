import { bech32 } from "bech32";

import { hexToBytes } from "./hexToBytes";

export const hexToStakeAddr = (hexAddress: string) => {
  const stakeHexAddress = hexAddress.substring(58);
  const stakeHexBytes = hexToBytes("e1" + stakeHexAddress);
  const bech32Words = bech32.toWords(stakeHexBytes);

  return bech32.encode("stake", bech32Words, 120);
};
