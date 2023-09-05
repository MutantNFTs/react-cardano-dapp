import { decode } from "cbor";
import { useCallback } from "react";

import { toHexAddress } from "@mutants/cardano-utils";

import { useWallet } from "./useWallet";

export type SignatureData = {
  signature: string;
  hexAddress: string;
  pkh: string;
};

export const useSignData = () => {
  const { walletApi } = useWallet();

  const signData = useCallback(
    async (
      paymentAddr: string,
      payload: string
    ): Promise<SignatureData | null> => {
      if (!walletApi) {
        throw new Error("User is not connected.");
      }

      const usedAddresses = await walletApi.getUsedAddresses();
      const address = usedAddresses.find(
        (usedAddr) => usedAddr === toHexAddress(paymentAddr)
      );

      if (!address) {
        throw new Error("Invalid payment address.");
      }

      const signedData = await walletApi.signData(address, payload);

      if (signedData) {
        const signature = signedData.signature;
        const decodedSignature = decode(signature) as [Buffer];
        const decodedHeaderMap = decode(
          decodedSignature[0].toString("hex")
        ) as Map<string, Buffer>;
        const hexAddressSignature = decodedHeaderMap.get("address");

        if (
          hexAddressSignature &&
          hexAddressSignature.toString("hex") === address
        ) {
          return {
            signature,
            hexAddress: hexAddressSignature.toString("hex"),
            pkh: hexAddressSignature.toString("hex").substring(2, 58),
          } as SignatureData;
        } else {
          throw new Error("Invalid signature.");
        }
      }

      return null;
    },
    [walletApi]
  );

  return signData;
};
