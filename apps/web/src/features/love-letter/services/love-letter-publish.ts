import { type LovePage, type Surprise } from "@lovefy/shared";
import { createMockQrCode } from "@/services/mocks/mock-qr-code-service";
import { approveMockPayment } from "@/services/mocks/mock-payment-service";
import { publishMockLovePage } from "@/services/mocks/mock-published-page-service";
import {
  loadPublishedLovePageData,
  savePublishedLovePageData
} from "./love-letter-storage";

export async function approveLoveLetterPayment() {
  return approveMockPayment();
}

export async function publishLoveLetterPage(surprise: Surprise): Promise<LovePage> {
  return publishMockLovePage(surprise);
}

export function savePublishedLoveLetter(page: LovePage) {
  savePublishedLovePageData(page);
}

export function loadPublishedLoveLetter() {
  return loadPublishedLovePageData();
}

export async function buildPublishedLoveLetterQr(qrCodeValue: string) {
  return createMockQrCode(qrCodeValue);
}
