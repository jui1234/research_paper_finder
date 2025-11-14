// src/components/Pagination.tsx
"use client";
import React from "react";

export default function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={() => onPage(1)} disabled={page === 1}>First</button>
      <button onClick={() => onPage(page - 1)} disabled={page === 1}>Prev</button>
      <div>Page {page} / {totalPages}</div>
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}>Next</button>
      <button onClick={() => onPage(totalPages)} disabled={page === totalPages}>Last</button>
    </div>
  );
}
