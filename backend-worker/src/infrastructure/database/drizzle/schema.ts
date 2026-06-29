import { pgTable, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    priceAmount: integer("price_amount").notNull(),
    priceCurrency: text("price_currency").notNull().default("INR"),
    fileKey: text("file_key").notNull(),
    isPublished: boolean("is_published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (t) => [index("products_sort_order_idx").on(t.sortOrder)],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    buyerEmail: text("buyer_email").notNull(),
    priceAmount: integer("price_amount").notNull(),
    priceCurrency: text("price_currency").notNull().default("INR"),
    razorpayOrderId: text("razorpay_order_id").notNull().unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (t) => [
    index("orders_buyer_email_idx").on(t.buyerEmail),
    index("orders_status_idx").on(t.status),
  ],
);

export const downloadTokens = pgTable(
  "download_tokens",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    downloadCount: integer("download_count").notNull().default(0),
    maxDownloads: integer("max_downloads").notNull().default(5),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  },
  (t) => [index("download_tokens_token_idx").on(t.token)],
);

export const verificationCodes = pgTable(
  "verification_codes",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    used: boolean("used").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  },
  (t) => [index("verification_codes_order_idx").on(t.orderId)],
);
