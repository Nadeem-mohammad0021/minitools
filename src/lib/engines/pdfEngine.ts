import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

/**
 * Merges multiple PDF files into a single PDF
 */
export async function mergePDF(files: ArrayBuffer[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const pdf = await PDFDocument.load(file);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  return await merged.save();
}

/**
 * Splits a PDF into multiple files based on ranges
 */
export async function splitPDF(file: ArrayBuffer, ranges: number[][]): Promise<Uint8Array[]> {
  const pdfDoc = await PDFDocument.load(file);
  const result: Uint8Array[] = [];

  for (const range of ranges) {
    const subDoc = await PDFDocument.create();
    const [start, end] = range;
    const pageIndices = [];
    for (let i = start; i <= end; i++) {
      if (i >= 0 && i < pdfDoc.getPageCount()) {
        pageIndices.push(i);
      }
    }

    if (pageIndices.length > 0) {
      const pages = await subDoc.copyPages(pdfDoc, pageIndices);
      pages.forEach((p) => subDoc.addPage(p));
      result.push(await subDoc.save());
    }
  }

  return result;
}

/**
 * Rotates all pages or specific pages to a specific angle
 */
export async function rotatePDF(file: ArrayBuffer, rotation: number): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(file);
  const pages = pdfDoc.getPages();

  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotation));
  });

  return await pdfDoc.save();
}

/**
 * Locks a PDF with a password
 */
export async function lockPDF(file: ArrayBuffer, password: string): Promise<Uint8Array> {
  try {
    let muhammara;
    try {
      muhammara = await import('muhammara');
    } catch (e) {
      // Fallback for some Node environments if dynamic import is restricted
      muhammara = require('muhammara');
    }
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');
    const { nanoid } = await import('nanoid');

    const tempId = nanoid();
    const inputPath = path.join(os.tmpdir(), `input-${tempId}.pdf`);
    const outputPath = path.join(os.tmpdir(), `output-${tempId}.pdf`);

    // Write input to temp file
    fs.writeFileSync(inputPath, Buffer.from(file));

    try {
      const recipe = new (muhammara as any).Recipe(inputPath, outputPath);

      recipe
        .encrypt({
          userPassword: password,
          ownerPassword: password,
          userProtectionFlag: 4 // Allow printing
        })
        .endPDF();

      const result = fs.readFileSync(outputPath);

      // Cleanup
      try { fs.unlinkSync(inputPath); } catch (e) { }
      try { fs.unlinkSync(outputPath); } catch (e) { }

      return new Uint8Array(result);
    } catch (recipeErr) {
      // Re-cleanup on inner error
      try { fs.unlinkSync(inputPath); } catch (e) { }
      try { fs.unlinkSync(outputPath); } catch (e) { }
      throw recipeErr;
    }
  } catch (err) {
    console.error('Lock PDF error with muhammara:', err);
    throw new Error('Encryption failed. Please ensure the password is valid.');
  }
}

/**
 * Unlocks a PDF (removes password protection)
 */
export async function unlockPDF(file: ArrayBuffer, password: string): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(file, { password } as any);
    return await pdfDoc.save();
  } catch (e) {
    throw new Error("Invalid password or failed to unlock");
  }
}

/**
 * Compresses a PDF using pdf-lib for basic compression
 * @param quality 'low' | 'medium' | 'high' - 'low' is maximum compression (smallest file)
 */
export async function compressPDF(
  file: ArrayBuffer,
  quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(file);

  // Optimization: For max compression (low quality), remove metadata
  if (quality === 'low') {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
  }

  const options = {
    useObjectStreams: true,
    addDefaultPage: false,
    updateMetadata: quality !== 'low'
  };

  return await pdfDoc.save(options);
}

/**
 * Advanced PDF compression using external tools when available
 * Falls back to basic compression if external tools aren't available
 */
