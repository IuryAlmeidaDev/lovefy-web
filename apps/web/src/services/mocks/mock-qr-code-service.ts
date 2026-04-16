import { wait } from "./mock-utils";

export async function createMockQrCode(value: string) {
  await wait(400);

  return {
    value,
    label: "QR Code Lovefy",
    cells: Array.from({ length: 81 }, (_, index) => {
      const seed = value.charCodeAt(index % Math.max(value.length, 1)) + index * 17;
      return seed % 3 !== 0;
    })
  };
}
