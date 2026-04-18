import type { AnchorHTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LovefyLandingScreen } from "./lovefy-landing-screen";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toHaveAttribute(attribute: string, value?: string): T;
  }

  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): void;
    toHaveAttribute(attribute: string, value?: string): void;
  }
}

expect.extend({
  toBeInTheDocument(received: unknown) {
    const element = received as Element | null;
    const pass = !!element && element.ownerDocument?.body.contains(element);

    return {
      pass,
      message: () =>
        pass
          ? "Expected element not to be in the document"
          : "Expected element to be in the document"
    };
  },

  toHaveAttribute(received: unknown, attribute: string, value?: string) {
    const element = received as Element | null;
    const hasElement = !!element;
    const hasAttribute = hasElement && element.hasAttribute(attribute);
    const attributeValue = hasAttribute ? element.getAttribute(attribute) : null;
    const pass = value === undefined ? hasAttribute : hasAttribute && attributeValue === value;

    return {
      pass,
      message: () => {
        if (!hasElement) {
          return "Expected a DOM element but received null or undefined";
        }

        if (!hasAttribute) {
          return `Expected element to have attribute \"${attribute}\"`;
        }

        return value === undefined
          ? `Expected element not to have attribute \"${attribute}\"`
          : `Expected attribute \"${attribute}\" to be \"${value}\", received \"${attributeValue}\"`;
      }
    };
  }
});

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

describe("lovefy landing screen", () => {
  it("exibe CTA principal apontando para /criar", () => {
    render(<LovefyLandingScreen />);

    const ctaPrincipal = screen.getByRole("link", { name: /criar minha surpresa/i });

    expect(ctaPrincipal).toBeInTheDocument();
    expect(ctaPrincipal).toHaveAttribute("href", "/criar");
  });

  it("mostra secao de resultados com 3 estilos e CTAs por estilo", () => {
    render(<LovefyLandingScreen />);

    const headingResultados = screen.getByRole("heading", { name: /resultados prontos para emocionar/i });
    expect(headingResultados).toBeInTheDocument();

    const estilos = [
      {
        nome: /romantico classico/i,
        ariaLabel: /quero esse estilo: romantico classico/i,
        href: "/criar?estilo=romantico-classico"
      },
      {
        nome: /divertido e leve/i,
        ariaLabel: /quero esse estilo: divertido e leve/i,
        href: "/criar?estilo=divertido-e-leve"
      },
      {
        nome: /poetico e profundo/i,
        ariaLabel: /quero esse estilo: poetico e profundo/i,
        href: "/criar?estilo=poetico-e-profundo"
      }
    ];

    const cardsEstilo = screen.getAllByRole("article");
    expect(cardsEstilo).toHaveLength(3);

    const linksEstilo = screen.getAllByRole("link", { name: /quero esse estilo:/i });
    expect(linksEstilo).toHaveLength(3);

    for (const estilo of estilos) {
      const headingEstilo = screen.getByRole("heading", { name: estilo.nome });
      expect(headingEstilo).toBeInTheDocument();

      const ctaEstilo = screen.getByRole("link", { name: estilo.ariaLabel });
      expect(ctaEstilo).toBeInTheDocument();
      expect(ctaEstilo).toHaveAttribute("href", estilo.href);
    }
  });

  it("marca preview visual do hero como decorativo", () => {
    const { container } = render(<LovefyLandingScreen />);

    const previewDecorativo = container.querySelector("[data-testid='hero-preview-visual']");

    expect(previewDecorativo).toBeInTheDocument();
    expect(previewDecorativo).toHaveAttribute("aria-hidden", "true");
  });
});
