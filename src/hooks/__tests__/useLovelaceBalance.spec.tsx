import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";

import { useLovelaceBalance } from "../useLovelaceBalance";
import { useWallet } from "../useWallet";

jest.mock("../useWallet");

const mockWalletApi = {
  getBalance: jest
    .fn()
    .mockResolvedValue(
      "821A000F4240A1581C0C442180DD6163682D8E03B271CAEFB4944A24412BDD07ADAFB04CCBA14A50494E41434F4C4144411909C4"
    ),
};

(useWallet as jest.Mock).mockReturnValue({
  walletApi: mockWalletApi,
});

const MockComponent = () => {
  const { balance, refresh, loading } = useLovelaceBalance();

  return (
    <div>
      <h1 data-testid="lovelace-balance">{balance.toString()}</h1>
      <button onClick={refresh}>Refresh</button>
      {loading && <div>Loading...</div>}
    </div>
  );
};

test("useLovelaceBalance", async () => {
  const { rerender } = render(<MockComponent />);

  expect(screen.getByTestId("lovelace-balance")).toHaveTextContent("0");
  expect(screen.queryByText("Loading...")).toBeInTheDocument();

  await act(async () => {
    rerender(<MockComponent />);
  });

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  expect(screen.getByTestId("lovelace-balance")).toHaveTextContent("1000000");

  mockWalletApi.getBalance.mockResolvedValue(
    "821A001E8480A1581C0C442180DD6163682D8E03B271CAEFB4944A24412BDD07ADAFB04CCBA14A50494E41434F4C4144411909C4"
  );

  await userEvent.click(screen.getByRole("button"));

  await act(async () => {
    rerender(<MockComponent />);
  });

  expect(screen.getByTestId("lovelace-balance")).toHaveTextContent("2000000");
});
