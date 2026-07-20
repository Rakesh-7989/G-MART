import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
    const { fill, className, ...rest } = props;
    return <img src={src} alt={alt} className={className} data-testid="next-image" {...rest} />; // eslint-disable-line @next/next/no-img-element
  },
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

vi.mock("@/components/WishlistButton", () => ({
  default: ({ productId }: { productId: string }) => (
    <button data-testid="wishlist-button" data-product-id={productId}>Wishlist</button>
  ),
}));

vi.mock("@/components/AddToCartButton", () => ({
  default: ({ product }: { product: any }) => (
    <button data-testid="add-to-cart" data-product-id={product.id}>Add to Cart</button>
  ),
}));
