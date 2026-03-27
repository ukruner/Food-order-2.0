import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CartContextProvider, { shopCart } from "./GlobalContext";

function Consumer() {
  const { formatPrice, setCurrency } = useContext(shopCart);

  return (
    <div>
      <p data-testid="gbp-price">{formatPrice(10, "GBP")}</p>
      <p data-testid="eur-price">{formatPrice(10, "EUR")}</p>
      <button onClick={() => setCurrency("USD")}>Switch</button>
      <p data-testid="current-price">{formatPrice(10)}</p>
    </div>
  );
}

describe("CartContextProvider", () => {
  it("converts GBP base prices into the selected currency using fetched ECB rates", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        date: "2026-03-26",
        rates: {
          EUR: 1,
          GBP: 0.8,
          USD: 1.2,
          JPY: 160,
        },
      }),
    });

    render(
      <CartContextProvider>
        <Consumer />
      </CartContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("eur-price")).toHaveTextContent("€12,50");
    });

    expect(screen.getByTestId("gbp-price")).toHaveTextContent("£10.00");

    screen.getByRole("button", { name: "Switch" }).click();

    await waitFor(() => {
      expect(screen.getByTestId("current-price")).toHaveTextContent("$15.00");
    });
  });
});
