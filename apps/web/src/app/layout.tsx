import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Manrope } from "next/font/google";
import { GlobalHeader } from "@/components/global/global-header";
import { ThemeProvider } from "@/features/theme/theme-provider";
import "./globals.css";

const themeInitializerScript = `(function(){var k="lovefy-theme";var d="dark";try{var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:d;document.documentElement.classList.toggle("dark",t==="dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Cormorant_Garamond({
  variable: "--font-display",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const codeFont = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lovefy | Surpresas digitais para o Dia dos Namorados",
  description:
    "Crie uma pagina romantica com fotos, mensagem, musica e QR Code para presentear no Dia dos Namorados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${headingFont.variable} ${codeFont.variable} dark`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider defaultTheme="dark" storageKey="lovefy-theme">
          <GlobalHeader />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
