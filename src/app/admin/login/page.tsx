"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password. Please try again!");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-primary)", padding: "20px",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "500px", height: "300px",
        background: "radial-gradient(ellipse, rgba(254,44,85,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: "400px",
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "24px", padding: "40px 36px",
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, var(--accent-red), var(--accent-cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <ShoppingBag size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px" }}>
            Shop<span style={{ color: "var(--accent-red)" }}>WithMe</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "6px" }}>
            Admin access only
          </p>
        </div>

        {/* Lock icon */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "44px", height: "44px", borderRadius: "12px",
          background: "var(--accent-red-dim)", border: "1px solid rgba(254,44,85,0.2)",
          margin: "0 auto 24px",
        }}>
          <Lock size={20} color="var(--accent-red)" />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{
            fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)",
            display: "block", marginBottom: "8px",
          }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter admin password"
              style={{
                width: "100%", padding: "12px 44px 12px 16px",
                background: "#1a1a1a", border: `1px solid ${error ? "var(--accent-red)" : "var(--border)"}`,
                borderRadius: "12px", color: "var(--text-primary)",
                fontSize: "15px", outline: "none",
              }}
            />
            <button
              onClick={() => setShowPw(p => !p)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-secondary)", display: "flex",
              }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <p style={{ color: "var(--accent-red)", fontSize: "13px", marginTop: "8px" }}>
              {error}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{
            width: "100%", padding: "13px",
            background: "var(--accent-red)", color: "#fff",
            border: "none", borderRadius: "12px",
            fontWeight: 700, fontSize: "15px", cursor: "pointer",
            opacity: loading || !password ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Checking..." : "Login"}
        </button>

        <p style={{
          textAlign: "center", marginTop: "20px",
          fontSize: "12px", color: "var(--text-muted)",
        }}>
          For ShopWithMe admins only 🔒
        </p>
      </div>
    </div>
  );
}