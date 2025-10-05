import { NextResponse } from 'next/server';

interface BehanceProject {
  title: string;
  link: string;
  guid: string;
  description: string;
  image: string;
  pubDate: string;
}

/**
 * Extrai o conteúdo de uma tag CDATA
 */
function extractCDATA(text: string): string {
  const cdataMatch = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return cdataMatch ? cdataMatch[1].trim() : text.trim();
}

/**
 * Extrai a URL da imagem da descrição HTML
 */
function extractImage(html: string): string {
  const imgMatch = html.match(/src='([^']+)'/);
  return imgMatch ? imgMatch[1] : '';
}

/**
 * Extrai o texto da descrição, removendo a tag img
 */
function extractDescription(html: string): string {
  const descMatch = html.replace(/<img[^>]*>/g, '').replace(/<br\s*\/?>/g, '').trim();
  return descMatch || '';
}

/**
 * Parseia o XML do RSS do Behance
 */
function parseRSS(xml: string): BehanceProject[] {
  const projects: BehanceProject[] = [];
  
  // Regex para extrair todos os items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = xml.matchAll(itemRegex);
  
  for (const itemMatch of items) {
    const itemContent = itemMatch[1];
    
    // Extrai cada campo
    const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const guidMatch = itemContent.match(/<guid>([\s\S]*?)<\/guid>/);
    const descriptionMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
    const contentMatch = itemContent.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    
    if (titleMatch && linkMatch) {
      const title = extractCDATA(titleMatch[1]);
      const link = extractCDATA(linkMatch[1]);
      const guid = guidMatch ? extractCDATA(guidMatch[1]) : link;
      const descriptionHTML = descriptionMatch ? extractCDATA(descriptionMatch[1]) : '';
      const contentHTML = contentMatch ? extractCDATA(contentMatch[1]) : descriptionHTML;
      const pubDate = pubDateMatch ? extractCDATA(pubDateMatch[1]) : '';
      
      const image = extractImage(contentHTML || descriptionHTML);
      const description = extractDescription(contentHTML || descriptionHTML);
      
      projects.push({
        title,
        link,
        guid,
        description,
        image,
        pubDate,
      });
    }
  }
  
  return projects;
}

export async function GET() {
  try {
    const response = await fetch('https://www.behance.net/feeds/user?username=brunodavi2', {
      next: { revalidate: 3600 } // Revalida a cada 1 hora
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Behance RSS feed');
    }
    
    const xml = await response.text();
    const projects = parseRSS(xml);
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching Behance projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Behance projects' },
      { status: 500 }
    );
  }
}
