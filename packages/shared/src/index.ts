export type MessageTone = "romantico" | "fofo" | "emocionante" | "divertido";

export type MockPaymentStatus = "idle" | "processing" | "approved";

export type Photo = {
  id: string;
  name: string;
  previewUrl: string;
};

export type MusicOption = {
  id: string;
  title: string;
  description: string;
};

export type Surprise = {
  senderName: string;
  recipientName: string;
  specialDate: string;
  title: string;
  tone: MessageTone;
  message: string;
  photos: Photo[];
  musicId: string;
};

export type LovePage = Surprise & {
  publishedUrl: string;
  qrCodeValue: string;
  expiresAt: string;
};

export const musicOptions: MusicOption[] = [
  {
    id: "piano",
    title: "Piano suave",
    description: "Uma trilha calma para abrir a surpresa com carinho."
  },
  {
    id: "acustico",
    title: "Violao acustico",
    description: "Leve, proxima e com clima de carta escrita a mao."
  },
  {
    id: "classico",
    title: "Tema classico",
    description: "Elegante e emocional, sem exageros."
  }
];

export const emptySurprise: Surprise = {
  senderName: "",
  recipientName: "",
  specialDate: "",
  title: "",
  tone: "romantico",
  message: "",
  photos: [],
  musicId: "piano"
};

export function generateMessage(
  tone: MessageTone,
  data: Pick<Surprise, "senderName" | "recipientName" | "specialDate" | "title">
) {
  const sender = data.senderName || "alguem que te ama";
  const recipient = data.recipientName || "meu amor";
  const title = data.title ? ` "${data.title}"` : "";
  const date = data.specialDate
    ? ` Desde ${formatDate(data.specialDate)},`
    : "";

  const templates: Record<MessageTone, () => string> = {
    romantico: () =>
      `${recipient}, esta homenagem${title} existe porque amar voce mudou o meu jeito de ver os dias.${date} eu guardo cada detalhe nosso como quem guarda luz. Com amor, ${sender}.`,
    fofo: () =>
      `${recipient}, fiz esse cantinho para lembrar que a nossa historia mora nas pequenas coisas: risadas, planos, abracos e saudade boa.${date} tudo ficou mais bonito com voce. Com carinho, ${sender}.`,
    emocionante: () =>
      `${recipient}, algumas pessoas chegam e viram casa. Voce virou meu lugar favorito.${date} eu escolheria viver tudo de novo, inclusive os detalhes simples que so a gente entende. Com todo meu amor, ${sender}.`,
    divertido: () =>
      `${recipient}, oficialmente declaro esta surpresa${title} como prova de que eu sou meio bobo por voce.${date} meu plano segue sendo te fazer sorrir hoje, amanha e depois. Assinado: ${sender}.`
  };

  return templates[tone]();
}

export function formatDate(value: string) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function getDaysSince(value: string, now = new Date()) {
  if (!value) return 0;

  const start = new Date(`${value}T00:00:00`);

  if (Number.isNaN(start.getTime())) {
    return 0;
  }

  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.max(0, Math.floor((nowUtc - startUtc) / 86_400_000));
}

export function buildPublishedPageUrl(slug: string, baseUrl = "https://lovefy.local") {
  return `${baseUrl.replace(/\/$/, "")}/s/${slug}`;
}

export function createSlug(surprise: Pick<Surprise, "senderName" | "recipientName">) {
  const raw = `${surprise.senderName || "amor"}-${surprise.recipientName || "surpresa"}`;

  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