export async function compressPDFAdvanced(
  file: ArrayBuffer,
  quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<Uint8Array> {
  try {
    const { exec } = await import('child_process');
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');
    const { promisify } = await import('util');

    const execAsync = promisify(exec);

    // Create temporary files with unique names
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const inputPath = path.join(tempDir, `comp_in_${timestamp}.pdf`);
    const outputPath = path.join(tempDir, `comp_out_${timestamp}.pdf`);

    fs.writeFileSync(inputPath, Buffer.from(file));

    // Ghostscript settings for different quality levels
    // /screen (72 dpi) - lowest quality, smallest size
    // /ebook (150 dpi) - medium quality
    // /printer (300 dpi) - high quality
    // /prepress (300 dpi, color preserving)

    let gsQuality;
    switch (quality) {
      case 'low': gsQuality = '/screen'; break;
      case 'medium': gsQuality = '/ebook'; break;
      case 'high': gsQuality = '/printer'; break;
      default: gsQuality = '/ebook';
    }

    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${gsQuality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

    try {
      await execAsync(gsCommand);

      if (fs.existsSync(outputPath)) {
        const result = fs.readFileSync(outputPath);

        // Cleanup
        try { fs.unlinkSync(inputPath); } catch { }
        try { fs.unlinkSync(outputPath); } catch { }

        return new Uint8Array(result);
      }
    } catch (gsError: any) {
      // Silently fall back if gs is not installed
      console.log('Ghostscript not available, using pdf-lib fallback');
    }

    // Cleanup in case gs failed but files exist
    try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch { }

  } catch (e: any) {
    console.warn('Advanced compression error:', e.message);
  }

  // High reliable fallback
  return await compressPDF(file, quality);
}

/**
 * Adds a text watermark to PDF pages
 */
export async function addWatermark(
  file: ArrayBuffer,
  text: string,
  options: {
    size?: number;
    opacity?: number;
    color?: { r: number, g: number, b: number },
    rotation?: number
  } = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(file);
  const pages = pdfDoc.getPages();
  const { size = 50, opacity = 0.5, color = { r: 0.5, g: 0.5, b: 0.5 }, rotation = 45 } = options;
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, size);
    const textHeight = size; // Approximate

    // To center a rotated text:
    // 1. Calculate the center of the page
    // 2. Adjust for the text width/height
    // 3. Apply rotation

    const radians = (rotation * Math.PI) / 180;
    const cosX = Math.cos(radians);
    const sinX = Math.sin(radians);

    // Center point of text box
    const centerX = width / 2;
    const centerY = height / 2;

    // We want the center of the text to be at (centerX, centerY)
    // When drawing at (x, y) with rotation, the bottom-left corner is at (x, y)
    // The center of the text relative to bottom-left is (textWidth/2, textHeight/2)
    // We need to rotate this relative vector and subtract it from (centerX, centerY)

    const relCenterX = (textWidth / 2) * cosX - (textHeight / 2) * sinX;
    const relCenterY = (textWidth / 2) * sinX + (textHeight / 2) * cosX;

    page.drawText(text, {
      x: centerX - relCenterX,
      y: centerY - relCenterY,
      size,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotation),
    });
  }

  return await pdfDoc.save();
}

/**
 * Adds an image watermark to PDF pages
 */
export async function addImageWatermark(
  file: ArrayBuffer,
  imageBuffer: ArrayBuffer,
  options: {
    width?: number;
    height?: number;
    opacity?: number;
    x?: number;
    y?: number;
    rotation?: number;
  } = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(file);
  const pages = pdfDoc.getPages();
  const { opacity = 0.5, rotation = 0 } = options;

  let watermarkImage;
  try {
    // Try to detect format or just let pdf-lib handle it (it supports PNG and JPEG)
    watermarkImage = await pdfDoc.embedPng(imageBuffer).catch(() => pdfDoc.embedJpg(imageBuffer));
  } catch (e) {
    throw new Error('Unsupported image format for watermark. Please use PNG or JPEG.');
  }

  const wWidth = options.width || watermarkImage.width * 0.5;
  const wHeight = options.height || (wWidth * (watermarkImage.height / watermarkImage.width));

  for (const page of pages) {
    const { width: pWidth, height: pHeight } = page.getSize();

    const x = options.x !== undefined ? options.x : (pWidth / 2 - wWidth / 2);
    const y = options.y !== undefined ? options.y : (pHeight / 2 - wHeight / 2);

    page.drawImage(watermarkImage, {
      x,
      y,
      width: wWidth,
      height: wHeight,
      opacity,
      rotate: degrees(rotation),
    });
  }

  return await pdfDoc.save();
}

