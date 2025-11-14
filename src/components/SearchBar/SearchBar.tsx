// src/components/SearchBar/SearchBar.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./SearchBar.module.scss";

type Field = "title" | "authors" | "journal";

export default function SearchBar({
  value,
  onChange,
  field,
  onFieldChange,
}: {
  value: string;
  onChange: (v: string) => void;
  field: Field;
  onFieldChange: (f: Field) => void;
}) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, 350);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  const handleClear = () => {
    setLocal("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          placeholder="Search papers..."
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />
        {local && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <select value={field} onChange={(e) => onFieldChange(e.target.value as Field)} className={styles.select}>
        <option value="title">Title</option>
        <option value="authors">Author</option>
        <option value="journal">Journal</option>
      </select>
    </div>
  );
}
