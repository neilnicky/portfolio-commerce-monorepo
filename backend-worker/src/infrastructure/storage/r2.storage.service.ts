import type { IStorageService, StorageObject } from "@application/ports/storage.port";
import type { Env } from "@config/env";

export class R2StorageService implements IStorageService {
  constructor(private readonly bucket: R2Bucket) {}

  async uploadObject(key: string, data: ReadableStream, contentType: string): Promise<void> {
    await this.bucket.put(key, data, { httpMetadata: { contentType } });
  }

  async getObject(key: string): Promise<StorageObject | null> {
    const obj = await this.bucket.get(key);
    if (!obj) return null;
    return {
      body: obj.body,
      contentType: obj.httpMetadata?.contentType,
      contentLength: obj.size,
    };
  }

  async deleteObject(key: string): Promise<void> {
    await this.bucket.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const obj = await this.bucket.head(key);
    return obj !== null;
  }
}

export function createStorageService(env: Env): IStorageService {
  if (!env.ASSETS_BUCKET) throw new Error("ASSETS_BUCKET binding not configured");
  return new R2StorageService(env.ASSETS_BUCKET);
}
