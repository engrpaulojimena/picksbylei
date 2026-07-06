import { db } from "@/lib/db";
import { products, categories } from "@/lib/schema";
import { eq, and, ilike, or, desc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from "react";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { searchParams: { category?: string; search?: string; featured?: string; hot?: string } };

export default async function ProductsPage({ searchParams }: Props) {
  const { category, search, featured, hot } = searchParams;

  const cats = await db.query.categories.findMany();

  let catId: number | undefined;
  if (category) {
    const cat = cats.find((c) => c.slug === category);
    catId = cat?.id;
  }

  const conditions = [];
  if (catId) conditions.push(eq(products.categoryId, catId));
  if (search) conditions.push(or(ilike(products.name, `%${search}%`), ilike(products.description, `%${search}%`))!);
  if (featured === "true") conditions.push(eq(products.isFeatured, true));
  if (hot === "true") conditions.push(eq(products.isHot, true));

  const items = await db.query.products.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: { category: true },
    orderBy: [desc(products.createdAt)],
  });

  const pageTitle = hot === "true" ? "🔥 Trending Now"
    : featured === "true" ? "⭐ Featured Picks"
    : category ? (cats.find(c => c.slug === category)?.name ?? "Products")
    : "All Products";

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>
          {pageTitle}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
          {items.length} products found
        </p>
      </div>

      {/* Search bar */}
      <form method="get" style={{ marginBottom: "24px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "12px", padding: "12px 16px",
          maxWidth: "480px",
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search products..."
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "var(--text-primary)", fontSize: "15px", width: "100%",
            }}
          />
        </div>
      </form>

      {/* Category filters */}
      <div style={{ marginBottom: "32px" }}>
        <Suspense fallback={null}>
          <CategoryFilter categories={cats} active={category} />
        </Suspense>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          color: "var(--text-secondary)", fontSize: "16px",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p>No products found. Try a different search or category!</p>
        </div>
      ) : (
        <div className="product-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "14px",
        }}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
