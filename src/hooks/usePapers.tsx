// src/hooks/usePapers.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import type { Paper } from "@/types/paper";

type SortBy = "title" | "year" | "impact_factor";
type SortDir = "asc" | "desc";
type Field = "title" | "authors" | "journal";

export function usePapers(opts?: { initialPage?: number; pageSize?: number }) {
  const initialPage = opts?.initialPage ?? 1;
  const initialPageSize = opts?.pageSize ?? 10;

  const [raw, setRaw] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");
  const [field, setField] = useState<Field>("title");

  const [sortBy, setSortBy] = useState<SortBy>("year");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch("https://easydash.enago.com/acceptedpapers", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = json.data ? json.data : json;
        setRaw(items as Paper[]);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(String(err.message ?? err));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return raw;
    const q = query.toLowerCase();
    return raw.filter((p: any) => {
      if (field === "title") {
        const title = p.papertitle || p.title || "";
        return String(title).toLowerCase().includes(q);
      }
      if (field === "journal") {
        // Handle journal as either string or object
        let journalStr = "";
        if (p.journal) {
          if (typeof p.journal === "string") {
            journalStr = p.journal;
          } else if (typeof p.journal === "object" && p.journal !== null) {
            const journal = p.journal as any;
            // Extract string values, ensuring we never use an object
            const displayTitle = journal.displaytitle && typeof journal.displaytitle === "string" ? journal.displaytitle : null;
            const title = journal.title && typeof journal.title === "string" ? journal.title : null;
            const abbrev = journal.journalabbreviation && typeof journal.journalabbreviation === "string" ? journal.journalabbreviation : null;
            journalStr = displayTitle || title || abbrev || "";
          } else {
            journalStr = String(p.journal) || "";
          }
        }
        return journalStr.toLowerCase().includes(q);
      }
      if (field === "authors") {
        const authors = p.coauthors || (Array.isArray(p.authors) ? p.authors.join(" ") : String(p.authors ?? ""));
        return String(authors).toLowerCase().includes(q);
      }
      return false;
    });
  }, [raw, query, field]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a: any, b: any) => {
      if (sortBy === "title") {
        const titleA = a.papertitle || a.title || "";
        const titleB = b.papertitle || b.title || "";
        return String(titleA).localeCompare(String(titleB)) * dir;
      }
      if (sortBy === "year") return ((a.year ?? 0) - (b.year ?? 0)) * dir;
      // For impact factor, check journal.impactfactor first
      const impactA = a.journal?.impactfactor ?? a.impact_factor ?? 0;
      const impactB = b.journal?.impactfactor ?? b.impact_factor ?? 0;
      return (impactA - impactB) * dir;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const data = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  return {
    data,
    total,
    totalPages,
    loading,
    error,
    // controls
    query,
    setQuery,
    field,
    setField,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    page,
    setPage,
    pageSize,
    setPageSize,
  };
}
