/**
 * Dev Engine - Developer utility functions
 * Client-side only.
 */

// --- Formatters ---

export function formatJSON(text: string, indent = 2): string {
    try {
        const obj = JSON.parse(text);
        return JSON.stringify(obj, null, indent);
    } catch (e) {
        throw new Error("Invalid JSON");
    }
}

export function minifyJSON(text: string): string {
    try {
        const obj = JSON.parse(text);
        return JSON.stringify(obj);
    } catch (e) {
        throw new Error("Invalid JSON");
    }
}

export function formatXML(text: string): string {
    // Simple naive XML formatter for client side
    let formatted = '';
    let indent = '';
    const tab = '  ';
    text.split(/>\s*</).forEach(function (node) {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
        formatted += indent + '<' + node + '>\r\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
    });
    return formatted.substring(1, formatted.length - 3);
}

// --- Encoders / Decoders ---

export function toBase64(text: string): string {
    return btoa(text);
}

export function fromBase64(text: string): string {
    try {
        return atob(text);
    } catch (e) {
        throw new Error("Invalid Base64");
    }
}

export function encodeURL(text: string): string {
    return encodeURIComponent(text);
}

export function decodeURL(text: string): string {
    return decodeURIComponent(text);
}

export function htmlEncode(text: string): string {
    const el = document.createElement('div');
    el.innerText = text;
    return el.innerHTML;
}

export function htmlDecode(text: string): string {
    const el = document.createElement('div');
    el.innerHTML = text;
    return el.innerText;
}

// --- Cryptography (Web Crypto API) ---

export async function generateHash(text: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- JWT ---

export function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        throw new Error("Invalid JWT");
    }
}
