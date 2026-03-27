import { renderWithModal } from "../test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "./Header";
import { shopCart } from "../store/GlobalContext";

describe("Header", () => {
  it("shows currency codes with symbols in the selector", () => {
    renderWithModal(
      <shopCart.Provider
        value={{
          cartItems: [],
          currency: "GBP",
          currencyArray: ["GBP", "USD", "EUR", "JPY"],
          setCurrency: vi.fn(),
          isFetchingExchangeRates: false,
        }}
      >
        <Header cartButtonRef={{ current: null }} />
      </shopCart.Provider>
    );

    const options = screen.getAllByRole("option").map((option) => option.textContent);

    expect(options).toEqual(["GBP(£)", "USD($)", "EUR(€)", "JPY(¥)"]);
  });
});
