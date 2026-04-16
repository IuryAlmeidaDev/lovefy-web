"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { type LovePage } from "@lovefy/shared";
import { MockQrCode } from "@/components/mock-qr-code";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loadPublishedPage } from "@/lib/lovefy-storage";
import { createMockQrCode } from "@/services/mocks/mock-qr-code-service";

export default function SuccessPage() {
  const [page, setPage] = useState<LovePage | null>(null);
  const [cells, setCells] = useState<boolean[]>();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const published = loadPublishedPage();
      setPage(published);

      if (published) {
        createMockQrCode(published.qrCodeValue).then((qrCode) => setCells(qrCode.cells));
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!page) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Nenhuma surpresa publicada ainda</CardTitle>
            <CardDescription>Crie uma homenagem e aprove o checkout simulado para liberar o QR Code.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full rounded-md">
              <Link href="/criar">Criar minha surpresa</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="lovefy-surface min-h-screen px-5 py-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <Badge className="rounded-md" variant="secondary">Pagamento simulado aprovado</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Sua surpresa esta pronta.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Imprima o QR Code e coloque junto com um buque, presente ou carta.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input readOnly value={page.publishedUrl} />
            <Button asChild className="rounded-md">
              <Link href="/s/demo">
                Ver pagina publicada
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>QR Code liberado</CardTitle>
            <CardDescription>Representacao local para validar o fluxo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <MockQrCode cells={cells} />
            <Button
              variant="outline"
              className="w-full rounded-md bg-white/70"
              onClick={() => window.print()}
            >
              <Download className="size-4" />
              Baixar ou imprimir QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
