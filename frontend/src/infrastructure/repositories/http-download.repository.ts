import type { ApiClient } from "@infrastructure/api/client";
import type {
  IDownloadRepository,
  RequestFreshLinkInput,
  VerifyFreshLinkInput,
} from "@domain/repositories/download.repository.interface";
import { DownloadToken } from "@domain/entities/download-token.entity";
import type { DownloadTokenDto } from "@application/dtos/download.dto";
import { API_VERSION } from "@config/constants";

function toEntity(d: DownloadTokenDto): DownloadToken {
  return new DownloadToken(d.token, d.order_id, new Date(d.expires_at));
}

export class HttpDownloadRepository implements IDownloadRepository {
  constructor(private readonly api: ApiClient) {}

  async resolve(token: string): Promise<DownloadToken | null> {
    const dto = await this.api.get<DownloadTokenDto | null>(`/${API_VERSION}/download/${token}`);
    return dto ? toEntity(dto) : null;
  }

  async requestFreshLink(input: RequestFreshLinkInput): Promise<void> {
    await this.api.post(`/${API_VERSION}/download/fresh-link/request`, input);
  }

  async verifyFreshLink(input: VerifyFreshLinkInput): Promise<DownloadToken> {
    const dto = await this.api.post<DownloadTokenDto>(
      `/${API_VERSION}/download/fresh-link/verify`,
      input,
    );
    return toEntity(dto);
  }
}
