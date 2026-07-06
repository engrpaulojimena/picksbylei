"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Package, Check, Link as LinkIcon, Loader, LogOut, X,
  Tag, Trash2, FolderPlus, Pencil, List, Search, Star, TrendingUp,
  ChevronDown, ChevronUp, Save,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type Category = { id: number; name: string; slug: string; emoji: string | null };
type Product = {
  id: number; name: string; description: string | null;
  price: string; originalPrice: string | null;
  imageUrl: string | null; affiliateUrl: string;
  tiktokShopUrl: string | null; categoryId: number | null;
  rating: string; reviewCount: number; soldCount: number;
  isFeatured: boolean; isHot: boolean;
  category?: Category | null;
};

const EMPTY_FORM = {
  name: "", description: "", price: "",
  originalPrice: "", imageUrl: "", affiliateUrl: "",
  tiktokShopUrl: "", categoryId: "", rating: "5",
  reviewCount: "0", soldCount: "0",
  isFeatured: false, isHot: false,
};

const EMPTY_CAT = { name: "", slug: "", emoji: "" };

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatPrice(p: string | number) {
  return `₱${Number(p).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"product" | "manage" | "categories">("product");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  // ── Add Product form ──
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [fetchMsg, setFetchMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Manage Products ──
  const [prodSearch, setProdSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<typeof EMPTY_FORM & { id: number }>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingProdId, setDeletingProdId] = useState<number | null>(null);
  const [prodLoading, setProdLoading] = useState(false);

  // ── Category form ──
  const [catForm, setCatForm] = useState(EMPTY_CAT);
  const [catLoading, setCatLoading] = useState(false);
  const [catSuccess, setCatSuccess] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);

  const loadCategories = useCallback(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories);
  }, []);

  const loadProducts = useCallback(() => {
    setProdLoading(true);
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); })
      .finally(() => setProdLoading(false));
  }, []);

  // ── Client-side auth guard (double protection on top of middleware) ──
  useEffect(() => {
    fetch("/api/auth/check")
      .then(r => {
        if (!r.ok) router.replace("/admin/login");
        else setAuthChecked(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    loadCategories();
    loadProducts(); // always pre-load so count is ready
  }, [authChecked, loadCategories, loadProducts]);

  useEffect(() => {
    if (tab === "manage") loadProducts();
  }, [tab, loadProducts]);

  const handleTiktokUrl = (url: string) => {
    setTiktokUrl(url);
    setFetchMsg(null);
    if (url) {
      setForm(p => ({ ...p, affiliateUrl: url, tiktokShopUrl: url }));
      setFetchMsg({ type: "ok", text: "TikTok link saved ✓" });
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.affiliateUrl) {
      alert("Please fill in the required fields: Name, Price, and TikTok Link");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        originalPrice: form.originalPrice || null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        reviewCount: Number(form.reviewCount),
        soldCount: Number(form.soldCount),
      }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm(EMPTY_FORM);
      setTiktokUrl("");
      setFetchMsg(null);
      loadProducts(); // refresh count in tab label + manage list
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert("Something went wrong. Please try again!");
    }
  };

  // ── Edit product ──
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      originalPrice: p.originalPrice || "",
      imageUrl: p.imageUrl || "",
      affiliateUrl: p.affiliateUrl,
      categoryId: p.categoryId ? String(p.categoryId) : "",
      rating: p.rating,
      reviewCount: String(p.reviewCount),
      soldCount: String(p.soldCount),
      isFeatured: p.isFeatured,
      isHot: p.isHot,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: number) => {
    setSavingId(id);
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        ...editForm,
        originalPrice: editForm.originalPrice || null,
        categoryId: editForm.categoryId ? Number(editForm.categoryId) : null,
        reviewCount: Number(editForm.reviewCount),
        soldCount: Number(editForm.soldCount),
      }),
    });
    setSavingId(null);
    if (res.ok) {
      setEditingId(null);
      setEditForm({});
      loadProducts();
    } else {
      alert("Something went wrong while saving. Please try again!");
    }
  };

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? Hindi ito ma-undo.`)) return;
    setDeletingProdId(id);
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeletingProdId(null);
    loadProducts();
  };

  // ── Categories ──
  const handleAddCategory = async () => {
    if (!catForm.name || !catForm.slug) { setCatError("Name and Slug are required"); return; }
    setCatLoading(true); setCatError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catForm),
    });
    setCatLoading(false);
    if (res.ok) {
      setCatSuccess(true); setCatForm(EMPTY_CAT); loadCategories();
      setTimeout(() => setCatSuccess(false), 3000);
    } else {
      const data = await res.json();
      setCatError(data.error || "Something went wrong. Please try again!");
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setDeletingCatId(id);
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeletingCatId(null);
    loadCategories();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "var(--input-bg)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text-primary)",
    fontSize: "14px", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "11px", color: "var(--text-secondary)",
    marginBottom: "6px", display: "block", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.5px",
  };
  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card)", padding: "24px",
    borderRadius: "20px", border: "1px solid var(--border)",
  };

  // Don't render anything until auth is confirmed
  if (!authChecked) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader size={28} style={{ animation: "spin 1s linear infinite", color: "var(--accent-red)" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px 80px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px" }}>
            Lei<span style={{ color: "var(--accent-red)" }}>'s Admin</span>
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Manage products and categories
          </p>
        </div>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 14px", borderRadius: "10px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          color: "var(--text-secondary)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
        }}>
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "6px", marginBottom: "24px",
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "5px",
      }}>
        {([
          { key: "product", label: "Add Product", icon: <Plus size={14} /> },
          { key: "manage",  label: `Products${products.length ? ` (${products.length})` : ""}`, icon: <List size={14} /> },
          { key: "categories", label: "Categories", icon: <Tag size={14} /> },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "10px 10px", borderRadius: "10px", border: "none",
            background: tab === t.key ? "var(--accent-red)" : "transparent",
            color: tab === t.key ? "#fff" : "var(--text-secondary)",
            fontWeight: 700, fontSize: "13px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════ TAB: ADD PRODUCT ═══════════ */}
      {tab === "product" && (
        <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* TikTok link */}
          <div style={{
            padding: "18px", borderRadius: "14px",
            background: "rgba(254,44,85,0.06)", border: "1px solid rgba(254,44,85,0.2)",
          }}>
            <label style={{ ...labelStyle, color: "var(--accent-red)" }}>🔗 TikTok Product Link *</label>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "10px" }}>
              Paste the product link from TikTok Shop
            </p>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingLeft: "40px", border: "1px solid rgba(254,44,85,0.3)" }}
                value={tiktokUrl}
                onChange={e => handleTiktokUrl(e.target.value)}
                placeholder="https://www.tiktok.com/shop/product/..."
              />
              <LinkIcon size={15} color="var(--accent-red)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              {tiktokUrl && (
                <button onClick={() => { setTiktokUrl(""); setFetchMsg(null); setForm(p => ({ ...p, affiliateUrl: "", tiktokShopUrl: "" })); }}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                  <X size={15} />
                </button>
              )}
            </div>
            {fetchMsg && <p style={{ fontSize: "12px", marginTop: "8px", color: fetchMsg.type === "ok" ? "#22c55e" : "var(--accent-red)" }}>{fetchMsg.text}</p>}
          </div>

          <Divider label="PRODUCT DETAILS" />

          <div>
            <label style={labelStyle}>Product Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Cosrx Snail Mucin Essence 96ml" />
          </div>

          <div>
            <label style={labelStyle}>Description / Review</label>
            <textarea style={{ ...inputStyle, minHeight: "76px", resize: "vertical" } as any}
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Write your honest review here..." />
          </div>

          <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Sale Price (₱) *</label>
              <input style={inputStyle} type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="299.00" />
            </div>
            <div>
              <label style={labelStyle}>Original Price (₱)</label>
              <input style={inputStyle} type="number" step="0.01" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} placeholder="499.00" />
            </div>
          </div>

          <ImageUpload
            value={form.imageUrl}
            onChange={url => setForm(p => ({ ...p, imageUrl: url }))}
            inputStyle={inputStyle}
            labelStyle={labelStyle}
          />

          <div>
            <label style={labelStyle}>Category</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}>
              <option value="">— Select a category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>

          <div className="admin-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Rating (1–5)</label>
              <input style={inputStyle} type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Reviews</label>
              <input style={inputStyle} type="number" value={form.reviewCount} onChange={e => setForm(p => ({ ...p, reviewCount: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Sold</label>
              <input style={inputStyle} type="number" value={form.soldCount} onChange={e => setForm(p => ({ ...p, soldCount: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[{ key: "isFeatured", label: "⭐ Featured" }, { key: "isHot", label: "🔥 Hot / Trending" }].map(({ key, label }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                <input type="checkbox" checked={(form as any)[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                  style={{ accentColor: "var(--accent-red)", width: "16px", height: "16px" }} />
                {label}
              </label>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            padding: "14px", borderRadius: "12px",
            background: success ? "#22c55e" : "var(--accent-red)",
            color: "#fff", fontWeight: 700, fontSize: "15px",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "all 0.2s", opacity: loading ? 0.7 : 1,
          }}>
            {success ? <><Check size={18} /> Product Added!</> : loading ? <><Loader size={18} /> Adding...</> : <><Plus size={18} /> Add Product</>}
          </button>
        </div>
      )}

      {/* ═══════════ TAB: MANAGE PRODUCTS ═══════════ */}
      {tab === "manage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "10px 16px",
          }}>
            <Search size={15} color="var(--text-secondary)" />
            <input
              value={prodSearch}
              onChange={e => setProdSearch(e.target.value)}
              placeholder="Search products..."
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px", width: "100%" }}
            />
            {prodSearch && <button onClick={() => setProdSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><X size={14} /></button>}
          </div>

          {prodLoading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--text-secondary)" }}>
              <Loader size={24} style={{ margin: "0 auto 12px", display: "block" }} />
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
              <p>{prodSearch ? "No products found." : "No products yet."}</p>
            </div>
          ) : (
            filteredProducts.map(p => (
              <ProductRow
                key={p.id}
                product={p}
                categories={categories}
                isEditing={editingId === p.id}
                editForm={editForm}
                setEditForm={setEditForm}
                isSaving={savingId === p.id}
                isDeleting={deletingProdId === p.id}
                onEdit={() => startEdit(p)}
                onCancelEdit={cancelEdit}
                onSave={() => saveEdit(p.id)}
                onDelete={() => deleteProduct(p.id, p.name)}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
              />
            ))
          )}
        </div>
      )}

      {/* ═══════════ TAB: CATEGORIES ═══════════ */}
      {tab === "categories" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <FolderPlus size={18} color="var(--accent-red)" />
              <h2 style={{ fontWeight: 800, fontSize: "17px" }}>Add New Category</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Emoji</label>
                  <input style={{ ...inputStyle, textAlign: "center", fontSize: "22px", padding: "8px" }}
                    value={catForm.emoji} onChange={e => setCatForm(p => ({ ...p, emoji: e.target.value }))}
                    placeholder="🛍️" maxLength={2} />
                </div>
                <div>
                  <label style={labelStyle}>Category Name *</label>
                  <input style={inputStyle} value={catForm.name}
                    onChange={e => { const n = e.target.value; setCatForm(p => ({ ...p, name: n, slug: toSlug(n) })); }}
                    placeholder="e.g. Beauty & Skincare" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Slug (URL) *</label>
                <input style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px" }}
                  value={catForm.slug} onChange={e => setCatForm(p => ({ ...p, slug: toSlug(e.target.value) }))}
                  placeholder="beauty-skincare" />
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Auto-generated from name.</p>
              </div>
              {catError && <p style={{ fontSize: "13px", color: "var(--accent-red)", fontWeight: 600 }}>⚠️ {catError}</p>}
              <button onClick={handleAddCategory} disabled={catLoading} style={{
                padding: "13px", borderRadius: "12px",
                background: catSuccess ? "#22c55e" : "var(--accent-red)",
                color: "#fff", fontWeight: 700, fontSize: "14px",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s",
              }}>
                {catSuccess ? <><Check size={16} /> Category Added!</> : catLoading ? <><Loader size={16} /> Adding...</> : <><Plus size={16} /> Add Category</>}
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontWeight: 800, fontSize: "17px", marginBottom: "16px" }}>
              Existing Categories{" "}
              <span style={{ fontSize: "12px", fontWeight: 600, background: "var(--accent-red-dim)", color: "var(--accent-red)", padding: "2px 8px", borderRadius: "100px" }}>{categories.length}</span>
            </h2>
            {categories.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>No categories yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: "12px",
                    background: "var(--bg-primary)", border: "1px solid var(--border)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "22px" }}>{cat.emoji || "📦"}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "14px" }}>{cat.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>/{cat.slug}</div>
                      </div>
                    </div>
                    <button onClick={() => deleteCategory(cat.id)} disabled={deletingCatId === cat.id}
                      style={{ width: "32px", height: "32px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { const b = e.currentTarget; b.style.background = "rgba(254,44,85,0.1)"; b.style.borderColor = "rgba(254,44,85,0.4)"; b.style.color = "var(--accent-red)"; }}
                      onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.borderColor = "var(--border)"; b.style.color = "var(--text-muted)"; }}>
                      {deletingCatId === cat.id ? <Loader size={13} /> : <Trash2 size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Divider helper ──
function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
    </div>
  );
}

// ── Product row ──
type RowProps = {
  product: Product;
  categories: Category[];
  isEditing: boolean;
  editForm: any;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  isSaving: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
};

function ProductRow({ product: p, categories, isEditing, editForm, setEditForm, isSaving, isDeleting, onEdit, onCancelEdit, onSave, onDelete, inputStyle, labelStyle }: RowProps) {
  const set = (field: string, val: any) => setEditForm((prev: any) => ({ ...prev, [field]: val }));

  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${isEditing ? "rgba(254,44,85,0.4)" : "var(--border)"}`,
      borderRadius: "16px", overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Collapsed row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px" }}>
        {/* Thumbnail */}
        <div style={{
          width: "48px", height: "48px", borderRadius: "10px", flexShrink: 0,
          background: "var(--bg-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", fontSize: "22px",
        }}>
          {p.imageUrl
            ? <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : p.category?.emoji || "📦"}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.name}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "3px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "var(--accent-red)", fontWeight: 700 }}>
              ₱{Number(p.price).toLocaleString()}
            </span>
            {p.category && (
              <span style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--bg-primary)", padding: "2px 8px", borderRadius: "100px", border: "1px solid var(--border)" }}>
                {p.category.emoji} {p.category.name}
              </span>
            )}
            {p.isHot && <span style={{ fontSize: "10px", background: "var(--accent-red)", color: "#fff", padding: "2px 6px", borderRadius: "6px", fontWeight: 700 }}>🔥 HOT</span>}
            {p.isFeatured && <span style={{ fontSize: "10px", background: "rgba(255,215,0,0.15)", color: "#f5c400", border: "1px solid rgba(255,215,0,0.3)", padding: "2px 6px", borderRadius: "6px", fontWeight: 700 }}>⭐ FEATURED</span>}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {isEditing ? (
            <>
              <button onClick={onCancelEdit} style={{ width: "34px", height: "34px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} />
              </button>
              <button onClick={onSave} disabled={isSaving} style={{ height: "34px", padding: "0 12px", borderRadius: "8px", background: "var(--accent-red)", border: "none", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                {isSaving ? <Loader size={13} /> : <Save size={13} />} Save
              </button>
            </>
          ) : (
            <>
              <button onClick={onEdit}
                style={{ width: "34px", height: "34px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = "var(--accent-cyan)"; b.style.color = "var(--accent-cyan)"; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = "var(--border)"; b.style.color = "var(--text-secondary)"; }}
                title="Edit">
                <Pencil size={13} />
              </button>
              <button onClick={onDelete} disabled={isDeleting}
                style={{ width: "34px", height: "34px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = "rgba(254,44,85,0.1)"; b.style.borderColor = "rgba(254,44,85,0.4)"; b.style.color = "var(--accent-red)"; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.borderColor = "var(--border)"; b.style.color = "var(--text-muted)"; }}
                title="Delete">
                {isDeleting ? <Loader size={13} /> : <Trash2 size={13} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded edit form */}
      {isEditing && (
        <div style={{
          borderTop: "1px solid rgba(254,44,85,0.2)",
          padding: "20px 16px",
          background: "rgba(254,44,85,0.03)",
          display: "flex", flexDirection: "column", gap: "14px",
        }}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input style={inputStyle} value={editForm.name || ""} onChange={e => set("name", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Description / Review</label>
            <textarea style={{ ...inputStyle, minHeight: "72px", resize: "vertical" } as any} value={editForm.description || ""} onChange={e => set("description", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Sale Price (₱) *</label>
              <input style={inputStyle} type="number" step="0.01" value={editForm.price || ""} onChange={e => set("price", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Original Price (₱)</label>
              <input style={inputStyle} type="number" step="0.01" value={editForm.originalPrice || ""} onChange={e => set("originalPrice", e.target.value)} />
            </div>
          </div>
          <ImageUpload
            value={editForm.imageUrl || ""}
            onChange={url => set("imageUrl", url)}
            inputStyle={inputStyle}
            labelStyle={labelStyle}
          />
          <div>
            <label style={labelStyle}>Affiliate / TikTok Link *</label>
            <input style={inputStyle} value={editForm.affiliateUrl || ""} onChange={e => set("affiliateUrl", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={editForm.categoryId || ""} onChange={e => set("categoryId", e.target.value)}>
              <option value="">— No category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Rating</label>
              <input style={inputStyle} type="number" step="0.1" min="1" max="5" value={editForm.rating || ""} onChange={e => set("rating", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Reviews</label>
              <input style={inputStyle} type="number" value={editForm.reviewCount || ""} onChange={e => set("reviewCount", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Sold</label>
              <input style={inputStyle} type="number" value={editForm.soldCount || ""} onChange={e => set("soldCount", e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {[{ key: "isFeatured", label: "⭐ Featured" }, { key: "isHot", label: "🔥 Hot" }].map(({ key, label }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                <input type="checkbox" checked={editForm[key] || false} onChange={e => set(key, e.target.checked)}
                  style={{ accentColor: "var(--accent-red)", width: "16px", height: "16px" }} />
                {label}
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onCancelEdit} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={onSave} disabled={isSaving} style={{ flex: 2, padding: "12px", borderRadius: "10px", background: "var(--accent-red)", border: "none", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
              {isSaving ? <><Loader size={15} /> Saving...</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
