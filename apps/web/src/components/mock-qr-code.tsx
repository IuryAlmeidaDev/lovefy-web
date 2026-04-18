import { cn } from "@/lib/utils";

type MockQrCodeProps = {
  cells?: boolean[];
  className?: string;
};

const fallbackCells = Array.from({ length: 81 }, (_, index) => {
  return [
    0, 1, 2, 6, 7, 8, 9, 18, 20, 24, 26, 27, 33, 35, 37, 41, 43, 48, 52, 54, 56,
    60, 62, 63, 70, 72, 78, 79, 80
  ].includes(index);
});

export function MockQrCode({ cells = fallbackCells, className }: MockQrCodeProps) {
  return (
    <div
      aria-label="QR Code mockado"
      className={cn(
        "grid aspect-square w-44 grid-cols-9 gap-1 rounded-md border bg-white p-3 shadow-sm",
        className
      )}
    >
      {cells.map((filled, index) => (
        <span
          key={index}
          className={cn("rounded-[2px]", filled ? "bg-foreground" : "bg-transparent")}
        />
      ))}
    </div>
  );
}
