import { type Surprise } from "@lovefy/shared";
import { LovePagePreview } from "@/components/love-page-preview";

type LoveLetterPreviewPanelProps = {
  surprise: Surprise;
};

export function LoveLetterPreviewPanel({ surprise }: LoveLetterPreviewPanelProps) {
  return <LovePagePreview surprise={surprise} />;
}
