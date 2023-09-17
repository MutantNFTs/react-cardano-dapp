import { useWallet } from "./useWallet";

import { ERROR_CODES } from "../constants";

export const useSignTx = () => {
  const { walletApi } = useWallet();

  return walletApi?.signTx
    ? walletApi.signTx
    : () => {
        throw new Error(ERROR_CODES.NOT_CONNECTED);
      };
};
