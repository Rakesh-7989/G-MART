import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CartDrawer from "../CartDrawer";

const mockCartItems = [
  {
    productId: "123e4567-e89b-12d3-a456-426614174000",
    name: "Test Chair",
    price: 12999,
    image: "/chair.jpg",
    quantity: 2,
  },
];

function openCart() {
  fireEvent.click(screen.getByLabelText("Open cart"));
}

function closeCart() {
  const closeBtn = screen.queryByLabelText("Close cart");
  if (closeBtn) fireEvent.click(closeBtn);
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("CartDrawer", () => {
  it("shows empty cart message when no items", () => {
    localStorage.setItem("cart", "[]");
    render(<CartDrawer />);
    openCart();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("renders cart items from localStorage", () => {
    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    render(<CartDrawer />);
    openCart();
    expect(screen.getByText("Test Chair")).toBeInTheDocument();
  });

  it("opens drawer on button click", () => {
    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    render(<CartDrawer />);
    openCart();
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
  });

  it("displays item count badge", () => {
    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    render(<CartDrawer />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays subtotal in summary", () => {
    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    render(<CartDrawer />);
    openCart();
    const prices = screen.getAllByText("₹25,998");
    expect(prices.length).toBe(2);
  });

  it("has checkout link", () => {
    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    render(<CartDrawer />);
    openCart();
    const checkout = screen.getByRole("link", { name: /checkout/i });
    expect(checkout).toBeInTheDocument();
  });

  it("shows secure checkout badge", () => {
    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    render(<CartDrawer />);
    openCart();
    expect(screen.getByText("Secure checkout")).toBeInTheDocument();
  });

  it("updates when localStorage changes via custom event", () => {
    localStorage.setItem("cart", "[]");
    render(<CartDrawer />);
    openCart();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();

    closeCart();
    expect(screen.queryByText("Your cart is empty")).not.toBeInTheDocument();

    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    fireEvent(window, new Event("cartUpdated"));
    openCart();
    expect(screen.getByText("Test Chair")).toBeInTheDocument();
  });

  it("closes drawer on close button click", () => {
    localStorage.setItem("cart", JSON.stringify(mockCartItems));
    render(<CartDrawer />);
    openCart();
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();

    closeCart();
    expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument();
  });
});
