const PREFIXES = {
  product: "prod",
  order: "ord",
  token: "tok",
  code: "code",
} as const;

type PrefixKey = keyof typeof PREFIXES;

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateId(type: PrefixKey): string {
  return `${PREFIXES[type]}_${randomHex(12)}`;
}

export function generateSecureToken(): string {
  return randomHex(32);
}

export function generateVerificationCode(): string {
  const arr = new Uint8Array(3);
  crypto.getRandomValues(arr);
  const num = (arr[0] * 65536 + arr[1] * 256 + arr[2]) % 1000000;
  return num.toString().padStart(6, "0");
}
