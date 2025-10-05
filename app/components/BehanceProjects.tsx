'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { AnimatedHeading, AnimatedContent } from './AnimatedContent';

interface BehanceProject {
  title: string;
  link: string;
  guid: string;
  description: string;
  image: string;
  pubDate: string;
}

/**
 * Formata a data para o formato brasileiro
 */
function formatBrazilianDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export default function BehanceProjects({ sectionIndex }: { sectionIndex: number }) {
  const [projects, setProjects] = useState<BehanceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/behance');
        if (!response.ok) {
          throw new Error('Falha ao buscar projetos');
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <AnimatedSection index={sectionIndex} sectionId={`section-${sectionIndex}`}>
      <div className="max-w-5xl w-full space-y-8">
        <AnimatedHeading className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Meus Projetos
        </AnimatedHeading>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">
            <p>Erro ao carregar projetos: {error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>Nenhum projeto encontrado.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <AnimatedContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.a
                  key={project.guid}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl overflow-hidden backdrop-blur-md bg-white/70 dark:bg-gray-900/40 border border-blue-200/50 dark:border-blue-500/20 transition-all duration-300 ease-out"
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    y: -8,
                    transition: { 
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1]
                    }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={(e) => {
                    const element = e.currentTarget as HTMLElement;
                    if (!element) return;
                    const isDark = document.documentElement.classList.contains('dark');
                    if (isDark) {
                      element.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                      element.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.12), 0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                    } else {
                      element.style.borderColor = 'rgba(156, 163, 175, 0.6)';
                      element.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onHoverEnd={(e) => {
                    const element = e.currentTarget as HTMLElement;
                    if (!element) return;
                    const isDark = document.documentElement.classList.contains('dark');
                    if (isDark) {
                      element.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    } else {
                      element.style.borderColor = 'rgba(209, 213, 219, 0.4)';
                    }
                    element.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {/* Imagem do projeto */}
                  <div className="relative w-full aspect-[404/316] overflow-hidden bg-blue-50/60 dark:bg-gray-800/50">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <span className="text-4xl">🎨</span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo do card */}
                  <div className="p-4 space-y-2">
                    {/* Título */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 ease-out line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Descrição */}
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Data de publicação */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                      {formatBrazilianDate(project.pubDate)}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </AnimatedContent>
        )}
      </div>
    </AnimatedSection>
  );
}
