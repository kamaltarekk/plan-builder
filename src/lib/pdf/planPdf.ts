// Client-side PDF generation. jsPDF + html2canvas are dynamically imported
// so they stay out of the main bundle and only load when a user downloads.

export interface GeneratePlanPdfArgs {
  /** The off-screen, fully-rendered template node to capture. */
  node: HTMLElement;
  fileName: string;
  /** Install/app URL the in-PDF CTA should open. */
  installUrl: string;
}

export async function generatePlanPdf({
  node,
  fileName,
  installUrl,
}: GeneratePlanPdfArgs): Promise<void> {
  const [{ jsPDF }, html2canvasModule] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);
  const html2canvas = html2canvasModule.default;

  // Make sure the Cairo webfont is ready so Arabic shapes correctly.
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Non-fatal; continue with whatever fonts are available.
    }
  }

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
    windowWidth: node.scrollWidth,
  });

  // JPEG keeps the file small (the template is text on a white background).
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2 - 12; // reserve room for fallback link

  let imgWidth = maxWidth;
  let imgHeight = (canvas.height * imgWidth) / canvas.width;
  if (imgHeight > maxHeight) {
    imgHeight = maxHeight;
    imgWidth = (canvas.width * imgHeight) / canvas.height;
  }
  const imgX = (pageWidth - imgWidth) / 2;
  const imgY = margin;

  pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);

  // Real, clickable link annotation positioned over the rendered CTA button.
  const cta = node.querySelector('[data-pdf-cta]');
  if (cta) {
    const nodeRect = node.getBoundingClientRect();
    const ctaRect = cta.getBoundingClientRect();
    if (nodeRect.width > 0 && nodeRect.height > 0) {
      const fx = (ctaRect.left - nodeRect.left) / nodeRect.width;
      const fy = (ctaRect.top - nodeRect.top) / nodeRect.height;
      const fw = ctaRect.width / nodeRect.width;
      const fh = ctaRect.height / nodeRect.height;
      pdf.link(
        imgX + fx * imgWidth,
        imgY + fy * imgHeight,
        fw * imgWidth,
        fh * imgHeight,
        { url: installUrl },
      );
    }
  }

  // Native, always-clickable fallback link (selectable text).
  const linkY = Math.min(imgY + imgHeight + 8, pageHeight - margin);
  pdf.setFontSize(10);
  pdf.setTextColor(156, 124, 18); // sabika gold-dark
  pdf.textWithLink(installUrl, margin, linkY, { url: installUrl });
  pdf.setTextColor(0, 0, 0);

  pdf.save(fileName);
}
