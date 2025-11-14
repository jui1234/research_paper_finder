// src/app/page.tsx
"use client";
import React, { useState } from "react";
import "@/styles/globals.scss";
import { usePapers } from "@/hooks/usePapers";
import SearchBar from "@/components/SearchBar/SearchBar";
import PaperCard from "@/components/PaperCard/PaperCard";
import SortControls from "@/components/SortControls/SortControls";
import Pagination from "@/components/Pagination/Pagination";
import DetailsModal from "@/components/DetailsModal/DetailsModal";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";

export default function Page() {
  const {
    data, total, totalPages, loading, error,
    query, setQuery, field, setField,
    sortBy, setSortBy, sortDir, setSortDir,
    page, setPage,
  } = usePapers({ initialPage: 1, pageSize: 10 });

  const [selected, setSelected] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function onView(paper: any) { setSelected(paper); setModalOpen(true); }

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Research Papers</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <SearchBar value={query} onChange={setQuery} field={field as any} onFieldChange={setField as any} />
        <SortControls sortBy={sortBy} sortDir={sortDir as any} onSortBy={setSortBy as any} onSortDir={setSortDir as any} />
      </div>

      {loading && (
        <div style={{ display: "grid", gap: 12 }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {data.map((p: any) => <PaperCard key={p.id} paper={p} onView={onView} />)}
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>Total: {total}</div>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        </>
      )}

      <DetailsModal open={modalOpen} paper={selected} onClose={() => setModalOpen(false)} />
    </main>
  );
}
