"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--bg-secondary)",
      padding: "48px 20px 32px",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div className="footer-top" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", marginBottom: "40px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "8px",
                background: "linear-gradient(135deg, var(--accent-red), var(--accent-cyan))",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShoppingBag size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 900, fontSize: "16px" }}>
                Lei<span style={{ color: "var(--accent-red)" }}>'s Picks</span>
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", maxWidth: "260px", lineHeight: 1.7 }}>
              Hi! I'm <strong style={{ color: "var(--text-primary)" }}>Lei</strong> — your go-to TikTok reviewer for the best value products.
              Everything here is something I've personally tried or watched. Honest reviews only! 🙏
            </p>
            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              {[
                { name: "TikTok", href: "https://www.tiktok.com/@clickandchic.10" },
                { name: "Instagram", href: "#" },
                { name: "YouTube", href: "#" },
              ].map(platform => (
                <a key={platform.name} href={platform.href}
                  target={platform.href !== "#" ? "_blank" : undefined}
                  rel={platform.href !== "#" ? "noopener noreferrer" : undefined}
                  style={{
                  padding: "6px 12px", borderRadius: "8px",
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--accent-red)";
                    e.currentTarget.style.color = "var(--accent-red)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer-links" style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "14px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                Shop
              </div>
              {["All Products", "Trending", "Beauty", "Fashion", "Tech"].map(l => (
                <div key={l} style={{ marginBottom: "10px" }}>
                  <Link href="/products" style={{ color: "var(--text-secondary)", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "14px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                About Lei
              </div>
              {[
                { label: "My TikTok", href: "https://www.tiktok.com/@clickandchic.10" },
                { label: "My Reviews", href: "/products" },
                { label: "Contact Me", href: "#" },
              ].map(l => (
                <div key={l.label} style={{ marginBottom: "10px" }}>
                  <a href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ color: "var(--text-secondary)", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >{l.label}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: "24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "12px",
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            © 2025 Lei's Picks. Made with ❤️ for TikTok shoppers.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Disclaimer: I earn an affiliate commission on purchases made through my links.
          </p>
        </div>
      </div>
    </footer>
  );
}
