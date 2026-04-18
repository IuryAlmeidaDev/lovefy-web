import Link from "next/link";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function GlobalHeader() {
  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4" aria-label="Navegacao principal">
          <Link href="/" className="text-lg font-semibold tracking-tight font-heading">
            Lovefy
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href="/criar">Criar minha pagina</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
