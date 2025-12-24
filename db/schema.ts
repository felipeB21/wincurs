import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

export const userTierEnum = pgEnum("user_tier", ["free", "premium"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "trialing",
  "incomplete",
  "incomplete_expired",
  "unpaid",
]);

export const cursorFileTypeEnum = pgEnum("cursor_file_type", [
  "cur",
  "zip",
  "rar",
]);
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  tier: userTierEnum("tier").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").notNull().unique(),
  displayUsername: text("display_username"),
});

export const cursor = pgTable(
  "cursor",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    previewImage: text("preview_image").notNull(),
    fileUrl: text("file_url").notNull(),
    fileType: cursorFileTypeEnum("file_type").notNull(),
    fileSize: text("file_size"),
    checksum: text("checksum"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("cursor_userId_idx").on(table.userId),
    index("cursor_name_idx").on(table.name),
  ]
);

export const cursorLike = pgTable(
  "cursor_like",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cursorId: text("cursor_id")
      .notNull()
      .references(() => cursor.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("cursor_like_user_cursor_unique").on(table.userId, table.cursorId),
    index("cursor_like_userId_idx").on(table.userId),
    index("cursor_like_cursorId_idx").on(table.cursorId),
  ]
);

export const cursorComment = pgTable(
  "cursor_comment",
  {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cursorId: text("cursor_id")
      .notNull()
      .references(() => cursor.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("cursor_comment_userId_idx").on(table.userId),
    index("cursor_comment_cursorId_idx").on(table.cursorId),
  ]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const cursorDownload = pgTable(
  "cursor_download",
  {
    id: text("id").primaryKey(),
    cursorId: text("cursor_id")
      .notNull()
      .references(() => cursor.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("cursor_download_cursorId_idx").on(table.cursorId),
    index("cursor_download_userId_idx").on(table.userId),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  cursors: many(cursor),
}));

export const cursorRelations = relations(cursor, ({ one }) => ({
  user: one(user, {
    fields: [cursor.userId],
    references: [user.id],
  }),
}));

export const cursorCommentRelations = relations(cursorComment, ({ one }) => ({
  user: one(user, {
    fields: [cursorComment.userId],
    references: [user.id],
  }),
  cursor: one(cursor, {
    fields: [cursorComment.cursorId],
    references: [cursor.id],
  }),
}));

export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),

    subscriptionId: text("subscription_id").notNull().unique(),
    customerId: text("customer_id").notNull(),
    productId: text("product_id").notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    status: subscriptionStatusEnum("status").notNull(),

    currentPeriodEnd: timestamp("current_period_end"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("subscription_userId_idx").on(table.userId),
    index("subscription_status_idx").on(table.status),
  ]
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}));
