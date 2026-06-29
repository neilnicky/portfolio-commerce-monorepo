import type { Context, Next } from "hono";
import { UnauthorizedError } from "@domain/errors/domain.error";
import type { AppContext } from "./context-injector";

const CF_ACCESS_HEADER = "Cf-Access-Jwt-Assertion";
const CF_CERTS_URL = "https://[your-team].cloudflareaccess.com/cdn-cgi/access/certs";

export async function adminAuth(c: Context<AppContext>, next: Next): Promise<Response | void> {
  const token = c.req.header(CF_ACCESS_HEADER);
  if (!token) throw new UnauthorizedError("Missing Cloudflare Access token");

  const aud = c.env.CF_ACCESS_AUD;
  if (!aud) throw new UnauthorizedError("CF_ACCESS_AUD not configured");

  const isValid = await verifyCfAccessJwt(token, aud as string);
  if (!isValid) throw new UnauthorizedError("Invalid Cloudflare Access token");

  await next();
}

async function verifyCfAccessJwt(token: string, aud: string): Promise<boolean> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) return false;

    const payload = JSON.parse(atob(payloadB64)) as {
      aud: string[];
      exp: number;
      iss: string;
    };

    if (!payload.aud.includes(aud)) return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;

    const certsRes = await fetch(CF_CERTS_URL);
    if (!certsRes.ok) return false;
    const certs = (await certsRes.json()) as { public_cert: { cert: string }[] };

    for (const { cert } of certs.public_cert) {
      const key = await importPublicKey(cert);
      const sigBytes = base64UrlDecode(signatureB64);
      const msgBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
      const valid = await crypto.subtle.verify(
        { name: "RSASSA-PKCS1-v1_5" },
        key,
        sigBytes.buffer as ArrayBuffer,
        msgBytes.buffer as ArrayBuffer,
      );
      if (valid) return true;
    }

    return false;
  } catch {
    return false;
  }
}

function base64UrlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function importPublicKey(pem: string): Promise<CryptoKey> {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "spki",
    der.buffer as ArrayBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
}
