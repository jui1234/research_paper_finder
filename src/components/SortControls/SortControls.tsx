// src/components/SortControls.tsx
"use client";
import React from "react";
import styles from "./SortControls.module.scss";

export default function SortControls({
  sortBy,
  sortDir,
  onSortBy,
  onSortDir,
}: {
  sortBy: string;
  sortDir: "asc" | "desc";
  onSortBy: (s: string) => void;
  onSortDir: (d: "asc" | "desc") => void;
}) {
  return (
    <div className={styles.wrapper}>
      <select 
        value={sortBy} 
        onChange={(e) => onSortBy(e.target.value)}
        className={styles.select}
      >
        <option value="title">Title</option>
        <option value="year">Year</option>
        <option value="impact_factor">Impact Factor</option>
      </select>
      <button 
        onClick={() => onSortDir(sortDir === "asc" ? "desc" : "asc")}
        className={styles.button}
        type="button"
        aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
      >
        {sortDir === "asc" ? "▲" : "▼"}
      </button>
    </div>
  );
}
