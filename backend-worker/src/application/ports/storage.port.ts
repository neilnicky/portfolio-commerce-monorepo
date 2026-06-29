export interface StorageObject {
  body: ReadableStream;
  contentType: string | undefined;
  contentLength: number | undefined;
}

export interface IStorageService {
  uploadObject(key: string, data: ReadableStream, contentType: string): Promise<void>;
  getObject(key: string): Promise<StorageObject | null>;
  deleteObject(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
