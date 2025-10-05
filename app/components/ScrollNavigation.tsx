'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollNavigationProps {
  totalSections: number;
}

export default function ScrollNavigation({ totalSections }: ScrollNavigationProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [attemptingUp, setAttemptingUp] = useState(false);
  const [attemptingDown, setAttemptingDown] = useState(false);
  
  // Use refs para valores que não precisam re-renderizar
  const lastWheelTimeRef = useRef(0);
  const currentSectionRef = useRef(0);

  const isAtTop = currentSection === 0;
  const isAtBottom = currentSection === totalSections - 1;
  
  // Mantém a ref atualizada com o currentSection
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id^="section-"]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setCurrentSection(index);
        }
      });
    };

    const scrollContainer = document.querySelector('.snap-y');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Detecta scroll rápido e pula múltiplas seções
  useEffect(() => {
    let wheelEvents: number[] = [];
    let isScrolling = false;
    let processingTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const timeDiff = now - lastWheelTimeRef.current;
      
      lastWheelTimeRef.current = now;
      
      // Se já está processando uma animação, ignora
      if (isScrolling) {
        return;
      }
      
      // Adiciona o timestamp atual ao array
      wheelEvents.push(now);
      
      // Remove eventos antigos (mais de 200ms)
      wheelEvents = wheelEvents.filter(time => now - time < 200);
      
      // Limpa o timeout anterior
      clearTimeout(processingTimeout);
      
      // Aguarda um pequeno intervalo para processar
      processingTimeout = setTimeout(() => {
        // Conta quantos eventos aconteceram nos últimos 200ms
        const recentEvents = wheelEvents.length;
        
        // Determina se é scroll rápido:
        // - 2+ eventos em menos de 100ms = scroll rápido moderado
        // - 3+ eventos em menos de 150ms = scroll muito rápido
        const eventsIn100ms = wheelEvents.filter(time => now - time < 100).length;
        const eventsIn150ms = wheelEvents.filter(time => now - time < 150).length;
        
        let sectionsToJump = 0;
        
        if (eventsIn100ms >= 2) {
          sectionsToJump = 1; // Pula 1 seção extra
        }
        if (eventsIn150ms >= 3) {
          sectionsToJump = 2; // Pula 2 seções extras
        }
        
        // Executa o scroll
        if (sectionsToJump > 0) {
          isScrolling = true;
          
          if (e.deltaY > 0) {
            // Scroll para baixo
            if (!isAtBottom) {
              const targetSection = Math.min(
                currentSectionRef.current + 1 + sectionsToJump,
                totalSections - 1
              );
              scrollToSection(targetSection);
            } else {
              setAttemptingDown(true);
              setTimeout(() => setAttemptingDown(false), 600);
            }
          } else {
            // Scroll para cima
            if (!isAtTop) {
              const targetSection = Math.max(
                currentSectionRef.current - 1 - sectionsToJump,
                0
              );
              scrollToSection(targetSection);
            } else {
              setAttemptingUp(true);
              setTimeout(() => setAttemptingUp(false), 600);
            }
          }
          
          // Limpa os eventos
          wheelEvents = [];
          
          // Libera após a animação
          setTimeout(() => {
            isScrolling = false;
          }, 400);
        } else {
          // Scroll normal - permite que o comportamento padrão aconteça
          // mas limpa eventos antigos
          wheelEvents = [];
        }
      }, 30); // Pequeno delay para agrupar eventos
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(processingTimeout);
    };
  }, [isAtTop, isAtBottom, totalSections]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (!isAtBottom) {
          scrollToSection(currentSection + 1);
        } else {
          setAttemptingDown(true);
          setTimeout(() => setAttemptingDown(false), 600);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (!isAtTop) {
          scrollToSection(currentSection - 1);
        } else {
          setAttemptingUp(true);
          setTimeout(() => setAttemptingUp(false), 600);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(totalSections - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, totalSections, isAtTop, isAtBottom]);

  const scrollToSection = (index: number) => {
    const section = document.getElementById(`section-${index}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTopClick = () => {
    if (!isAtTop) {
      scrollToSection(currentSection - 1);
    } else {
      setAttemptingUp(true);
      setTimeout(() => setAttemptingUp(false), 600);
    }
  };

  const handleBottomClick = () => {
    if (!isAtBottom) {
      scrollToSection(currentSection + 1);
    } else {
      setAttemptingDown(true);
      setTimeout(() => setAttemptingDown(false), 600);
    }
  };

  return (
    <>
      {/* Linha Neon Superior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-30 pointer-events-none"
      >
        {/* Linha neon */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: attemptingUp
              ? 'linear-gradient(90deg, transparent, #ef4444, transparent)'
              : !isAtTop
              ? 'linear-gradient(90deg, transparent, #3b82f6, transparent)'
              : 'transparent',
            boxShadow: attemptingUp
              ? '0 0 20px #ef4444, 0 0 40px #ef4444'
              : !isAtTop
              ? '0 0 20px #3b82f6, 0 0 40px #3b82f6'
              : 'none',
          }}
          animate={{
            opacity: attemptingUp 
              ? [0.4, 0.8, 0.4] 
              : !isAtTop 
              ? [0.6, 1, 0.6] 
              : 0,
            scaleY: attemptingUp ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: attemptingUp ? 0.6 : 2,
            repeat: attemptingUp ? 0 : Infinity,
            ease: attemptingUp ? [0.34, 1.56, 0.64, 1] : "easeInOut"
          }}
        />
        
        {/* Seta para cima - mais sutil */}
        <AnimatePresence>
          {!isAtTop && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 0.3, 
                y: 0,
              }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-3 left-1/2 -translate-x-1/2"
            >
              <motion.svg
                className={`w-5 h-5 ${attemptingUp ? 'text-red-500' : 'text-blue-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: attemptingUp 
                    ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))'
                    : 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))',
                }}
                animate={{ 
                  y: attemptingUp ? [0, -8, 0] : [0, -3, 0],
                  scale: attemptingUp ? [1, 0.9, 1] : 1,
                }}
                transition={{ 
                  duration: attemptingUp ? 0.6 : 2, 
                  repeat: Infinity,
                  ease: attemptingUp ? [0.34, 1.56, 0.64, 1] : "easeInOut"
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Área clicável invisível */}
        <div
          className="absolute top-0 left-0 right-0 h-20 cursor-pointer pointer-events-auto"
          onClick={handleTopClick}
        />
      </motion.div>

      {/* Linha Neon Inferior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
      >
        {/* Linha neon */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: attemptingDown
              ? 'linear-gradient(90deg, transparent, #ef4444, transparent)'
              : !isAtBottom
              ? 'linear-gradient(90deg, transparent, #3b82f6, transparent)'
              : 'transparent',
            boxShadow: attemptingDown
              ? '0 0 20px #ef4444, 0 0 40px #ef4444'
              : !isAtBottom
              ? '0 0 20px #3b82f6, 0 0 40px #3b82f6'
              : 'none',
          }}
          animate={{
            opacity: attemptingDown 
              ? [0.4, 0.8, 0.4] 
              : !isAtBottom 
              ? [0.6, 1, 0.6] 
              : 0,
            scaleY: attemptingDown ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: attemptingDown ? 0.6 : 2,
            repeat: attemptingDown ? 0 : Infinity,
            ease: attemptingDown ? [0.34, 1.56, 0.64, 1] : "easeInOut"
          }}
        />
        
        {/* Seta para baixo - mais sutil */}
        <AnimatePresence>
          {!isAtBottom && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 0.3, 
                y: 0,
              }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2"
            >
              <motion.svg
                className={`w-5 h-5 ${attemptingDown ? 'text-red-500' : 'text-blue-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: attemptingDown
                    ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))'
                    : 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))',
                }}
                animate={{ 
                  y: attemptingDown ? [0, 8, 0] : [0, 3, 0],
                  scale: attemptingDown ? [1, 0.9, 1] : 1,
                }}
                transition={{ 
                  duration: attemptingDown ? 0.6 : 2, 
                  repeat: Infinity,
                  ease: attemptingDown ? [0.34, 1.56, 0.64, 1] : "easeInOut"
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Área clicável invisível */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 cursor-pointer pointer-events-auto"
          onClick={handleBottomClick}
        />
      </motion.div>

      {/* Indicador de progresso */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 z-40 text-sm text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md"
      >
        {currentSection + 1} / {totalSections}
      </motion.div>
    </>
  );
}
