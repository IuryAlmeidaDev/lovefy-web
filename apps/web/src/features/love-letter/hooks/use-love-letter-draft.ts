"use client";

import { useEffect, useMemo, useState } from "react";
import { type Photo, type Surprise, emptySurprise } from "@lovefy/shared";
import { uploadPhotosSecurely } from "@/lib/uploads/secure-photo-upload";
import { simulatePhotoStorage } from "@/services/mocks/mock-storage-service";
import { loadDraftData, saveDraftData } from "../services/love-letter-storage";

type UseLoveLetterDraftResult = {
  surprise: Surprise;
  isUploading: boolean;
  uploadFeedback: string;
  canContinue: boolean;
  setField: <Key extends keyof Surprise>(key: Key, value: Surprise[Key]) => void;
  uploadPhotos: (files: FileList | null) => Promise<void>;
  removePhoto: (photo: Photo) => void;
};

export function useLoveLetterDraft(): UseLoveLetterDraftResult {
  const [surprise, setSurprise] = useState<Surprise>(emptySurprise);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSurprise(loadDraftData());
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveDraftData(surprise);
  }, [isReady, surprise]);

  useEffect(() => {
    return () => {
      surprise.photos.forEach((photo) => {
        if (photo.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, [surprise.photos]);

  const canContinue = useMemo(() => {
    return (
      surprise.senderName.trim().length > 0 &&
      surprise.recipientName.trim().length > 0 &&
      surprise.message.trim().length > 0
    );
  }, [surprise]);

  function setField<Key extends keyof Surprise>(key: Key, value: Surprise[Key]) {
    setSurprise((current) => ({ ...current, [key]: value }));
  }

  async function uploadPhotos(files: FileList | null) {
    if (!files?.length) return;

    setIsUploading(true);
    setUploadFeedback("Preparando fotos...");

    if (!isSupabaseUploadEnabled()) {
      const photos = await simulatePhotoStorage(Array.from(files));
      setUploadFeedback("Supabase ainda nao configurado. Usando preview local do prototipo.");
      setSurprise((current) => ({
        ...current,
        photos: [...current.photos, ...photos].slice(0, 6)
      }));
      setIsUploading(false);
      return;
    }

    try {
      const photos = await uploadPhotosSecurely(Array.from(files));
      setUploadFeedback("Fotos comprimidas em WebP e enviadas com URL assinada.");
      setSurprise((current) => ({
        ...current,
        photos: [...current.photos, ...photos].slice(0, 6)
      }));
    } catch (error) {
      setUploadFeedback(
        error instanceof Error ? error.message : "Nao foi possivel enviar as fotos."
      );
    } finally {
      setIsUploading(false);
    }
  }

  function removePhoto(photo: Photo) {
    if (photo.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(photo.previewUrl);
    }

    setSurprise((current) => ({
      ...current,
      photos: current.photos.filter((item) => item.id !== photo.id)
    }));
  }

  return {
    surprise,
    isUploading,
    uploadFeedback,
    canContinue,
    setField,
    uploadPhotos,
    removePhoto
  };
}

function isSupabaseUploadEnabled() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
