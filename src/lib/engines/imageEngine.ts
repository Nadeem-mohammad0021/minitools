/**
 * Image Engine - Client-side image processing using Browser APIs
 * Optimized for speed and zero server costs.
 */

/**
 * Compresses an image file by redrawing it to a canvas with quality adjustment
 */
export async function compressImage(file: File, quality = 0.7): Promise<Blob> {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    ctx.drawImage(img, 0, 0);

    // Canvas toBlob 'image/png' ignores quality parameter (lossless).
    // To actually compress, we must switch to 'image/jpeg' or 'image/webp'.
    // We default to 'image/jpeg' for compatibility and guaranteed size reduction.
    const outputFormat = file.type === 'image/png' ? 'image/jpeg' : file.type;

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Compression failed"));
            },
            outputFormat,
            quality
        );
    });
}

/**
 * Resizes an image to specific dimensions
 */
export async function resizeImage(file: File, width: number, height: number): Promise<Blob> {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, width, height);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Resize failed"));
        }, file.type);
    });
}

/**
 * Crops an image
 */
export async function cropImage(file: File, x: number, y: number, width: number, height: number): Promise<Blob> {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Crop failed"));
        }, file.type);
    });
}

/**
 * Flips an image horizontally or vertically
 */
export async function flipImage(file: File, direction: 'horizontal' | 'vertical'): Promise<Blob> {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (direction === 'horizontal') {
        ctx.scale(-1, 1);
    } else {
        ctx.scale(1, -1);
    }
    ctx.translate(-canvas.width / 2, -canvas.height / 2); // Center back
    // Actually draw image at 0,0 but since we translated center, we need to draw at -w/2, -h/2
    // Wait, standard flip logic:
    // Translate width, 0 and scale -1, 1 for horizontal
    // Let's stick to standard simpler transform

    // Reset transform just in case
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    } else {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
    }

    ctx.drawImage(img, 0, 0);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Flip failed"));
        }, file.type);
    });
}

/**
 * Converts image format (e.g., PNG to JPG)
 */
export async function convertImageFormat(
    file: File,
    format: 'image/jpeg' | 'image/png' | 'image/webp'
): Promise<Blob> {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Draw white background for JPG conversion to handle transparency
    if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Conversion failed"));
        }, format, 0.9);
    });
}

/**
 * Rotates an image by degrees
 */
export async function rotateImage(file: File, degrees: number): Promise<Blob> {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");

    // Swap dimensions for 90 or 270 degrees
    if (degrees % 180 !== 0) {
        canvas.width = img.height;
        canvas.height = img.width;
    } else {
        canvas.width = img.width;
        canvas.height = img.height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Rotation failed"));
        }, file.type);
    });
}
