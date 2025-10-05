'use client';

import { useEffect } from 'react';

/**
 * Componente que garante scroll inteligente:
 * - Em navegação nova (sem referrer ou link externo): começa do topo
 * - Ao recarregar (F5): mantém a posição
 * - Navegação do histórico: permite restauração natural
 */
export default function ScrollToTop() {
  useEffect(() => {
    // Configura scroll restoration como auto para permitir comportamento natural
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
    
    // Detecta se é uma navegação nova (não é reload)
    const isNewNavigation = !window.performance
      .getEntriesByType('navigation')
      .some((entry: any) => entry.type === 'reload' || entry.type === 'back_forward');
    
    // Detecta se veio de link externo ou direto
    const isExternalOrDirect = !document.referrer || 
      !document.referrer.includes(window.location.hostname);
    
    // Só reseta para o topo se for navegação nova E (externa OU direta)
    if (isNewNavigation && isExternalOrDirect) {
      // Pequeno delay para garantir que o DOM está pronto
      const timeoutId = setTimeout(() => {
        window.scrollTo(0, 0);
        const scrollContainer = document.querySelector('.snap-y');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return null;
}
