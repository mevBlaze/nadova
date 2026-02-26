export { cn } from './cn';

// Format date for display
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

// Parse markdown-like references
export function parseReferences(text: string): { title: string; url: string }[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const refs: { title: string; url: string }[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    refs.push({ title: match[1], url: match[2] });
  }
  return refs;
}
