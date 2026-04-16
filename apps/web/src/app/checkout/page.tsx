"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, type Surprise, emptySurprise } from "@lovefy/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadDraft, savePublishedPage } from "@/lib/lovefy-storage";
import { approveMockPayment } from "@/services/mocks/mock-payment-service";
import { publishMockLovePage } from "@/services/mocks/mock-published-page-service";

export default function CheckoutPage() {
  const router = useRouter();
  const [surprise, setSurprise] = useState<Surprise>(emptySurprise);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSurprise(loadDraft());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function approvePayment() {
    setIsPaying(true);
    await approveMockPayment();
    const page = await publishMockLovePage(surprise);
    savePublishedPage(page);
    router.push("/sucesso");
  }

  return (
    <main className="lovefy-surface min-h-screen px-5 py-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px]">
        <section>
          <Badge className="rounded-md" variant="secondary">Checkout simulado</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Finalize sua pagina Lovefy</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Nenhum pagamento real sera feito neste prototipo. Use o botao de aprovacao para liberar o link e o QR Code.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Pagina Lovefy de Dia dos Namorados</CardTitle>
            <CardDescription>Valida por 30 dias apos a publicacao.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted-foreground">Valor</span>
              <strong className="text-3xl">R$ 4,99</strong>
            </div>
            <Separator />
            <div className="space-y-3 text-sm">
              <Row label="De" value={surprise.senderName || "Nao informado"} />
              <Row label="Para" value={surprise.recipientName || "Nao informado"} />
              <Row label="Data especial" value={formatDate(surprise.specialDate) || "Opcional"} />
              <Row label="Fotos" value={`${surprise.photos.length} selecionada(s)`} />
            </div>
            <Button onClick={approvePayment} disabled={isPaying} className="w-full rounded-md" size="lg">
              {isPaying ? "Aprovando..." : "Simular pagamento aprovado"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
