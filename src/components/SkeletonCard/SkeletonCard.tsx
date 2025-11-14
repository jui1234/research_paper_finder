// src/components/SkeletonCard/SkeletonCard.tsx
"use client";
import React from "react";

export default function SkeletonCard() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderRadius: 12, background: "#fff", border: "1px solid #eee" }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: 18, width: "60%", background: "#eee", marginBottom: 10, borderRadius: 4 }} />
        <div style={{ height: 12, width: "80%", background: "#f2f2f2", marginBottom: 6, borderRadius: 4 }} />
        <div style={{ height: 12, width: "40%", background: "#f2f2f2", marginBottom: 6, borderRadius: 4 }} />
      </div>
      <div style={{ width: 120, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 36, background: "#eee", borderRadius: 8 }} />
        <div style={{ height: 36, background: "#eee", borderRadius: 8 }} />
      </div>
    </div>
  );
}
