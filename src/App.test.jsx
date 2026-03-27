import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { renderWithModal } from "./test/test-utils";

const mealsResponse = [
  {
    id: "m1",
    name: "Mac & Cheese",
    price: "8.99",
    description: "Classic comfort food.",
    image: "images/mac-and-cheese.jpg",
  },
  {
    id: "m2",
    name: "Margherita Pizza",
    price: "12.99",
    description: "Fresh mozzarella and basil.",
    image: "images/margherita-pizza.jpg",
  },
];

const exchangeRatesResponse = {
  date: "2026-03-26",
  rates: {
    EUR: 1,
    GBP: 0.8,
    USD: 1.2,
    JPY: 160,
  },
};

describe("App integration", () => {
  it("lets a user add items, complete checkout, and submit an order", async () => {
    const fetchMock = vi.fn((url, options) => {
      if (url === "http://localhost:3000/meals") {
        return Promise.resolve({
          ok: true,
          json: async () => mealsResponse,
        });
      }

      if (url === "http://localhost:3000/exchange-rates") {
        return Promise.resolve({
          ok: true,
          json: async () => exchangeRatesResponse,
        });
      }

      if (url === "http://localhost:3000/orders") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: "Order created!" }),
        });
      }

      return Promise.reject(new Error(`Unhandled fetch request: ${url}`));
    });

    global.fetch = fetchMock;

    renderWithModal(<App />);

    const user = userEvent.setup();

    expect(await screen.findByText("Mac & Cheese")).toBeInTheDocument();

    const addButtons = await screen.findAllByRole("button", { name: "Add to cart" });
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);

    await user.click(screen.getByRole("button", { name: /Cart \(2\)/ }));

    expect(await screen.findByText("Your cart")).toBeInTheDocument();
    expect(screen.getByText(/Mac & Cheese = £8.99 x 1/)).toBeInTheDocument();
    expect(screen.getByText(/Margherita Pizza = £12.99 x 1/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Go to checkout" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Submit Order", hidden: true })
      ).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Full name"), "Taylor Tester");
    await user.type(screen.getByLabelText("E-mail address"), "taylor@example.com");
    await user.type(screen.getByLabelText("Street"), "123 Test Street");
    await user.type(screen.getByLabelText("Postal code"), "AB12 3CD");
    await user.type(screen.getByLabelText("City"), "London");

    await user.click(
      screen.getByRole("button", { name: "Submit Order", hidden: true })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/orders",
        expect.objectContaining({
          method: "POST",
          body: expect.any(String),
        })
      );
    });

    const orderRequest = fetchMock.mock.calls.find(
      ([url]) => url === "http://localhost:3000/orders"
    );
    const submittedPayload = JSON.parse(orderRequest[1].body);

    expect(submittedPayload.order.customer).toEqual({
      name: "Taylor Tester",
      email: "taylor@example.com",
      street: "123 Test Street",
      "postal-code": "AB12 3CD",
      city: "London",
    });
    expect(submittedPayload.order.items).toHaveLength(2);
    expect(submittedPayload.order.total).toBe("£21.98");
    expect(submittedPayload.order.currency).toBe("GBP");

    expect(
      await screen.findByText("Your order has been submitted")
    ).toBeInTheDocument();

    const orderedImages = screen.getAllByAltText(/Mac & Cheese|Margherita Pizza/);
    expect(orderedImages).toHaveLength(2);
  }, 10000);
});
