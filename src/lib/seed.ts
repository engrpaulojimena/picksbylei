import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // Insert categories
  const cats = await db
    .insert(schema.categories)
    .values([
      { name: "Beauty & Skincare", slug: "beauty", emoji: "✨" },
      { name: "Fashion", slug: "fashion", emoji: "👗" },
      { name: "Tech & Gadgets", slug: "tech", emoji: "📱" },
      { name: "Home & Living", slug: "home", emoji: "🏠" },
      { name: "Health & Wellness", slug: "health", emoji: "💪" },
      { name: "Food & Snacks", slug: "food", emoji: "🍜" },
    ])
    .returning();

  // Insert sample products
  await db.insert(schema.products).values([
    {
      name: "Bubble Cleanser Viral TikTok",
      description: "The viral facial cleanser you see all over TikTok's For You Page. Deep cleanse without drying.",
      price: "299.00",
      originalPrice: "499.00",
      imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
      affiliateUrl: "https://www.tiktok.com/shop",
      categoryId: cats[0].id,
      rating: "4.8",
      reviewCount: 12400,
      soldCount: 45000,
      isFeatured: true,
      isHot: true,
      tags: ["skincare", "viral", "cleanser"],
    },
    {
      name: "Glow Serum 30ml",
      description: "Vitamin C serum na pinagkakaabalahan ng buong TikTok. Makikita mo agad ang resulta sa loob ng 7 araw.",
      price: "450.00",
      originalPrice: "750.00",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      affiliateUrl: "https://www.tiktok.com/shop",
      categoryId: cats[0].id,
      rating: "4.9",
      reviewCount: 8900,
      soldCount: 30000,
      isFeatured: true,
      isHot: false,
      tags: ["serum", "vitamin-c", "glow"],
    },
    {
      name: "Cargo Pants Y2K Style",
      description: "Super trendy cargo pants that are all the rage right now. Perfect for any OOTD content.",
      price: "699.00",
      originalPrice: "999.00",
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4b5f05?w=400",
      affiliateUrl: "https://www.tiktok.com/shop",
      categoryId: cats[1].id,
      rating: "4.7",
      reviewCount: 3200,
      soldCount: 12000,
      isFeatured: false,
      isHot: true,
      tags: ["fashion", "y2k", "cargo"],
    },
    {
      name: "Mini Portable Fan USB-C",
      description: "Such an adorable mini fan. Perfect for summer and for content creators.",
      price: "199.00",
      originalPrice: "350.00",
      imageUrl: "https://images.unsplash.com/photo-1611186871525-9a9f3d74d9d4?w=400",
      affiliateUrl: "https://www.tiktok.com/shop",
      categoryId: cats[2].id,
      rating: "4.6",
      reviewCount: 5600,
      soldCount: 22000,
      isFeatured: false,
      isHot: false,
      tags: ["gadget", "summer", "fan"],
    },
    {
      name: "Aesthetic LED Desk Lamp",
      description: "Perfect for your work from home setup. Looks amazing on video calls and content creation.",
      price: "850.00",
      originalPrice: "1200.00",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
      affiliateUrl: "https://www.tiktok.com/shop",
      categoryId: cats[3].id,
      rating: "4.8",
      reviewCount: 2100,
      soldCount: 8500,
      isFeatured: true,
      isHot: false,
      tags: ["home", "aesthetic", "led"],
    },
    {
      name: "Collagen Drink Pack (7 sachets)",
      description: "The most popular collagen drink on TikTok Shop PH. For healthier, glowing skin.",
      price: "380.00",
      originalPrice: "550.00",
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
      affiliateUrl: "https://www.tiktok.com/shop",
      categoryId: cats[4].id,
      rating: "4.7",
      reviewCount: 9800,
      soldCount: 35000,
      isFeatured: false,
      isHot: true,
      tags: ["health", "collagen", "wellness"],
    },
  ]);

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
