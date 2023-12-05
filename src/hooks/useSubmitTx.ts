import { useWallet } from "./useWallet";

import { CardanoWallet } from "../CardanoWallet";
import { ERROR_CODES } from "../constants";

export const useSubmitTx = () => {
  const { walletApi } = useWallet();

  return walletApi
    ? async (tx: string) => {
        try {
          const txHash = await walletApi.submitTx(tx);

          CardanoWallet.refreshUTxOs();

          return txHash;
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
