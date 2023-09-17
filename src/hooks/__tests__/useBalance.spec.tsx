import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";

import { useBalance } from "../useBalance";
import { useWallet } from "../useWallet";

jest.mock("../useWallet");

const mockWalletApi = {
  getBalance: jest
    .fn()
    .mockResolvedValue(
      "821a0e9ad415b1581c0c442180dd6163682d8e03b271caefb4944a24412bdd07adafb04ccba14a50494e41434f4c4144411909c4581c16fdd33c86af604e837ae57d79d5f0f1156406086db5f16afb3fcf51a14544474f4c441a02faf080581c29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6a1434d494e1a02fa6239581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411b8224e000de1404d5554414e5430313439014e000de1404d5554414e5430343131014e000de1404d5554414e5430353332014e000de1404d5554414e5430353939014e000de1404d5554414e5430363235014e000de1404d5554414e5430383832014e000de1404d5554414e5431303131014e000de1404d5554414e5431323138014e000de1404d5554414e5431323937014e000de1404d5554414e5431333833014e000de1404d5554414e5431363035014e000de1404d5554414e5431383239014e000de1404d5554414e5431383533014e000de1404d5554414e5432313730014e000de1404d5554414e5432333230014e000de1404d5554414e5432343533014e000de1404d5554414e5432383432014e000de1404d5554414e5433313634014e000de1404d5554414e5433323233014e000de1404d5554414e5433333238014e000de1404d5554414e5434333138014e000de1404d5554414e5434333731014e000de1404d5554414e5434343434014e000de1404d5554414e5434363838014e000de1404d5554414e5435313939014e000de1404d5554414e5435353733014e000de1404d5554414e5435363038014e000de1404d5554414e5436323336014e000de1404d5554414e5436343238014e000de1404d5554414e5436353035014e000de1404d5554414e5437313334014e000de1404d5554414e5437343339014e000de1404d5554414e5437363830014e000de1404d5554414e543738393001581c5b2fa063c299c443dbbad0a186574abbdcbbc323318cccb8f207e224a1581a5370616365746f6b656e73466f756e646572734e46543130343501581c6194158d24d71eca5cc5601c45de123bf78d02c297e851be2608810aa1444445414414581caf2e27f580f7f08e93190a81f72462f153026d06450924726645891ba144445249501a3b9aca00581cb06b24176f6feed7f6af241f12333b146497a43b13afad1c66699deaa152546865576f726b696e67446561643634373101581cb3ad8b975d24235a43cb2a54d58c717ed9dd11560b4deba2273ffb1da1480014df104b5749431a05f5e100581cb6408f665a71750e622a3f6430f35a1a6d6cde0d0b6c41bc027c0356a14f50726f6a656374426f6f6b776f726d02581cb6a7467ea1deb012808ef4e87b5ff371e85f7142d7b356a40d9b42a0a1581e436f726e75636f70696173205b76696120436861696e506f72742e696f5d1a004c4b40581cb7c783f6304eddbdf8f0dece4715d63cb9f453be89d97c8fba155d57a144524553491a3b9aca00581cbbd0ec94cf9ccc1407b3dbc66bfbbff82ea49718ae4e3dceb817125fa14524574f524b18a8581ccfee97ff8359f07a0a395a72b424bc6e030503390d864b86d4e0ecf8a1464b41495a454e1a000f4240581cd01794c4604f3c0e544c537bb1f4268c0e81f45880c00c09ebe4b4a7a1444d5953541901f4581cdbc31b04d90b37332813cb4cee3e8f79994643d899a5366797e745eea1434655441b00000033ac1e50c0581cffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d8ea1464d5554414e541a0002c7a0"
    ),
};

(useWallet as jest.Mock).mockReturnValue({
  walletApi: mockWalletApi,
});

const MockComponent = () => {
  const { balance, refresh, loading } = useBalance();

  return (
    <div>
      <h1 data-testid="lovelace-balance">{balance.lovelace.toString()}</h1>
      <div>
        {Object.keys(balance.assets).map((policyId) => {
          return (
            <div key={policyId} data-testid="policy-section">
              {Object.keys(balance.assets[policyId]).map((asset) => (
                <div key={`${policyId}-${asset}`} data-testid="asset-section">
                  <span data-testid="asset-name">{asset}</span>
                  <span data-testid="asset-quantity">
                    {balance.assets[policyId][asset].toString()}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <button onClick={refresh}>Refresh</button>
      {loading && <div>Loading...</div>}
    </div>
  );
};

test("useBalance", async () => {
  const { rerender } = render(<MockComponent />);

  expect(screen.getByTestId("lovelace-balance")).toHaveTextContent("0");
  expect(screen.queryByText("Loading...")).toBeInTheDocument();

  await act(async () => {
    rerender(<MockComponent />);
  });

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  expect(screen.getByTestId("lovelace-balance")).toHaveTextContent("245027861");
  expect(screen.queryAllByTestId("policy-section")).toHaveLength(17);
  expect(screen.queryAllByTestId("asset-section")).toHaveLength(50);

  mockWalletApi.getBalance.mockResolvedValue(
    "821A000F4240A1581C0C442180DD6163682D8E03B271CAEFB4944A24412BDD07ADAFB04CCBA14A50494E41434F4C4144411909C4"
  );

  await userEvent.click(screen.getByRole("button"));

  await act(async () => {
    rerender(<MockComponent />);
  });

  expect(screen.queryAllByTestId("policy-section")).toHaveLength(1);
  expect(screen.queryAllByTestId("asset-section")).toHaveLength(1);
  expect(screen.getByTestId("lovelace-balance")).toHaveTextContent("1000000");
});
