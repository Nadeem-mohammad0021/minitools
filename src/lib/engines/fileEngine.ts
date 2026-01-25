/**
 * File Engine - General file operations
 * ZIP, Validation, etc.
 */

import JSZip from 'jszip';

export async function createZip(files: File[]): Promise<Blob> {
    const zip = new JSZip();

    files.forEach(file => {
        zip.file(file.name, file);
    });

    return await zip.generateAsync({ type: 'blob' });
}

export function getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
