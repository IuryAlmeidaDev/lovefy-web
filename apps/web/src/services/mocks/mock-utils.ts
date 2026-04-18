export function wait(ms = 650) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
