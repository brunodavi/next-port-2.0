import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { Root, RootContent, Heading, PhrasingContent } from 'mdast';

export interface MarkdownSection {
  heading: Heading;
  content: RootContent[];
  level: number;
}

/**
 * Processa o markdown e agrupa o conteúdo por seções baseado nos headings
 */
export async function parseMarkdownIntoSections(markdownContent: string): Promise<MarkdownSection[]> {
  // Parse o markdown para AST (Abstract Syntax Tree)
  const processor = unified().use(remarkParse);
  const tree = processor.parse(markdownContent) as Root;
  
  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | null = null;

  for (const node of tree.children) {
    // Se encontrar um heading, cria uma nova seção
    if (node.type === 'heading') {
      // Se já existe uma seção anterior, adiciona ao array
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Cria nova seção
      currentSection = {
        heading: node as Heading,
        content: [],
        level: node.depth,
      };
    } else {
      // Se ainda não temos uma seção, cria uma "seção introdutória"
      if (!currentSection) {
        currentSection = {
          heading: {
            type: 'heading',
            depth: 1,
            children: [{ type: 'text', value: '' }],
          } as Heading,
          content: [],
          level: 1,
        };
      }
      
      // Adiciona o conteúdo à seção atual
      currentSection.content.push(node);
    }
  }

  // Adiciona a última seção
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Converte o AST de volta para markdown
 */
export function astToMarkdown(nodes: RootContent[]): string {
  return nodes.map(nodeToMarkdown).join('\n\n');
}

/**
 * Processa conteúdo inline (phrasing content) para markdown
 */
function phrasingToMarkdown(child: PhrasingContent): string {
  if ('value' in child && child.type === 'text') {
    // Text node
    return child.value;
  }
  
  if (child.type === 'strong') {
    return `**${child.children.map(phrasingToMarkdown).join('')}**`;
  }
  
  if (child.type === 'emphasis') {
    return `*${child.children.map(phrasingToMarkdown).join('')}*`;
  }
  
  if (child.type === 'link') {
    const text = child.children.map(phrasingToMarkdown).join('');
    return `[${text}](${child.url})`;
  }
  
  if (child.type === 'image') {
    return `![${child.alt || ''}](${child.url}${child.title ? ` "${child.title}"` : ''})`;
  }
  
  if (child.type === 'html' && 'value' in child) {
    return child.value;
  }
  
  if ('children' in child) {
    return child.children.map(phrasingToMarkdown).join('');
  }
  
  return '';
}

function nodeToMarkdown(node: RootContent): string {
  switch (node.type) {
    case 'paragraph':
      return node.children.map(phrasingToMarkdown).join('');
    
    case 'list':
      const listItems = node.children.map((item: any, index: number) => {
        const content = item.children.map((child: any) => {
          if (child.type === 'paragraph') {
            return child.children.map(phrasingToMarkdown).join('');
          }
          return '';
        }).join('');
        
        if (node.ordered) {
          return `${index + 1}. ${content}`;
        }
        return `- ${content}`;
      }).join('\n');
      return listItems;
    
    case 'heading':
      const headingText = node.children.map(phrasingToMarkdown).join('');
      return `${'#'.repeat(node.depth)} ${headingText}`;
    
    case 'code':
      if (node.lang) {
        return `\`\`\`${node.lang}\n${node.value}\n\`\`\``;
      }
      return `\`\`\`\n${node.value}\n\`\`\``;
    
    case 'blockquote':
      return node.children.map((child: RootContent) => `> ${nodeToMarkdown(child)}`).join('\n');
    
    case 'html':
      return node.value;
    
    case 'thematicBreak':
      return '---';
    
    case 'image':
      return `![${node.alt || ''}](${node.url}${node.title ? ` "${node.title}"` : ''})`;
    
    case 'link':
      const linkText = node.children.map(phrasingToMarkdown).join('');
      return `[${linkText}](${node.url})`;
    
    default:
      return '';
  }
}

/**
 * Converte um heading AST para texto
 */
export function headingToText(heading: Heading): string {
  return heading.children.map(phrasingToMarkdown).join('');
}