/**
 * Adds page numbers to PDF
 */
export async function addPageNumbers(file: ArrayBuffer, position: 'bottom-center' | 'bottom-right' = 'bottom-right'): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(file);
  const pages = pdfDoc.getPages();
  const total = pages.length;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const text = `${i + 1} / ${total}`;
    const textWidth = font.widthOfTextAtSize(text, 12);

    let x = width - textWidth - 20; // bottom-right default
    if (position === 'bottom-center') {
      x = width / 2 - textWidth / 2;
    }

    page.drawText(text, {
      x,
      y: 20,
      size: 12,
      font,
    });
  }

  return await pdfDoc.save();
}

/**
 * Deletes specific pages from PDF
 */
export async function deletePDFPages(file: ArrayBuffer, pageIndices: number[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(file);
  const total = pdfDoc.getPageCount();
  const keepIndices = [];

  for (let i = 0; i < total; i++) {
    if (!pageIndices.includes(i)) {
      keepIndices.push(i);
    }
  }

  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(pdfDoc, keepIndices);
  pages.forEach(p => newDoc.addPage(p));

  return await newDoc.save();
}

/**
 * Reorders pages in PDF
 */
export async function reorderPDFPages(file: ArrayBuffer, order: number[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(file);
  const newDoc = await PDFDocument.create();

  const validOrder = order.filter(i => i >= 0 && i < pdfDoc.getPageCount());

  if (validOrder.length > 0) {
    const pages = await newDoc.copyPages(pdfDoc, validOrder);
    pages.forEach(p => newDoc.addPage(p));
  }

  return await newDoc.save();
}

/**
 * Converts images to PDF
 * Supports JPG and PNG
 */
export async function imagesToPDF(files: ArrayBuffer[], types: string[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const type = types[i];

    let image;
    try {
      if (type === 'image/jpeg' || type === 'image/jpg') {
        image = await pdfDoc.embedJpg(file);
      } else if (type === 'image/png') {
        image = await pdfDoc.embedPng(file);
      } else {
        console.warn(`Unsupported image type: ${type}`);
        continue;
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    } catch (e) {
      console.error("Failed to embed image", e);
    }
  }

  return await pdfDoc.save();
}

/**
 * Gets PDF metadata and basic info
 */
export async function getPDFInfo(file: ArrayBuffer) {
  const pdfDoc = await PDFDocument.load(file);
  return {
    pageCount: pdfDoc.getPageCount(),
    title: pdfDoc.getTitle() || '',
    author: pdfDoc.getAuthor() || '',
    subject: pdfDoc.getSubject() || '',
    creator: pdfDoc.getCreator() || '',
    keywords: pdfDoc.getKeywords() || '',
    producer: pdfDoc.getProducer() || '',
    creationDate: pdfDoc.getCreationDate(),
    modificationDate: pdfDoc.getModificationDate(),
  };
}

/**
 * Note: PDF thumbnail generation typically requires a canvas implementation
 * which is available in the browser via pdf.js.
 * This function is a placeholder/wrapper that hints at how to use pdf.js
 * for server-side or browser-side rendering.
 */
export async function extractTextFromPDF(file: ArrayBuffer): Promise<string> {
  // Using pdf-lib for basic text extraction is limited.
  // In a real production app with Next.js, we'd use pdfjs-dist on the server
  // or use an API route that handles the extraction.
  // For now, we'll return a placeholder to be implemented in the API routes
  // or components where pdfjs-dist is easier to use with DOM/Canvas if needed.
  return "Text extraction logic integrated in tool-specific components/API routes.";
}