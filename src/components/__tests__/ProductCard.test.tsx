import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "../ProductCard";

const mockProduct = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Test Wooden Chair",
  slug: "test-wooden-chair",
  description: "A comfortable wooden chair",
  price: 12999,
  compare_at_price: 15999,
  images: ["/image1.jpg", "/image2.jpg"],
  category_id: "123e4567-e89b-12d3-a456-426614174001",
  category: { name: "Living Room", slug: "living-room" },
  material: "Wood",
  dimensions: "40x40x80",
  color: "Brown",
  in_stock: true,
  featured: true,
  rating: 4.5,
  review_count: 23,
  sku: "CHR-001",
};

describe("ProductCard", () => {
  it("renders product name as link", () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByText("Test Wooden Chair");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/products/test-wooden-chair");
  });

  it("renders formatted price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("₹12,999")).toBeInTheDocument();
  });

  it("renders compare-at price when present", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("₹15,999")).toBeInTheDocument();
  });

  it("renders sale percentage badge", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("19% OFF")).toBeInTheDocument();
  });

  it("renders rating and review count", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("(23)")).toBeInTheDocument();
  });

  it("renders SKU", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/CHR-001/)).toBeInTheDocument();
  });

  it("renders wishlist and add-to-cart buttons", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByTestId("wishlist-button")).toBeInTheDocument();
    expect(screen.getByTestId("add-to-cart")).toBeInTheDocument();
  });

  it("does not render sale badge when compare_at_price is absent", () => {
    render(<ProductCard product={{ ...mockProduct, compare_at_price: null }} />);
    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
  });

  it("renders product images", () => {
    render(<ProductCard product={mockProduct} />);
    const images = screen.getAllByTestId("next-image");
    expect(images[0]).toHaveAttribute("src", "/image1.jpg");
    expect(images[1]).toHaveAttribute("src", "/image2.jpg");
  });

  it("renders EMI text", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("EMI options available")).toBeInTheDocument();
  });
});
