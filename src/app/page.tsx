import { db } from "@/lib/db";
import { products, categories } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { TrendingUp, Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, hot, cats] = await Promise.all([
    db.query.products.findMany({
      where: eq(products.isFeatured, true),
      with: { category: true },
      orderBy: [desc(products.createdAt)],
      limit: 4,
    }),
    db.query.products.findMany({
      where: eq(products.isHot, true),
      with: { category: true },
      orderBy: [desc(products.createdAt)],
      limit: 4,
    }),
    db.query.categories.findMany(),
  ]);

  return (
    <div>
      <Hero />

      {/* Categories Scroll */}
      <section style={{ padding: "0 16px 48px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "flex", gap: "10px", overflowX: "auto",
          paddingBottom: "4px", scrollbarWidth: "none",
        }}>
          {cats.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="category-pill" style={{
              flexShrink: 0,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "14px 18px", borderRadius: "14px",
              minWidth: "88px", transition: "all 0.2s",
            }}>
              <span style={{ fontSize: "24px" }}>{cat.emoji}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textAlign: "center" }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <Section title="Lei's Featured Picks" icon={<Sparkles size={18} />} href="/products?featured=true" items={featured} />
      )}

      {hot.length > 0 && (
        <Section title="🔥 Trending Now" icon={<TrendingUp size={18} />} href="/products?hot=true" items={hot} />
      )}

      <section style={{ padding: "48px 20px 80px", textAlign: "center" }}>
        <Link href="/products" className="view-all-btn" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "16px 32px", borderRadius: "100px",
          color: "var(--text-primary)", fontWeight: 700, fontSize: "16px",
          transition: "all 0.2s",
        }}>
          View All Lei's Picks <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

function Section({ title, icon, href, items }: {
  title: string; icon: React.ReactNode; href: string;
  items: Awaited<ReturnType<typeof db.query.products.findMany>>;
}) {
  return (
    <section style={{ padding: "0 16px 64px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "20px",
        }}>
          <h2 style={{
            fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {icon} {title}
          </h2>
          <Link href={href} style={{
            fontSize: "13px", color: "var(--accent-red)", fontWeight: 600,
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            See all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="product-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "14px",
        }}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
