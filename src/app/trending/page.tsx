import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrendingPage() {
  const items = await db.query.products.findMany({
    where: eq(products.isHot, true),
    with: { category: true },
    orderBy: [desc(products.soldCount)],
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Header with glow */}
      <div style={{
        marginBottom: "48px",
        padding: "40px",
        borderRadius: "24px",
        background: "linear-gradient(135deg, rgba(254,44,85,0.1), rgba(37,244,238,0.05))",
        border: "1px solid rgba(254,44,85,0.2)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "300px", height: "100%",
          background: "radial-gradient(ellipse at right, rgba(254,44,85,0.1) 0%, transparent 70%)",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <TrendingUp size={28} color="var(--accent-red)" />
          <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1px" }}>
            Trending Now
          </h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
          The hottest products right now on TikTok Shop PH. Updated regularly!
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "16px",
      }}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p as any} />
        ))}
      </div>
    </div>
  );
}
