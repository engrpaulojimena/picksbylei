"use client";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/schema";

type Props = { categories: Category[]; active?: string };

export default function CategoryFilter({ categories, active }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setCategory = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.push(`/products?${params.toString()}`);
  };

  const allActive = !active;

  return (
    <div style={{
      display: "flex", gap: "8px",
      overflowX: "auto", paddingBottom: "4px",
      scrollbarWidth: "none",
    }}>
      <button
        onClick={() => setCategory()}
        style={{
          padding: "8px 18px", borderRadius: "100px", flexShrink: 0,
          border: "1px solid",
          borderColor: allActive ? "var(--accent-red)" : "var(--border)",
          background: allActive ? "var(--accent-red-dim)" : "transparent",
          color: allActive ? "var(--accent-red)" : "var(--text-secondary)",
          fontWeight: allActive ? 700 : 500,
          fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
        }}
      >
        All
      </button>
      {categories.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            style={{
              padding: "8px 18px", borderRadius: "100px", flexShrink: 0,
              border: "1px solid",
              borderColor: isActive ? "var(--accent-red)" : "var(--border)",
              background: isActive ? "var(--accent-red-dim)" : "transparent",
              color: isActive ? "var(--accent-red)" : "var(--text-secondary)",
              fontWeight: isActive ? 700 : 500,
              fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {cat.emoji} {cat.name}
          </button>
        );
      })}
    </div>
  );
}
