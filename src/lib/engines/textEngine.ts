/**
 * Text Engine - Pure strings/regex operations
 * No heavy dependencies needed.
 */

// --- Analysis ---

export function wordCount(text: string): number {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

export function characterCount(text: string, includeSpaces = true): number {
    if (includeSpaces) return text.length;
    return text.replace(/\s/g, '').length;
}

export function sentenceCount(text: string): number {
    if (!text.trim()) return 0;
    return text.split(/[.!?]+/).filter(Boolean).length;
}

export function startCaseCount(text: string): number {
    if (!text.trim()) return 0;
    return text.split(/\s+/).length;
}

// --- Transformation ---

export function convertCase(text: string, type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab'): string {
    switch (type) {
        case 'upper':
            return text.toUpperCase();
        case 'lower':
            return text.toLowerCase();
        case 'title':
            return text.replace(
                /\w\S*/g,
                (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        case 'sentence':
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        case 'camel':
            return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        case 'snake':
            return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || text;
        case 'kebab':
            return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || text;
        default:
            return text;
    }
}

export function removeLineBreaks(text: string): string {
    return text.replace(/(\r\n|\n|\r)/gm, " ");
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function removeDuplicateLines(text: string): string {
    const lines = text.split(/\r?\n/);
    const uniqueLines = new Set(lines);
    return Array.from(uniqueLines).join('\n');
}

export function sortLines(text: string, direction: 'asc' | 'desc' | 'random' = 'asc'): string {
    const lines = text.split(/\r?\n/);
    if (direction === 'asc') return lines.sort().join('\n');
    if (direction === 'desc') return lines.sort().reverse().join('\n');
    return lines.sort(() => Math.random() - 0.5).join('\n');
}

// --- Generation ---

export function generateLoremIpsum(paragraphs: number = 3): string {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    // Only prepend "Lorem ipsum..." to the first paragraph usually, but simple repetition is fine for MVP.
    // For variety, we can just repeat the block.
    return Array(paragraphs).fill(lorem).join("\n\n");
}
