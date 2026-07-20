import { describe, it, expect } from "vitest";
import { formatPrice, cn, slugify } from "./utils";

describe("formatPrice", () => {
  it("formats integer price in INR", () => {
    expect(formatPrice(84999)).toBe("₹84,999");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("₹0");
  });

  it("formats small price", () => {
    expect(formatPrice(99)).toBe("₹99");
  });

  it("formats large price with commas", () => {
    expect(formatPrice(1250000)).toBe("₹12,50,000");
  });

  it("handles negative price", () => {
    expect(formatPrice(-500)).toBe("-₹500");
  });
});

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar");
  });

  it("returns empty string for no classes", () => {
    expect(cn()).toBe("");
  });

  it("returns empty string when all falsy", () => {
    expect(cn(false, undefined, null)).toBe("");
  });

  it("handles single class", () => {
    expect(cn("foo")).toBe("foo");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Living Room")).toBe("living-room");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("replaces multiple spaces with single hyphen", () => {
    expect(slugify("a   b")).toBe("a-b");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles single word", () => {
    expect(slugify("hello")).toBe("hello");
  });
});
