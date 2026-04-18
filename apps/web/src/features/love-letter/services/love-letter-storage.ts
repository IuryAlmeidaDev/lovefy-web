import { type LovePage, type Surprise } from "@lovefy/shared";
import {
  loadDraft,
  loadPublishedPage,
  saveDraft,
  savePublishedPage
} from "@/lib/lovefy-storage";

export function loadDraftData() {
  return loadDraft();
}

export function saveDraftData(surprise: Surprise) {
  saveDraft(surprise);
}

export function loadPublishedLovePageData(): LovePage | null {
  return loadPublishedPage();
}

export function savePublishedLovePageData(page: LovePage) {
  savePublishedPage(page);
}
