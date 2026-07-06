"use client";
import Image from "next/image";
import { Star, TrendingUp, ShoppingCart } from "lucide-react";
import type { Product, Category } from "@/lib/schema";

type Props = {
  product: Product & { category?: Category | null };
};

function formatPrice(price: string | number) {
  return `₱${Number(price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function getDiscount(price: string, original: string | null) {
  if (!original) return null;
  const pct = Math.round((1 - Number(price) / Number(original)) * 100);
  return pct > 0 ? pct : null;
}

// Guards against bad/legacy data (e.g. someone typed "sd" into the old Image URL field)
// crashing next/image, which requires an absolute URL or a path starting with "/".
function isValidImageSrc(url: string | null | undefined): url is string {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}

export default function ProductCard({ product }: Props) {
  const discount = getDiscount(String(product.price), product.originalPrice ? String(product.originalPrice) : null);

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.25s ease",
      cursor: "pointer",
    }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.border = "1px solid rgba(254,44,85,0.35)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(254,44,85,0.1)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.border = "1px solid var(--border)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "var(--bg-card-hover)" }}>
        {isValidImageSrc(product.imageUrl) ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
            onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)", fontSize: "40px",
          }}>
            {product.category?.emoji || "📦"}
          </div>
        )}

        {/* Badges */}
        <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
          {product.isHot && (
            <span style={{
              background: "var(--accent-red)", color: "#fff",
              padding: "3px 7px", borderRadius: "6px", fontSize: "10px", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "3px",
            }}>
              <TrendingUp size={9} /> HOT
            </span>
          )}
          {discount && (
            <span style={{
              background: "rgba(0,0,0,0.75)", color: "var(--accent-cyan)",
              padding: "3px 7px", borderRadius: "6px", fontSize: "10px", fontWeight: 700,
              border: "1px solid rgba(37,244,238,0.3)",
            }}>
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="product-card-content" style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        {product.category && (
          <span style={{ fontSize: "10px", color: "var(--accent-cyan)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
            {product.category.emoji} {product.category.name}
          </span>
        )}

        <h3 className="product-card-name" style={{
          fontSize: "13px", fontWeight: 600, lineHeight: 1.4,
          color: "var(--text-primary)",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ display: "flex", gap: "1px" }}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={11}
                fill={i <= Math.round(Number(product.rating)) ? "#ffd700" : "transparent"}
                color={i <= Math.round(Number(product.rating)) ? "#ffd700" : "var(--text-muted)"}
              />
            ))}
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {product.rating}
          </span>
        </div>

        {product.soldCount && Number(product.soldCount) > 0 && (
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {Number(product.soldCount).toLocaleString()}+ sold
          </span>
        )}

        {/* Price */}
        <div style={{ marginTop: "auto", paddingTop: "6px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
            <span className="product-card-price" style={{ fontSize: "18px", fontWeight: 800, color: "var(--accent-red)" }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="product-card-orig-price" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <a
            href={product.affiliateUrl}
            target="_blank" rel="noopener noreferrer"
            className="product-card-btn"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              width: "100%", marginTop: "8px",
              padding: "9px 10px", borderRadius: "10px",
              background: "var(--accent-red-dim)",
              border: "1px solid rgba(254,44,85,0.25)",
              color: "var(--accent-red)", fontWeight: 700, fontSize: "12px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--accent-red)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--accent-red-dim)";
              e.currentTarget.style.color = "var(--accent-red)";
            }}
            onClick={e => e.stopPropagation()}
          >
            <ShoppingCart size={13} />
            Shop on TikTok
          </a>
        </div>
      </div>
    </div>
  );
}