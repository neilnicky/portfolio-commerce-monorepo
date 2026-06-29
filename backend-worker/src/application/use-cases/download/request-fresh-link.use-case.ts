import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { IVerificationCodeRepository } from "@domain/repositories/verification-code.repository.interface";
import type { IEmailService } from "@application/ports/email.port";
import { NotFoundError, ValidationError, QuotaExceededError } from "@domain/errors/domain.error";
import { VerificationCode } from "@domain/entities/verification-code.entity";
import { generateId, generateVerificationCode } from "@utils/id-generator";
import {
  VERIFICATION_CODE_TTL_SECONDS,
  FRESH_LINK_RATE_LIMIT_WINDOW_SECONDS,
  FRESH_LINK_RATE_LIMIT_MAX,
} from "@config/constants";

export class RequestFreshLinkUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(orderId: string, buyerEmail: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order || !order.status.isPaid()) throw new NotFoundError("Order", orderId);

    if (order.buyerEmail !== buyerEmail.toLowerCase().trim()) {
      throw new ValidationError("Email does not match order");
    }

    const windowStart = new Date(Date.now() - FRESH_LINK_RATE_LIMIT_WINDOW_SECONDS * 1000);
    const recentCount = await this.verificationCodeRepository.countRecentByOrderId(
      orderId,
      windowStart,
    );
    if (recentCount >= FRESH_LINK_RATE_LIMIT_MAX) {
      throw new QuotaExceededError("Too many verification code requests");
    }

    const code = generateVerificationCode();
    const verificationCode = VerificationCode.create(
      generateId("code"),
      orderId,
      code,
      VERIFICATION_CODE_TTL_SECONDS,
    );
    await this.verificationCodeRepository.save(verificationCode);
    await this.emailService.sendVerificationCode(buyerEmail, code);
  }
}
