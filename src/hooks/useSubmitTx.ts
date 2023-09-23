import { useWallet } from "./useWallet";

import { ERROR_CODES } from "../constants";

export const useSubmitTx = () => {
  const { walletApi } = useWallet();

  return walletApi
    ? async (tx: string) => {
        try {
          await walletApi.submitTx(tx);
        } catch (e) {
          if (e instanceof Error) {
            if (e.message?.includes("declined")) {
              // suppress declined errors
              return;
            }
          }

          throw e;
        }
      }
    : () => {
        throw new Error(ERROR_CODES.NOT_CONNECTED);
      };
};
