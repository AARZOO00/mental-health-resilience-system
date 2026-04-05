/**
 * PDF Export Utility
 * Generates a professional assessment report PDF using jsPDF.
 * Uses programmatic drawing (no HTML capture) for reliability.
 */

import { jsPDF } from "jspdf";
import { DIMENSIONS, SCORE_BANDS } from "../data/dimensions";
import { calcScore, getBand, generateInsights } from "./scoring";

/**
 * Draws a horizontal progress bar
 */
function drawBar(doc, x, y, width, value, color) {
  const fillWidth = (value / 100) * width;
  // Background
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(x, y, width, 5, 2, 2, "F");
  // Fill
  doc.setFillColor(...hexToRgb(color));
  if (fillWidth > 0) {
    doc.roundedRect(x, y, fillWidth, 5, 2, 2, "F");
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function drawCircleGauge(doc, cx, cy, radius, score, color) {
  // Background circle
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(6);
  doc.circle(cx, cy, radius, "S");
  // Score arc (approximated with segments)
  doc.setDrawColor(...hexToRgb(color));
  doc.setLineWidth(6);
  const segments = Math.round(score / 100 * 36);
  for (let i = 0; i < segments; i++) {
    const angle1 = (i / 36) * Math.PI * 2 - Math.PI / 2;
    const angle2 = ((i + 0.8) / 36) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + radius * Math.cos(angle1);
    const y1 = cy + radius * Math.sin(angle1);
    const x2 = cx + radius * Math.cos(angle2);
    const y2 = cy + radius * Math.sin(angle2);
    doc.line(x1, y1, x2, y2);
  }
  // Score text
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb(color));
  doc.text(String(score), cx, cy + 3, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("out of 100", cx, cy + 10, { align: "center" });
}

/**
 * Main PDF generation function
 * @param {Object} values - dimension values
 * @param {string} userName - user's name for the report
 * @param {string} note - optional personal note
 */
export async function generatePDF(values, userName = "Anonymous", note = "") {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const score = calcScore(values);
  const band = getBand(score);
  const insights = generateInsights(values);
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;

  // ── Page 1: Header & Score ──────────────────────────────────────────────────
  // Dark header banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 60, "F");

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(56, 189, 248);
  doc.text("Mental Health Resilience Report", margin, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Social Determinants of Health Assessment", margin, 31);
  doc.text(`Prepared for: ${userName}`, margin, 40);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, 48);

  // Score circle on right
  drawCircleGauge(doc, 170, 30, 20, score, band.color);

  // Band label
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb(band.color));
  doc.text(band.label, 170, 56, { align: "center" });

  // ── Score Summary Box ───────────────────────────────────────────────────────
  let y = 70;
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, contentW, 30, 3, 3, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Assessment Summary", margin + 8, y + 8);
  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  const wrapped = doc.splitTextToSize(band.description, contentW - 16);
  doc.text(wrapped, margin + 8, y + 16);

  // ── Dimension Breakdown ─────────────────────────────────────────────────────
  y = 110;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(226, 232, 240);
  doc.text("Dimension Scores", margin, y);

  y += 8;
  doc.setLineWidth(0.3);
  doc.setDrawColor(51, 65, 85);
  doc.line(margin, y, margin + contentW, y);
  y += 8;

  DIMENSIONS.forEach((dim) => {
    const val = values[dim.key] ?? 0;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(dim.label, margin, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(dim.color));
    doc.text(`${val}/100`, margin + contentW, y, { align: "right" });

    drawBar(doc, margin, y + 2, contentW - 20, val, dim.color);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Weight: ${Math.round(dim.weight * 100)}%`, margin + contentW - 20, y, { align: "right" });

    y += 14;
  });

  // ── Page 2: Insights & Recommendations ─────────────────────────────────────
  doc.addPage();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 20, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(56, 189, 248);
  doc.text("AI Insights & Recommendations", margin, 13);

  y = 30;

  // Status message
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, contentW, 35, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb(band.color));
  doc.text(`${band.label} Resilience — Score ${score}/100`, margin + 8, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  const msgLines = doc.splitTextToSize(insights.statusMessage, contentW - 16);
  doc.text(msgLines.slice(0, 3), margin + 8, y + 17);

  y += 44;

  // Key metrics row
  const metrics = [
    { label: "Protective Factors", value: `${insights.protective}/${DIMENSIONS.length}`, color: "#22c55e" },
    { label: "Risk Flags", value: insights.riskFlags, color: "#ef4444" },
    { label: "Top Strength", value: insights.strongest.label, color: insights.strongest.color },
  ];
  const colW = contentW / 3;
  metrics.forEach((m, i) => {
    const mx = margin + i * colW;
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(mx, y, colW - 3, 18, 2, 2, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, mx + 6, y + 7);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(m.color));
    doc.text(String(m.value), mx + 6, y + 14);
  });

  y += 28;

  // Recommendations
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(226, 232, 240);
  doc.text("Personalized Action Plan", margin, y);
  y += 10;

  insights.recommendations.slice(0, 2).forEach((rec) => {
    if (y > 240) { doc.addPage(); y = 20; }

    // Section header
    doc.setFillColor(...hexToRgb(rec.dim.color), 30);
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(rec.dim.color));
    doc.text(`${rec.dim.label} — ${rec.headline}`, margin + 6, y + 5.5);
    y += 12;

    rec.actions.slice(0, 3).forEach((action) => {
      if (y > 260) return;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(226, 232, 240);
      doc.text(`• ${action.title}`, margin + 4, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      const lines = doc.splitTextToSize(action.detail, contentW - 12);
      doc.text(lines.slice(0, 2), margin + 8, y);
      y += lines.length > 1 ? 10 : 6;
    });

    if (rec.resource) {
      doc.setFontSize(7.5);
      doc.setTextColor(56, 189, 248);
      doc.text(`Resource: ${rec.resource}`, margin + 4, y);
      y += 8;
    }
    y += 4;
  });

  // ── Footer ──────────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(
      "For educational purposes only. Not a clinical diagnostic tool. Consult a qualified mental health professional.",
      pageW / 2, 290, { align: "center" }
    );
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, 290, { align: "right" });
  }

  // Personal note if provided
  if (note.trim()) {
    doc.addPage();
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(226, 232, 240);
    doc.text("Personal Notes", margin, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    const noteLines = doc.splitTextToSize(note, contentW);
    doc.text(noteLines, margin, 35);
  }

  doc.save(`MH-Resilience-Report-${userName.replace(/\s+/g, "-")}-${Date.now()}.pdf`);
}
