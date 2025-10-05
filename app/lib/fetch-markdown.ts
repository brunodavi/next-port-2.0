import { GITHUB_PROFILE_README_URL } from "./constants";
import { parseMarkdownIntoSections, type MarkdownSection } from "./markdown-sections";

/**
 * Cache do markdown para evitar múltiplas requisições
 */
let cachedMarkdown: string | null = null;
let cachedSections: MarkdownSection[] | null = null;

/**
 * Busca o markdown do GitHub e faz cache
 */
export async function fetchMarkdown(): Promise<string> {
  if (cachedMarkdown) {
    return cachedMarkdown;
  }

  const res = await fetch(GITHUB_PROFILE_README_URL, {
    headers: {
      'Cache-Control': 'no-cache'
    },
    next: {
      revalidate: 3600 // Revalida a cada 1 hora
    }
  });

  cachedMarkdown = await res.text();
  return cachedMarkdown;
}

/**
 * Busca e processa o markdown em seções com cache
 */
export async function fetchMarkdownSections(): Promise<MarkdownSection[]> {
  if (cachedSections) {
    return cachedSections;
  }

  const markdown = await fetchMarkdown();
  cachedSections = await parseMarkdownIntoSections(markdown);
  return cachedSections;
}

/**
 * Limpa o cache (útil para desenvolvimento)
 */
export function clearMarkdownCache() {
  cachedMarkdown = null;
  cachedSections = null;
}
