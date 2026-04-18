"use client";

import { type ReactNode } from "react";
import {
  generateMessage,
  musicOptions,
  type MessageTone,
  type Photo,
  type Surprise
} from "@lovefy/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type LoveLetterEditorFormProps = {
  surprise: Surprise;
  isUploading: boolean;
  uploadFeedback: string;
  onChange: <Key extends keyof Surprise>(key: Key, value: Surprise[Key]) => void;
  onPhotos: (files: FileList | null) => void;
  onRemovePhoto: (photo: Photo) => void;
};

export function LoveLetterEditorForm({
  surprise,
  isUploading,
  uploadFeedback,
  onChange,
  onPhotos,
  onRemovePhoto
}: LoveLetterEditorFormProps) {
  function generateSuggestedMessage() {
    onChange("message", generateMessage(surprise.tone, surprise));
  }

  return (
    <div className="space-y-5">
      <Card className="lovefy-panel">
        <CardHeader>
          <CardTitle>Dados do casal</CardTitle>
          <CardDescription>Essas informacoes aparecem na homenagem.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome de quem envia">
            <Input
              value={surprise.senderName}
              onChange={(event) => onChange("senderName", event.target.value)}
              placeholder="Ex: Iury"
            />
          </Field>
          <Field label="Nome de quem recebe">
            <Input
              value={surprise.recipientName}
              onChange={(event) => onChange("recipientName", event.target.value)}
              placeholder="Ex: Ana"
            />
          </Field>
          <Field label="Data especial">
            <Input
              type="date"
              value={surprise.specialDate}
              onChange={(event) => onChange("specialDate", event.target.value)}
            />
          </Field>
          <Field label="Titulo da homenagem">
            <Input
              value={surprise.title}
              onChange={(event) => onChange("title", event.target.value)}
              placeholder="Ex: Nosso primeiro Dia dos Namorados"
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="lovefy-panel">
        <CardHeader>
          <CardTitle>Mensagem</CardTitle>
          <CardDescription>Gere uma sugestao mockada e ajuste livremente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Field label="Tom">
              <Select
                value={surprise.tone}
                onValueChange={(value: MessageTone) => onChange("tone", value)}
              >
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
            <Button type="button" onClick={generateSuggestedMessage} className="self-end rounded-full px-6">
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

      <Card className="lovefy-panel">
        <CardHeader>
          <CardTitle>Fotos e musica</CardTitle>
          <CardDescription>
            Em producao, as fotos sao comprimidas, validadas e enviadas por URL assinada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label={isUploading ? "Preparando preview..." : "Adicionar fotos"}>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => onPhotos(event.target.files)}
            />
          </Field>
          {uploadFeedback ? (
            <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              {uploadFeedback}
            </p>
          ) : null}
          {surprise.photos.length ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {surprise.photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onRemovePhoto(photo)}
                  className="group relative overflow-hidden rounded-md border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={photo.name}
                    className="aspect-square w-full object-cover transition group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-foreground/75 px-1 py-1 text-[10px] text-background">
                    remover
                  </span>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
