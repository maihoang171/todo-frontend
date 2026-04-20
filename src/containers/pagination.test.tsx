/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Pagination } from "./pagination";

const { mockState } = vi.hoisted(() => ({
  mockState: { totalPages: 10 },
}));

vi.mock("../stores/useTaskStore.ts", () => ({
  useTaskStore: (selector: (state: typeof mockState) => unknown) =>
    selector(mockState),
}));

describe("Pagination component", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display the current page number correctly", () => {
    render(<Pagination page={3} setPage={vi.fn()} />);

    const pageText = screen.getByText("Page 3");

    expect(pageText).toBeInTheDocument();
  });

  it("should call setPage with page + 1 when 'Next' is clicked", async () => {
    const mockSetPage = vi.fn();
    const user = userEvent.setup();

    render(<Pagination page={2} setPage={mockSetPage} />);
    const nextButton = screen.getByRole("button", { name: "»" });

    await user.click(nextButton);

    expect(mockSetPage).toHaveBeenCalledWith(3);
  });

  it("should call setPage page - 1 when 'Prev' is clicked", async () => {
    const mockSetPage = vi.fn();
    render(<Pagination page={3} setPage={mockSetPage} />);

    const user = userEvent.setup();
    const prevButton = screen.getByRole("button", { name: "«" });

    await user.click(prevButton);

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("should not call setPage if page is less than or equal 1", async () => {
    const mockSetPage = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={0} setPage={mockSetPage} />);

    const prevButton = screen.getByRole("button", { name: "«" });

    await user.click(prevButton);
    expect(mockSetPage).not.toHaveBeenCalled();
  });

  it("should disable the Prev button when on page 1", () => {
    const mockSetPage = vi.fn();
    render(<Pagination page={1} setPage={mockSetPage} />);

    const prevButton = screen.getByRole("button", { name: "«" });
    expect(prevButton).toBeDisabled();
  });

  it("should not call setPage if page is larger or equal totalPages", async () => {
    const mockSetPage = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination page={mockState.totalPages + 1} setPage={mockSetPage} />,
    );
    const nextButton = screen.getByRole("button", { name: "»" });

    await user.click(nextButton);
    expect(mockSetPage).not.toHaveBeenCalled();
  });

  it("should disable the Prev button when on the last page", () => {
    const mockSetPage = vi.fn();
    render(<Pagination page={mockState.totalPages} setPage={mockSetPage} />);

    const nextButton = screen.getByRole("button", { name: "»" });
    expect(nextButton).toBeDisabled();
  });
});
