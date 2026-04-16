import Link from "next/link";
import { ArrowRight, Gift, QrCode, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="lovefy-surface min-h-screen">
      <section className="mx-auto grid min-h-screen max-w-6xl content-center gap-12 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-8">
        <div className="flex flex-col justify-center">
          <Badge className="mb-5 w-fit rounded-md" variant="secondary">
            Dia dos Namorados por R$ 4,99
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Neste Dia dos Namorados, entregue mais do que um presente.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Crie uma pagina com a historia de voces. Adicione fotos, uma mensagem especial e receba um QR Code para colocar no buque.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-md">
              <Link href="/criar">
                Criar minha surpresa
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md bg-white/70">
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm rounded-lg border bg-white p-5 shadow-xl">
            <div className="rounded-md bg-accent px-4 py-3 text-sm font-medium">Uma surpresa simples, bonita e feita para emocionar.</div>
            <div className="mt-5 aspect-[4/5] overflow-hidden rounded-md border bg-[linear-gradient(145deg,oklch(0.98_0.02_352),white_45%,oklch(0.93_0.05_173))] p-5">
              <div className="h-44 rounded-md bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
              <p className="mt-5 text-sm text-muted-foreground">Para quem faz os dias ficarem mais leves.</p>
              <h2 className="mt-2 text-3xl font-semibold">Nossa historia</h2>
              <Separator className="my-5" />
              <p className="text-sm leading-6">A pessoa amada escaneia o QR Code e vive a homenagem no celular.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Monte em poucos minutos",
                text: "Preencha nomes, data especial, mensagem e escolha as fotos."
              },
              {
                icon: Gift,
                title: "Finalize por R$ 4,99",
                text: "O checkout deste prototipo e simulado para validar a experiencia."
              },
              {
                icon: QrCode,
                title: "Presenteie com QR Code",
                text: "A pagina fica ativa por 30 dias e o QR Code acompanha buque, carta ou presente."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-background p-6">
                <item.icon className="size-6 text-primary" />
                <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
