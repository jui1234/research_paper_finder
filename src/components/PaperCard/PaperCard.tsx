// src/components/PaperCard/PaperCard.tsx
"use client";
import React from "react";
import type { Paper } from "@/types/paper";
import styles from "./PaperCard.module.scss";
import { downloadFile } from "@/utils/download";

export default function PaperCard({ paper, onView }: { paper: Paper; onView: (p: Paper) => void }) {
  // Map API response fields
  const paperTitle = (paper as any).papertitle || paper.title || "—";
  const authors = (paper as any).coauthors || (Array.isArray(paper.authors) ? paper.authors.join(", ") : String(paper.authors ?? "")) || "—";
  
  // Get PDF/file URL - prioritize files array, then articlelink
  const pdf = (() => {
    const paperAny = paper as any;
    // Check for files array first (actual PDF files)
    if (Array.isArray(paper.files) && paper.files.length > 0) {
      const file = paper.files[0];
      return file.url || (typeof file === 'string' ? file : null);
    }
    // Check for files in API format
    if (Array.isArray(paperAny.files) && paperAny.files.length > 0) {
      const file = paperAny.files[0];
      return file.url || (typeof file === 'string' ? file : null);
    }
    // Fallback to articlelink (but this is usually a webpage, not a PDF)
    return paperAny.articlelink || null;
  })();
  
  // Handle download click
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdf) {
      const filename = `${paperTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      await downloadFile(pdf, filename);
    }
  };
  
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

  // Extract publisher - check publishername field first, then journal.publishingcompany
  const publisher = (() => {
    const paperAny = paper as any;
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

  // Get journal cover image - check journalimage field
  const coverImage = (() => {
    if (paper.journal && typeof paper.journal === "object" && paper.journal !== null) {
      const journal = paper.journal as any;
      let imageUrl: string | null = null;
      
      // Check for journalimage (could be string URL or object with url property)
      if (journal.journalimage) {
        if (typeof journal.journalimage === "string") {
          imageUrl = journal.journalimage;
        } else if (typeof journal.journalimage === "object" && journal.journalimage.url) {
          imageUrl = journal.journalimage.url;
        }
      }
      // Fallback to coverImage if exists
      if (!imageUrl && journal.coverImage && typeof journal.coverImage === "string") {
        imageUrl = journal.coverImage;
      }
      
      // If we have a relative URL (starts with /), prepend the API base URL
      if (imageUrl && imageUrl.startsWith("/")) {
        return `https://easydash.enago.com${imageUrl}`;
      }
      
      return imageUrl;
    }
    return null;
  })();

  // Get impact factor - check journal.impactfactor (API format) or paper.impact_factor
  const impactFactor = (() => {
    if (paper.journal && typeof paper.journal === "object" && paper.journal !== null) {
      const journal = paper.journal as any;
      if (journal.impactfactor !== undefined && journal.impactfactor !== null) {
        return journal.impactfactor;
      }
    }
    return paper.impact_factor;
  })();

  return (
    <div className={styles.card} data-id={paper.id} onClick={() => onView(paper)}>
      <div className={styles.left}>
        <div className={styles.thumbnailContainer}>
          <div className={styles.thumbnail}>
            {coverImage ? (
              <img src={coverImage} alt={journalName} className={styles.coverImage} />
            ) : (
              <div className={styles.placeholderCover}>
                <div className={styles.placeholderTitle}>{journalName}</div>
              </div>
            )}
          </div>
          {impactFactor !== undefined && impactFactor !== null && (
            <div className={styles.impactBox}>
              IF {typeof impactFactor === 'number' ? impactFactor.toFixed(2) : impactFactor}
            </div>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <h3 className={styles.title}>{paperTitle}</h3>
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Author:</span>
            <span className={styles.value}>{authors || "—"}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Publisher:</span>
            <span className={styles.value}>{publisher}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Journal:</span>
            <span className={styles.value}>{journalName}</span>
          </div>
        </div>
        {pdf && (
          <button 
            className={styles.download} 
            onClick={handleDownload}
            type="button"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
}
