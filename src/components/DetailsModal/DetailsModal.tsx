// src/components/DetailsModal.tsx
"use client";
import React from "react";
import type { Paper } from "@/types/paper";

export default function DetailsModal({ open, paper, onClose }: {
  open: boolean; paper: Paper | null; onClose: () => void;
}) {
  if (!open || !paper) return null;
  
  const paperAny = paper as any;
  
  // Map API response fields
  const paperTitle = paperAny.papertitle || paper.title || "—";
  
  // Handle authors - check coauthors first, then authors
  const authorsDisplay = (() => {
    if (paperAny.coauthors && typeof paperAny.coauthors === "string") {
      return paperAny.coauthors;
    }
    if (paper.authors) {
      if (Array.isArray(paper.authors)) return paper.authors.join(", ");
      if (typeof paper.authors === "string") return paper.authors;
      return String(paper.authors) || "—";
    }
    return "—";
  })();
  
  // Handle journal as either string or object
  const journalName = (() => {
    if (!paper.journal) return "—";
    if (typeof paper.journal === "string") return paper.journal;
    if (typeof paper.journal === "object" && paper.journal !== null) {
      const journal = paper.journal as any;
      // Extract string values, ensuring we never return an object
      const displayTitle = journal.displaytitle && typeof journal.displaytitle === "string" ? journal.displaytitle : null;
      const title = journal.title && typeof journal.title === "string" ? journal.title : null;
      const abbrev = journal.journalabbreviation && typeof journal.journalabbreviation === "string" ? journal.journalabbreviation : null;
      return displayTitle || title || abbrev || "—";
    }
    return String(paper.journal) || "—";
  })();
  
  // Extract publisher
  const publisher = (() => {
    if (paperAny.publishername && typeof paperAny.publishername === "string") {
      return paperAny.publishername;
    }
    if (paperAny.publisher && typeof paperAny.publisher === "object" && paperAny.publisher !== null) {
      if (paperAny.publisher.publishername && typeof paperAny.publisher.publishername === "string") {
        return paperAny.publisher.publishername;
      }
    }
    if (paper.journal && typeof paper.journal === "object" && paper.journal !== null) {
      const journal = paper.journal as any;
      if (journal.publishingcompany && typeof journal.publishingcompany === "string") {
        return journal.publishingcompany;
      }
    }
    return "—";
  })();
  
  // Get impact factor
  const impactFactor = (() => {
    if (paper.journal && typeof paper.journal === "object" && paper.journal !== null) {
      const journal = paper.journal as any;
      if (journal.impactfactor !== undefined && journal.impactfactor !== null) {
        return journal.impactfactor;
      }
    }
    return paper.impact_factor ?? "—";
  })();
  
  // Get year
  const year = paper.year ?? paperAny.year ?? "—";
  
  // Get DOI
  const doi = paper.doi ?? paperAny.doi ?? "—";
  
  // Get article link
  const articleLink = paperAny.articlelink || null;
  
  // Get files
  const files = paper.files || paperAny.files || [];
  
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
      <div style={{ width: "min(1000px,95%)", maxHeight: "90vh", overflow: "auto", background: "#fff", padding: 20, borderRadius: 12 }}>
        <button onClick={onClose} style={{ float: "right", padding: "8px 16px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", background: "#fff" }}>Close</button>
        <h2 style={{ marginTop: 0 }}>{paperTitle}</h2>
        <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
          <div><strong>Authors:</strong> {authorsDisplay}</div>
          <div><strong>Journal:</strong> {journalName}</div>
          <div><strong>Publisher:</strong> {publisher}</div>
          <div><strong>Year:</strong> {year}</div>
          <div><strong>Impact Factor:</strong> {impactFactor}</div>
          {doi !== "—" && <div><strong>DOI:</strong> {doi}</div>}
        </div>
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <strong>DOI / Links:</strong>
          {doi !== "—" && <div style={{ marginTop: 4 }}><a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer">{doi}</a></div>}
          {articleLink && (
            <div style={{ marginTop: 4 }}>
              <a href={articleLink} target="_blank" rel="noreferrer">Article Link</a>
            </div>
          )}
          {files.length > 0 && files.map((f: any, i: number) => (
            <div key={i} style={{ marginTop: 4 }}>
              <a href={f.url} target="_blank" rel="noreferrer">{f.name ?? f.url}</a>
            </div>
          ))}
        </div>
        <details style={{ marginTop: 20 }}>
          <summary style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 8 }}>Full JSON Data</summary>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "12px", borderRadius: "4px", overflow: "auto", maxHeight: "400px" }}>
            {JSON.stringify(paper, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
