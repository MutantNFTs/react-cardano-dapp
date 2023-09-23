import { useWallet } from "./useWallet";

import { ERROR_CODES } from "../constants";

export const useSubmitTx = () => {
  const { walletApi } = useWallet();

  return walletApi
    ? walletApi.submitTx
    : () => {
        throw new Error(ERROR_CODES.NOT_CONNECTED);
      };
};
