import { wait } from "./mock-utils";

export async function approveMockPayment() {
  await wait(900);

  return {
    status: "approved" as const,
    paidAt: new Date().toISOString(),
    amount: 4.99
  };
}
