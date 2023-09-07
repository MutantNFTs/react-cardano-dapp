import { useCallback } from "react";

import { useSignData } from "../useSignData";
import { useWallet } from "../useWallet";

jest.mock("react");
jest.mock("../useWallet");

describe("useSignData", () => {
  beforeEach(() => {
    global.window = {
      localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      } as unknown as Storage,
    } as Window & typeof globalThis;

    (useCallback as jest.Mock).mockImplementation((cb) => cb);

    (useWallet as jest.Mock).mockReturnValue({
      walletApi: {
        getUsedAddresses: jest
          .fn()
          .mockReturnValue([
            "01e922e8166852073d6c1c9be0736530404c9c26d9ba1773e11d32d11c0f7b2c7f8924528d797a8f86d8210d6276e09f47b82ecd53a24900e7",
          ]),
        signData: jest.fn().mockReturnValue({
          signature:
            "845846a201276761646472657373583901e922e8166852073d6c1c9be0736530404c9c26d9ba1773e11d32d11c0f7b2c7f8924528d797a8f86d8210d6276e09f47b82ecd53a24900e7a166686173686564f4447465737458403cf5db9db281e7e0e84a5d0642b28d2bfc332b0cc6e69b0bbfaacf7318e3a99252d2a53edf0e381de42a5d67f16af9c2f7037275152717c660212d8e179cbb0c",
          key: "a4010103272006215820f7d1eb20e12b0beadf89e381fea835de7f04ca9ebfea014197a1ed2a48f0f77e",
        }),
      },
    });
  });

  it("should return the correct signature", async () => {
    const signedAction = useSignData();

    const output = await signedAction(
      "addr1q85j96qkdpfqw0tvrjd7qum9xpqye8pxmxapwulpr5edz8q00vk8lzfy22xhj750smvzzrtzwmsf73ac9mx48gjfqrnspq6sah",
      "test"
    );

    expect(output).toEqual({
      signature:
        "845846a201276761646472657373583901e922e8166852073d6c1c9be0736530404c9c26d9ba1773e11d32d11c0f7b2c7f8924528d797a8f86d8210d6276e09f47b82ecd53a24900e7a166686173686564f4447465737458403cf5db9db281e7e0e84a5d0642b28d2bfc332b0cc6e69b0bbfaacf7318e3a99252d2a53edf0e381de42a5d67f16af9c2f7037275152717c660212d8e179cbb0c",
      hexAddress:
        "01e922e8166852073d6c1c9be0736530404c9c26d9ba1773e11d32d11c0f7b2c7f8924528d797a8f86d8210d6276e09f47b82ecd53a24900e7",
      pkh: "f7d1eb20e12b0beadf89e381fea835de7f04ca9ebfea014197a1ed2a48f0f77e",
    });
  });

  it("should return cached signature", async () => {
    const signedAction = useSignData();

    (global.window.localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify({
        signature: "cached",
        hexAddress: "cached",
        pkh: "cached",
      })
    );

    const output = await signedAction(
      "addr1q85j96qkdpfqw0tvrjd7qum9xpqye8pxmxapwulpr5edz8q00vk8lzfy22xhj750smvzzrtzwmsf73ac9mx48gjfqrnspq6sah",
      "test"
    );

    expect(output).toEqual({
      signature: "cached",
      hexAddress: "cached",
      pkh: "cached",
    });
  });
});
