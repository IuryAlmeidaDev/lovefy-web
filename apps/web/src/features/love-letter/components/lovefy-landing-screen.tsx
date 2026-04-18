import Link from "next/link";
import { ArrowRight, Heart, MessageCircleHeart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { brand } from "@/shared/constants/brand";

const styleCards = [
  {
    icon: Heart,
    title: "Romantico classico",
    summary: "Tom elegante, mensagem calorosa e atmosfera de filme para declarar amor sem erro.",
    preview: "Amor da minha vida, cada detalhe nosso vira lembranca favorita.",
    slug: "romantico-classico"
  },
  {
    icon: MessageCircleHeart,
    title: "Divertido e leve",
    summary: "Linguagem espontanea, toque de humor e carinho para quem ama rir junto.",
    preview: "Voce e meu caos favorito, meu porto seguro e meu meme preferido.",
    slug: "divertido-e-leve"
  },
  {
    icon: Sparkles,
    title: "Poetico e profundo",
    summary: "Texto sensivel, ritmo emocional e frases marcantes para surpreender de verdade.",
    preview: "Entre todas as estacoes, eu escolho repetir o comeco ao seu lado.",
    slug: "poetico-e-profundo"
  }
];

export function LovefyLandingScreen() {
  return (
    <main className="lovefy-surface min-h-screen">
      <section className="mx-auto grid min-h-screen max-w-6xl content-center gap-12 px-5 py-14 md:grid-cols-[1.06fr_0.94fr] md:px-8">
        <div className="flex flex-col justify-center">
          <Badge className="mb-5 w-fit rounded-full px-3 py-1" variant="secondary">
            {brand.campaignLabel} por {brand.priceLabel}
          </Badge>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.94] text-balance sm:text-7xl">
            Entregue uma declaracao pronta para emocionar em minutos.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Escolha um estilo, personalize com a historia de voces e receba uma pagina inesquecivel com
            QR Code para colocar no buque, cartao ou presente.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/criar">
                Criar minha surpresa
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-card/70 px-7 hover:bg-card/90">
              <Link href="#resultados-prontos">Ver exemplos prontos</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="lovefy-panel px-4 py-3">
              <p className="font-semibold text-foreground">3 estilos validados</p>
              <p className="mt-1 text-xs">Textos prontos para adaptar em segundos</p>
            </div>
            <div className="lovefy-panel px-4 py-3">
              <p className="font-semibold text-foreground">+1.000 declaracoes</p>
              <p className="mt-1 text-xs">Estruturas ja usadas para surpreender</p>
            </div>
            <div className="lovefy-panel px-4 py-3">
              <p className="font-semibold text-foreground">Pronto no mesmo dia</p>
              <p className="mt-1 text-xs">Link e QR Code liberados apos finalizar</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="lovefy-panel w-full max-w-sm p-5 sm:p-6">
            <div className="rounded-xl bg-accent/70 px-4 py-3 text-sm font-medium">
              Resultado final no celular em poucos cliques.
            </div>
            <div className="mt-5 aspect-[4/5] overflow-hidden rounded-xl border bg-[linear-gradient(145deg,oklch(0.99_0.012_66),white_45%,oklch(0.95_0.02_28))] p-5">
              <div
                aria-hidden="true"
                data-testid="hero-preview-visual"
                className="h-44 rounded-xl bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center"
              />
              <p className="mt-5 text-sm text-muted-foreground">Carta digital com fotos, mensagem e trilha emocional.</p>
              <h2 className="mt-2 text-4xl font-semibold">Para o nosso para sempre</h2>
              <Separator className="my-5" />
              <p className="text-sm leading-6">Escaneou o QR Code, abriu a pagina e sentiu tudo que voce queria dizer.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="resultados-prontos" className="bg-background/55 px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Exemplos para escolher agora</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
            Resultados prontos para emocionar
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Comece pelo estilo que combina com voces e ajuste em minutos. O CTA de cada card ja abre o
            criador com a proposta selecionada.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {styleCards.map((item) => (
              <article key={item.slug} className="lovefy-panel p-6">
                <item.icon className="size-6 text-primary" />
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                <p className="mt-4 rounded-lg bg-card/75 px-4 py-3 text-sm leading-6">&quot;{item.preview}&quot;</p>
                <Button asChild variant="outline" className="mt-6 w-full rounded-full bg-card/80 hover:bg-card">
                  <Link href={`/criar?estilo=${item.slug}`} aria-label={`Quero esse estilo: ${item.title}`}>
                    Quero esse estilo
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8">
        <div className="lovefy-panel mx-auto max-w-6xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Prova de valor</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Quem usa o Lovefy sai com uma declaracao bonita, clara e pronta para entregar.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Sem tela em branco, sem travar na mensagem: voce escolhe o estilo, personaliza detalhes e
            recebe uma surpresa com cara de feita sob medida.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/criar">
                Comecar agora
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
