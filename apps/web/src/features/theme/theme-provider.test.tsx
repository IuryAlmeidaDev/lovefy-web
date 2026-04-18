import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

function ThemeProbe() {
  const { theme } = useTheme();

  return <span>{theme}</span>;
}

describe("theme provider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("inicia em dark por padrao", () => {
    localStorage.removeItem("lovefy-theme");
    document.documentElement.classList.remove("dark");

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByText("dark")).toBeTruthy();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("lovefy-theme")).toBe("dark");
  });

  it("usa valor salvo no localStorage sem mismatch inicial", async () => {
    localStorage.setItem("lovefy-theme", "light");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    document.documentElement.classList.remove("dark");

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("light")).toBeTruthy();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    expect(setItemSpy).toHaveBeenCalledWith("lovefy-theme", "light");
    expect(setItemSpy).not.toHaveBeenCalledWith("lovefy-theme", "dark");
  });

  it("toggle alterna e persiste", async () => {
    const user = userEvent.setup();
    localStorage.removeItem("lovefy-theme");
    document.documentElement.classList.remove("dark");

    render(
      <ThemeProvider>
        <ThemeProbe />
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggle = screen.getByRole("button", { name: /escuro/i });

    await user.click(toggle);

    expect(screen.getByText("light")).toBeTruthy();
    expect(localStorage.getItem("lovefy-theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(screen.getByRole("button", { name: /claro/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /claro/i }).getAttribute("aria-pressed")).toBe("true");
  });

  it("useTheme lanca erro fora do provider", () => {
    expect(() => render(<ThemeProbe />)).toThrowError(/ThemeProvider/);
  });

  it("fallback seguro quando leitura do localStorage falha", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByText("dark")).toBeTruthy();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("fallback seguro quando escrita no localStorage falha", async () => {
    const user = userEvent.setup();

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    render(
      <ThemeProvider>
        <ThemeProbe />
        <ThemeToggle />
      </ThemeProvider>
    );

    await user.click(screen.getByRole("button", { name: /escuro/i }));

    expect(screen.getByText("light")).toBeTruthy();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
