"use client";

import { type LovePage, type Surprise, emptySurprise } from "@lovefy/shared";

const DRAFT_KEY = "lovefy:draft";
const PAGE_KEY = "lovefy:published";

export function saveDraft(surprise: Surprise) {
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(surprise));
}

export function loadDraft(): Surprise {
  const raw = window.localStorage.getItem(DRAFT_KEY);

  if (!raw) return emptySurprise;

  try {
    return { ...emptySurprise, ...JSON.parse(raw) };
  } catch {
    return emptySurprise;
  }
}

export function savePublishedPage(page: LovePage) {
  window.localStorage.setItem(PAGE_KEY, JSON.stringify(page));
}

export function loadPublishedPage(): LovePage | null {
  const raw = window.localStorage.getItem(PAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as LovePage;
  } catch {
    return null;
  }
}
