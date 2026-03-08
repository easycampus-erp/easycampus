import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export function toCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
}

export async function buildSimplePdf(title: string, subtitle: string, headers: string[], rows: string[][]) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 842;
  const pageHeight = 595;
  const marginX = 42;
  const topY = 552;
  const rowHeight = 22;
  const usableWidth = pageWidth - marginX * 2;
  const columnWidth = usableWidth / Math.max(headers.length, 1);

  function drawPageChrome(page: any, pageIndex: number) {
    page.drawRectangle({ x: 0, y: pageHeight - 92, width: pageWidth, height: 92, color: rgb(0.05, 0.18, 0.42) });
    page.drawRectangle({ x: 0, y: pageHeight - 98, width: pageWidth, height: 6, color: rgb(0.17, 0.52, 0.98) });
    page.drawText("EasyCampus", { x: marginX, y: topY + 10, size: 12, font: bold, color: rgb(0.85, 0.93, 1) });
    page.drawText("Smart University Operating System", { x: marginX + 82, y: topY + 10, size: 10, font, color: rgb(0.75, 0.86, 1) });
    page.drawText(title, { x: marginX, y: topY - 18, size: 24, font: bold, color: rgb(1, 1, 1) });
    page.drawText(subtitle, { x: marginX, y: topY - 40, size: 10, font, color: rgb(0.82, 0.89, 0.98) });
    page.drawText(`Page ${pageIndex + 1}`, { x: pageWidth - 82, y: 24, size: 10, font, color: rgb(0.38, 0.44, 0.55) });
    page.drawText("Generated from EasyMentor ERP", { x: marginX, y: 24, size: 10, font, color: rgb(0.38, 0.44, 0.55) });
  }

  function drawTableHeader(page: any, y: number) {
    page.drawRectangle({ x: marginX, y: y - 6, width: usableWidth, height: 24, color: rgb(0.92, 0.96, 1) });
    headers.forEach((header, index) => {
      page.drawText(header.slice(0, 22), {
        x: marginX + index * columnWidth + 6,
        y,
        size: 10,
        font: bold,
        color: rgb(0.08, 0.13, 0.2)
      });
    });
  }

  let page = pdf.addPage([pageWidth, pageHeight]);
  let pageIndex = 0;
  drawPageChrome(page, pageIndex);
  let y = 448;
  drawTableHeader(page, y);
  y -= rowHeight;

  rows.forEach((row, rowIndex) => {
    if (y < 72) {
      page = pdf.addPage([pageWidth, pageHeight]);
      pageIndex += 1;
      drawPageChrome(page, pageIndex);
      y = 448;
      drawTableHeader(page, y);
      y -= rowHeight;
    }

    if (rowIndex % 2 === 0) {
      page.drawRectangle({ x: marginX, y: y - 6, width: usableWidth, height: 20, color: rgb(0.98, 0.99, 1) });
    }

    row.forEach((cell, index) => {
      page.drawText(String(cell ?? "").slice(0, 24), {
        x: marginX + index * columnWidth + 6,
        y,
        size: 9,
        font,
        color: rgb(0.08, 0.13, 0.2)
      });
    });

    y -= rowHeight;
  });

  page.drawLine({
    start: { x: marginX, y: 54 },
    end: { x: marginX + 170, y: 54 },
    thickness: 1,
    color: rgb(0.75, 0.8, 0.9)
  });
  page.drawText("Authorised Signature", { x: marginX, y: 40, size: 10, font, color: rgb(0.38, 0.44, 0.55) });

  return pdf.save();
}
