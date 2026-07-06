import { pgTable, serial, text, integer, decimal, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  emoji: varchar("emoji", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  affiliateUrl: text("affiliate_url").notNull(),
  tiktokShopUrl: text("tiktok_shop_url"),
  categoryId: integer("category_id").references(() => categories.id),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  soldCount: integer("sold_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  isHot: boolean("is_hot").default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ← Relations definition
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;