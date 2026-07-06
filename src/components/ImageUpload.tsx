"use client";
import { useRef, useState } from "react";
import { Upload, Loader, X, ImageIcon, Link as LinkIcon } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
};

export default function ImageUpload({ value, onChange, inputStyle, labelStyle }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    upload(file);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Product Photo</label>
        <button
          type="button"
          onClick={() => setShowUrlField(s => !s)}
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", fontSize: "11px", fontWeight: 600,
          }}
        >
          <LinkIcon size={11} /> {showUrlField ? "Hide URL field" : "Paste URL instead"}
        </button>
      </div>

      {/* Preview + dropzone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={e => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? "var(--accent-red)" : "var(--border)"}`,
          borderRadius: "14px",
          padding: value ? "12px" : "28px 14px",
          background: dragActive ? "var(--accent-red-dim)" : "var(--input-bg)",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          textAlign: "center",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => handleFile(e.target.files?.[0])}
          style={{ display: "none" }}
        />

        {uploading ? (
          <>
            <Loader size={22} color="var(--accent-red)" className="animate-spin" />
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Uploading...</span>
          </>
        ) : value ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            <img src={value} alt="Preview" style={{ width: "56px", height: "56px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Photo uploaded ✓</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Click to replace</div>
            </div>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(""); }}
              style={{
                width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-muted)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            {dragActive ? <Upload size={22} color="var(--accent-red)" /> : <ImageIcon size={22} color="var(--text-muted)" />}
            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
              Drag a photo here, or click to browse
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>JPG, PNG, WEBP — max 8MB</span>
          </>
        )}
      </div>

      {error && <p style={{ fontSize: "12px", color: "var(--accent-red)", marginTop: "6px" }}>{error}</p>}

      {showUrlField && (
        <input
          style={{ ...inputStyle, marginTop: "8px" }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
        />
      )}
    </div>
  );
}
