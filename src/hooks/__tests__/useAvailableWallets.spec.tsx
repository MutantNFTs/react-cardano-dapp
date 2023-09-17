import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import { useAvailableWallets } from "../useAvailableWallets";

const MockComponent = () => {
  const wallets = useAvailableWallets();

  return (
    <div>
      {wallets.map((wallet) => (
        <h1 key={wallet.id}>{wallet.name}</h1>
      ))}
    </div>
  );
};

test("useAvailableWallets", async () => {
  window.cardano = {
    nami: {
      name: "nami",
      icon: "icon",
      enable: jest.fn(),
    },
    eternl: {
      name: "eternl",
      icon: "icon",
      enable: jest.fn(),
    },
    somethingThatIsNotAWallet: {
      name: "not a wallet",
      icon: "icon",
    },
  };

  render(<MockComponent />);

  expect(screen.getByText("nami")).toBeInTheDocument();
  expect(screen.getByText("eternl")).toBeInTheDocument();
  expect(screen.queryByText("not a wallet")).not.toBeInTheDocument();
});
