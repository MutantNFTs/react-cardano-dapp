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

      const cachedSignature = window.localStorage.getItem(
        `signed_payload_${payload}_${paymentAddr}`
      );

      if (cachedSignature) {
        return JSON.parse(cachedSignature) as SignatureData;
      }

      const signedData = await walletApi.signData(address, payload);

      if (signedData) {
        const signature = signedData.signature;
        const key = signedData.key;
        const decodedSignature = decode(signature) as [Buffer];
        const decodedKey = decode(key) as Map<number, Buffer>;
        const pkh = decodedKey.get(-2)?.toString("hex");
        const decodedHeaderMap = decode(
          decodedSignature[0].toString("hex")
        ) as Map<string, Buffer>;
        const hexAddressSignature = decodedHeaderMap.get("address");

        if (
          hexAddressSignature &&
          hexAddressSignature.toString("hex") === address
        ) {
          const signatureData = {
            signature,
            hexAddress: hexAddressSignature.toString("hex"),
            pkh,
          } as SignatureData;

          window.localStorage.setItem(
            `signed_payload_${payload}_${paymentAddr}`,
            JSON.stringify(signatureData)
          );

          return signatureData;
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
