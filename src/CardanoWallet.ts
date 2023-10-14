import { decodeUtxo, UTxO } from "@mutants/cardano-tx-builder";
import { toHexAddress, toPaymentAddress } from "@mutants/cardano-utils";

import { CardanoWalletApi, CardanoWalletInfo } from "./types";

export const LOCAL_STORAGE_WALLET_KEY = "react-cardano-dapp-connected-wallet";

type OnConnectCallback = () => void;

export class CardanoWallet {
  private static isConnecting = false;
  private static walletId: string | undefined;
  private static walletInfo: CardanoWalletInfo | undefined;
  private static walletApi: CardanoWalletApi | undefined;
  private static decodedUTxOs: UTxO[];

  private static currentPaymentAddress: string;
  private static connectionStatusListeners: OnConnectCallback[] = [];

  public static isConnected(
    walletApi?: CardanoWalletApi | undefined
  ): walletApi is CardanoWalletApi {
    return !!(this.walletId && this.walletInfo && this.walletApi);
  }

  public static setConnectedWalletId(walletId: string | undefined) {
    this.walletId = walletId;
  }

  public static setWalletApi(walletApi: CardanoWalletApi | undefined) {
    this.walletApi = walletApi;
  }

  public static setWalletInfo(walletInfo: CardanoWalletInfo | undefined) {
    this.walletInfo = walletInfo;
  }

  public static getWalletApi() {
    return this.walletApi;
  }

  public static getWalletInfo() {
    return this.walletInfo;
  }

  public static getWalletId() {
    return this.walletId;
  }

  public static async getUTxOs(): Promise<UTxO[]> {
    if (!this.isConnected(this.walletApi)) {
      return [];
    }

    if (this.decodedUTxOs) {
      return this.decodedUTxOs;
    }

    await this.refreshUTxOs();

    return this.decodedUTxOs;
  }

  public static async refreshUTxOs() {
    if (this.isConnected(this.walletApi)) {
      const utxos = await this.walletApi.getUtxos();

      const decodedUTxOs = utxos.map(decodeUtxo);

      this.decodedUTxOs = decodedUTxOs;
    }
  }

  public static async getPaymentAddress(preferredAddressIfAvailable?: string) {
    if (!this.isConnected(this.walletApi)) {
      return null;
    }

    if (
      this.currentPaymentAddress &&
      (!preferredAddressIfAvailable ||
        preferredAddressIfAvailable === this.currentPaymentAddress)
    ) {
      return this.currentPaymentAddress;
    }

    const usedAddresses = await this.walletApi.getUsedAddresses();

    let hexAddr: string | null = null;

    if (!usedAddresses?.length) {
      const unusedAddresses = await this.walletApi.getUnusedAddresses();

      if (unusedAddresses?.length) {
        if (preferredAddressIfAvailable) {
          const hexPreferredAddress = toHexAddress(preferredAddressIfAvailable);

          hexAddr =
            usedAddresses.find((u) => u === hexPreferredAddress) ||
            unusedAddresses[0];
        } else {
          hexAddr = usedAddresses[0];
        }
      }
    } else {
      hexAddr = usedAddresses[0];
    }

    if (hexAddr) {
      return toPaymentAddress(hexAddr);
    }

    return null;
  }

  public static getStorageWalletId() {
    return window.localStorage.getItem(LOCAL_STORAGE_WALLET_KEY);
  }

  public static async connectPassive() {
    const storageWalletId = this.getStorageWalletId();

    if (!this.isConnected() && storageWalletId) {
      return this.connect(storageWalletId);
    }
  }

  public static listenConnection(fn: () => void) {
    this.connectionStatusListeners.push(fn);

    fn();
  }

  public static unlistenConnection(fn: () => void) {
    this.connectionStatusListeners = this.connectionStatusListeners.filter(
      (listener) => listener !== fn
    );
  }

  public static async connect(walletId: string) {
    try {
      if (this.isConnecting) {
        return;
      }

      this.isConnecting = true;

      const walletInfo = window.cardano?.[walletId];

      if (!walletInfo) {
        // Sometimes extension takes a while to load
        setTimeout(() => {
          this.connect(walletId);
        }, 2000);
      }

      const enabledWallet = await walletInfo?.enable?.();

      if (enabledWallet && !enabledWallet?.error) {
        window.localStorage.setItem(LOCAL_STORAGE_WALLET_KEY, walletId);

        this.setWalletInfo(walletInfo);
        this.setWalletApi(enabledWallet);
        this.setConnectedWalletId(walletId);

        this.isConnecting = false;

        this.connectionStatusListeners.forEach((listener) => listener());
      }
    } catch (e) {
      console.log("Error when trying to connect wallet", e);

      this.isConnecting = false;
    } finally {
      this.isConnecting = false;
    }
  }

  public static disconnect() {
    window.localStorage.removeItem(LOCAL_STORAGE_WALLET_KEY);

    CardanoWallet.setConnectedWalletId(undefined);
    CardanoWallet.setWalletApi(undefined);
    CardanoWallet.setWalletInfo(undefined);

    this.connectionStatusListeners.forEach((listener) => listener());
  }
}
