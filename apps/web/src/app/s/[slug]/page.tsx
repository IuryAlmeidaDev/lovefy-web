"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, Play } from "lucide-react";
import { type LovePage } from "@lovefy/shared";
import { LovePagePreview } from "@/components/love-page-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadPublishedPage } from "@/lib/lovefy-storage";

export default function PublishedPage() {
  const [page, setPage] = useState<LovePage | null>(null);
  const [opened, setOpened] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(loadPublishedPage());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!page) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Esta pagina e uma simulacao local</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Publique uma surpresa no fluxo do prototipo para ver os dados preenchidos aqui.
            </p>
            <Button asChild className="w-full rounded-md">
              <Link href="/criar">Criar surpresa</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!opened) {
    return (
      <main className="lovefy-surface grid min-h-screen place-items-center px-5 text-center">
        <section className="max-w-md">
          <p className="text-sm text-muted-foreground">Uma surpresa para</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight">{page.recipientName || "meu amor"}</h1>
          <Button onClick={() => setOpened(true)} size="lg" className="mt-8 rounded-md">
            <Play className="size-4" />
            Abrir surpresa
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="lovefy-surface min-h-screen px-5 py-8">
      <div className="mx-auto max-w-md space-y-5">
        <LovePagePreview surprise={page} published />
        <Button
          variant="outline"
          className="w-full rounded-md bg-white/80"
          onClick={() => setMusicStarted(true)}
        >
          <Music className="size-4" />
          {musicStarted ? "Musica de fundo tocando no prototipo" : "Iniciar musica de fundo"}
        </Button>
      </div>
    </main>
  );
}
