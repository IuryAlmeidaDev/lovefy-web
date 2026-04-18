"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoveLetterDraft } from "../hooks/use-love-letter-draft";
import { LoveLetterEditorForm } from "./love-letter-editor-form";
import { LoveLetterPreviewPanel } from "./love-letter-preview-panel";

export function CreateLoveLetterScreen() {
  const router = useRouter();
  const {
    surprise,
    canContinue,
    isUploading,
    uploadFeedback,
    setField,
    uploadPhotos,
    removePhoto
  } = useLoveLetterDraft();

  return (
    <main className="lovefy-surface min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <div className="lovefy-panel mb-6 flex flex-col justify-between gap-4 p-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Lovefy Studio</p>
            <h1 className="mt-2 text-4xl font-semibold leading-none tracking-tight">Crie sua surpresa</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Edite os detalhes e veja a pagina romantica mudar em tempo real.
            </p>
          </div>
          <Button
            disabled={!canContinue}
            onClick={() => router.push("/checkout")}
            className="rounded-full px-7"
          >
            Finalizar e pagar R$ 4,99
          </Button>
        </div>

        <Tabs defaultValue="editar" className="lg:hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editar">Editar</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editar" className="mt-5">
            <LoveLetterEditorForm
              surprise={surprise}
              isUploading={isUploading}
              uploadFeedback={uploadFeedback}
              onChange={setField}
              onPhotos={uploadPhotos}
              onRemovePhoto={removePhoto}
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-5">
            <LoveLetterPreviewPanel surprise={surprise} />
          </TabsContent>
        </Tabs>

        <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_460px]">
          <LoveLetterEditorForm
            surprise={surprise}
            isUploading={isUploading}
            uploadFeedback={uploadFeedback}
            onChange={setField}
            onPhotos={uploadPhotos}
            onRemovePhoto={removePhoto}
          />
          <div className="sticky top-6 h-fit">
            <LoveLetterPreviewPanel surprise={surprise} />
          </div>
        </div>
      </div>
    </main>
  );
}
