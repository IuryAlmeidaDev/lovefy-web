"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateMessage, musicOptions, type MessageTone, type Photo, type Surprise, emptySurprise } from "@lovefy/shared";
import { LovePagePreview } from "@/components/love-page-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { loadDraft, saveDraft } from "@/lib/lovefy-storage";
import { simulatePhotoStorage } from "@/services/mocks/mock-storage-service";

export default function CreatePage() {
  const router = useRouter();
  const [surprise, setSurprise] = useState<Surprise>(emptySurprise);
  const [isUploading, setIsUploading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSurprise(loadDraft());
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveDraft(surprise);
  }, [isReady, surprise]);

  useEffect(() => {
    return () => {
      surprise.photos.forEach((photo) => {
        if (photo.previewUrl.startsWith("blob:")) URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, [surprise.photos]);

  const canContinue = useMemo(() => {
    return surprise.senderName.trim() && surprise.recipientName.trim() && surprise.message.trim();
  }, [surprise]);

  function updateField<Key extends keyof Surprise>(key: Key, value: Surprise[Key]) {
    setSurprise((current) => ({ ...current, [key]: value }));
  }

  async function handlePhotos(files: FileList | null) {
    if (!files?.length) return;

    setIsUploading(true);
    const photos = await simulatePhotoStorage(Array.from(files));
    setSurprise((current) => ({ ...current, photos: [...current.photos, ...photos].slice(0, 6) }));
    setIsUploading(false);
  }

  function removePhoto(photo: Photo) {
    if (photo.previewUrl.startsWith("blob:")) URL.revokeObjectURL(photo.previewUrl);
    setSurprise((current) => ({
      ...current,
      photos: current.photos.filter((item) => item.id !== photo.id)
    }));
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Lovefy</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Crie sua surpresa</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Edite os detalhes e veja a pagina romantica mudar em tempo real.
            </p>
          </div>
          <Button disabled={!canContinue} onClick={() => router.push("/checkout")} className="rounded-md">
            Finalizar e pagar R$ 4,99
          </Button>
        </div>

        <Tabs defaultValue="editar" className="lg:hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editar">Editar</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editar" className="mt-5">
            <Editor surprise={surprise} isUploading={isUploading} onChange={updateField} onPhotos={handlePhotos} onRemovePhoto={removePhoto} />
          </TabsContent>
          <TabsContent value="preview" className="mt-5">
            <LovePagePreview surprise={surprise} />
          </TabsContent>
        </Tabs>

        <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_460px]">
          <Editor surprise={surprise} isUploading={isUploading} onChange={updateField} onPhotos={handlePhotos} onRemovePhoto={removePhoto} />
          <div className="sticky top-6 h-fit">
            <LovePagePreview surprise={surprise} />
          </div>
        </div>
      </div>
    </main>
  );
}

type EditorProps = {
  surprise: Surprise;
  isUploading: boolean;
  onChange: <Key extends keyof Surprise>(key: Key, value: Surprise[Key]) => void;
  onPhotos: (files: FileList | null) => void;
  onRemovePhoto: (photo: Photo) => void;
};

function Editor({ surprise, isUploading, onChange, onPhotos, onRemovePhoto }: EditorProps) {
  function generate() {
    onChange("message", generateMessage(surprise.tone, surprise));
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Dados do casal</CardTitle>
          <CardDescription>Essas informacoes aparecem na homenagem.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome de quem envia">
            <Input value={surprise.senderName} onChange={(event) => onChange("senderName", event.target.value)} placeholder="Ex: Iury" />
          </Field>
          <Field label="Nome de quem recebe">
            <Input value={surprise.recipientName} onChange={(event) => onChange("recipientName", event.target.value)} placeholder="Ex: Ana" />
          </Field>
          <Field label="Data especial">
            <Input type="date" value={surprise.specialDate} onChange={(event) => onChange("specialDate", event.target.value)} />
          </Field>
          <Field label="Titulo da homenagem">
            <Input value={surprise.title} onChange={(event) => onChange("title", event.target.value)} placeholder="Ex: Nosso primeiro Dia dos Namorados" />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mensagem</CardTitle>
          <CardDescription>Gere uma sugestao mockada e ajuste livremente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Field label="Tom">
              <Select value={surprise.tone} onValueChange={(value: MessageTone) => onChange("tone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romantico">Romantico</SelectItem>
                  <SelectItem value="fofo">Fofo</SelectItem>
                  <SelectItem value="emocionante">Emocionante</SelectItem>
                  <SelectItem value="divertido">Divertido</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Button type="button" onClick={generate} className="self-end rounded-md">
              Gerar mensagem
            </Button>
          </div>
          <Field label="Mensagem editavel">
            <Textarea
              value={surprise.message}
              onChange={(event) => onChange("message", event.target.value)}
              placeholder="Escreva aqui a homenagem..."
              className="min-h-40"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fotos e musica</CardTitle>
          <CardDescription>As fotos ficam somente no navegador durante este prototipo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label={isUploading ? "Preparando preview..." : "Adicionar fotos"}>
            <Input type="file" accept="image/*" multiple onChange={(event) => onPhotos(event.target.files)} />
          </Field>
          {surprise.photos.length ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {surprise.photos.map((photo) => (
                <button key={photo.id} type="button" onClick={() => onRemovePhoto(photo)} className="group relative overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.previewUrl} alt={photo.name} className="aspect-square w-full object-cover transition group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-foreground/75 px-1 py-1 text-[10px] text-background">remover</span>
                </button>
              ))}
            </div>
          ) : null}
          <Field label="Musica de fundo">
            <Select value={surprise.musicId} onValueChange={(value) => onChange("musicId", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {musicOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
