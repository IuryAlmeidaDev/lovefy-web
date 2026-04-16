import { getDaysSince, musicOptions, type Surprise } from "@lovefy/shared";
import { Badge } from "@/components/ui/badge";

type LovePagePreviewProps = {
  surprise: Surprise;
  published?: boolean;
};

export function LovePagePreview({ surprise, published = false }: LovePagePreviewProps) {
  const recipient = surprise.recipientName || "meu amor";
  const sender = surprise.senderName || "alguem especial";
  const title = surprise.title || "Nossa historia em um lugar so";
  const mainPhoto = surprise.photos[0]?.previewUrl;
  const days = getDaysSince(surprise.specialDate);
  const music = musicOptions.find((option) => option.id === surprise.musicId) ?? musicOptions[0];

  return (
    <article className="mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-white shadow-xl">
      <div className="lovefy-surface px-6 py-8 text-center">
        <Badge className="mb-4 rounded-md bg-white/80 text-foreground shadow-sm" variant="secondary">
          Dia dos Namorados
        </Badge>
        <p className="text-sm text-muted-foreground">Para {recipient}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-6 overflow-hidden rounded-md border bg-white">
          {mainPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainPhoto} alt={`Foto principal de ${recipient}`} className="h-64 w-full object-cover" />
          ) : (
            <div className="grid h-64 place-items-center px-8 text-center text-sm text-muted-foreground">
              Sua foto principal aparece aqui assim que voce escolher as imagens.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-7 px-6 py-8">
        {published ? (
          <button className="h-11 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
            Abrir surpresa
          </button>
        ) : null}

        <p className="whitespace-pre-wrap text-base leading-8 text-foreground">
          {surprise.message || "Escreva uma mensagem ou gere uma sugestao para ver a homenagem ganhar forma."}
        </p>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md bg-accent px-4 py-3">
            <p className="text-2xl font-semibold">{days}</p>
            <p className="text-xs text-muted-foreground">dias juntos</p>
          </div>
          <div className="rounded-md bg-secondary px-4 py-3">
            <p className="text-sm font-medium">{music.title}</p>
            <p className="text-xs text-muted-foreground">musica escolhida</p>
          </div>
        </div>

        {surprise.photos.length > 1 ? (
          <div className="grid grid-cols-3 gap-2">
            {surprise.photos.slice(1, 7).map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.previewUrl}
                alt={photo.name}
                className="aspect-square rounded-md object-cover"
              />
            ))}
          </div>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">Com amor, {sender}</p>
      </div>
    </article>
  );
}
