"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, TrendingUp, Sun, Moon, ShieldCheck, Store } from "lucide-react";

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [mobileSearchVal, setMobileSearchVal] = useState("");

  const runSearch = (q: string) => {
    const query = q.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lei-theme");
    const dark = saved !== "light";
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const theme = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lei-theme", theme);
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--nav-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        height: "64px",
        display: "flex", alignItems: "center",
        transition: "background 0.3s ease",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto", width: "100%",
          padding: "0 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}>
          {/* Logo — Lei branding */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, var(--accent-red), var(--accent-cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShoppingBag size={18} color="#fff" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px" }}>
                Lei<span style={{ color: "var(--accent-red)" }}>'s Picks</span>
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.3px" }}>
                TikTok Affiliate
              </span>
            </div>
          </Link>

          {/* Search bar — desktop only */}
          <div className="nav-search" style={{
            flex: 1, maxWidth: "440px", display: "flex", alignItems: "center",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "100px", padding: "8px 16px", gap: "8px",
          }}>
            <Search size={15} color="var(--text-secondary)" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runSearch(searchVal)}
              placeholder="Search products..."
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "var(--text-primary)", fontSize: "14px", width: "100%",
              }}
            />
          </div>

          {/* Desktop nav links */}
          <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Link href="/trending" style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "8px 12px", borderRadius: "100px",
              color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              <TrendingUp size={14} /> Trending
            </Link>
            <Link href="/products" style={{
              padding: "8px 12px", borderRadius: "100px",
              color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              All Products
            </Link>
            <a
              href="https://www.tiktok.com/@clickandchic.10"
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: "8px 16px", borderRadius: "100px",
                background: "var(--accent-red)", color: "#fff",
                fontSize: "14px", fontWeight: 700,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Follow Lei 🎵
            </a>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {/* Admin quick-access — only visible when logged in as admin */}
            {isAdmin && (
              <>
                <Link
                  href="/products"
                  title="Go to Shop"
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    height: "36px", padding: "0 12px", borderRadius: "10px",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700,
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-hover)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <Store size={15} /> <span className="admin-btn-label">Shop</span>
                </Link>
                <Link
                  href="/admin"
                  title="Back to Admin"
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    height: "36px", padding: "0 12px", borderRadius: "10px",
                    background: "var(--bg-card)", border: "1px solid rgba(254,44,85,0.4)",
                    color: "var(--accent-red)", fontSize: "13px", fontWeight: 700,
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}
                >
                  <ShieldCheck size={15} /> <span className="admin-btn-label">Admin</span>
                </Link>
              </>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s", color: "var(--text-secondary)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="nav-mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "none",
                width: "36px", height: "36px", borderRadius: "10px",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--text-primary)",
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
          background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)",
          padding: "16px",
          display: "flex", flexDirection: "column", gap: "8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          {/* Mobile search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "10px 14px",
          }}>
            <Search size={15} color="var(--text-secondary)" />
            <input
              value={mobileSearchVal}
              onChange={e => setMobileSearchVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runSearch(mobileSearchVal)}
              placeholder="Search products..."
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px", width: "100%" }}
            />
          </div>
          {isAdmin && (
            <>
              <Link href="/products" onClick={() => setMenuOpen(false)} style={{
                padding: "12px 16px", borderRadius: "12px",
                background: "var(--bg-card)", color: "var(--text-primary)",
                fontWeight: 700, fontSize: "15px",
                display: "flex", alignItems: "center", gap: "8px",
                border: "1px solid var(--border)",
              }}>
                <Store size={16} /> View Shop
              </Link>
              <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                padding: "12px 16px", borderRadius: "12px",
                background: "rgba(254,44,85,0.1)", color: "var(--accent-red)",
                fontWeight: 700, fontSize: "15px",
                display: "flex", alignItems: "center", gap: "8px",
                border: "1px solid rgba(254,44,85,0.3)",
              }}>
                <ShieldCheck size={16} /> Back to Admin
              </Link>
            </>
          )}
          <Link href="/trending" onClick={() => setMenuOpen(false)} style={{
            padding: "12px 16px", borderRadius: "12px",
            background: "var(--bg-card)", color: "var(--text-primary)",
            fontWeight: 600, fontSize: "15px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <TrendingUp size={16} color="var(--accent-red)" /> Trending
          </Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} style={{
            padding: "12px 16px", borderRadius: "12px",
            background: "var(--bg-card)", color: "var(--text-primary)",
            fontWeight: 600, fontSize: "15px",
          }}>
            🛍️ All Products
          </Link>
          <a href="https://www.tiktok.com/@clickandchic.10" target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: "12px 16px", borderRadius: "12px",
              background: "var(--accent-red)", color: "#fff",
              fontWeight: 700, fontSize: "15px", textAlign: "center",
            }}>
            Follow Lei on TikTok 🎵
          </a>
        </div>
      )}
    </>
  );
}
