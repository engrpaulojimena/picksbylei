"use client";
import Link from "next/link";
import { TrendingUp, Play, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-section" style={{
      position: "relative", overflow: "hidden",
      padding: "80px 20px 100px",
      background: "var(--bg-primary)",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "-100px", left: "50%",
        transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(254,44,85,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "0", right: "-100px",
        width: "400px", height: "300px",
        background: "radial-gradient(ellipse at center, rgba(37,244,238,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "var(--accent-red-dim)", border: "1px solid rgba(254,44,85,0.3)",
          borderRadius: "100px", padding: "6px 14px", marginBottom: "24px",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "var(--accent-red)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }} />
          <span style={{ color: "var(--accent-red)", fontSize: "13px", fontWeight: 600 }}>
            Live on TikTok Shop PH
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-title" style={{
          fontSize: "clamp(40px, 7vw, 80px)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-2px",
          maxWidth: "820px",
          marginBottom: "20px",
        }}>
          Hi, I'm{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent-red), #ff6b8a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Lei
          </span>
          <br />
          These are my{" "}
          <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>
            TikTok Finds
          </span>{" "}🛍️
        </h1>

        <p style={{
          fontSize: "17px", color: "var(--text-secondary)",
          maxWidth: "520px", lineHeight: 1.75, marginBottom: "40px",
        }}>
          All the products I review on TikTok — curated just for you.
          Real reviews, honest opinions, the best deals only!
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/products" style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "14px 28px", borderRadius: "100px",
            background: "var(--accent-red)", color: "#fff",
            fontWeight: 700, fontSize: "16px",
            transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(254,44,85,0.35)",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(254,44,85,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(254,44,85,0.35)";
            }}
          >
            <TrendingUp size={18} />
            Shop All Picks
          </Link>
          <a
            href="https://www.tiktok.com/@clickandchic.10"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "100px",
              background: "transparent",
              border: "1px solid var(--border-hover)",
              color: "var(--text-primary)",
              fontWeight: 600, fontSize: "16px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent-red)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
          >
            <Play size={16} fill="currentColor" />
            Watch Reviews
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{
          display: "flex", gap: "40px", marginTop: "60px",
          flexWrap: "wrap",
        }}>
          {[
            { value: "100+", label: "Products Reviewed" },
            { value: "4.8★", label: "Avg. Rating" },
            { value: "50K+", label: "Happy Shoppers" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
