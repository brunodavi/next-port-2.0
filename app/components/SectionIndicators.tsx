'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SectionIndicatorsProps {
    totalSections: number;
}

export default function SectionIndicators({ totalSections }: SectionIndicatorsProps) {
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section[id^="section-"]');
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionBottom = sectionTop + rect.height;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    setActiveSection(index);
                }
            });
        };

        const scrollContainer = document.querySelector('.snap-y');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check

            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToSection = (index: number) => {
        const section = document.getElementById(`section-${index}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.div 
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 p-3 rounded-full backdrop-blur-md bg-white/70 dark:bg-gray-900/40 border border-blue-200/60 dark:border-blue-500/30"
            style={{
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            {Array.from({ length: totalSections }).map((_, index) => {
                const isActive = activeSection === index;
                
                return (
                    <motion.button
                        key={index}
                        onClick={() => scrollToSection(index)}
                        className="relative w-3 h-3 rounded-full"
                        style={
                            isActive
                                ? {
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                    transform: 'scale(1.25)',
                                }
                                : {
                                    background: 'rgba(107, 114, 128, 0.5)',
                                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                                    transform: 'scale(1)',
                                }
                        }
                        aria-label={`Ir para seção ${index + 1}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1
                        }}
                        transition={{ 
                            opacity: { duration: 0.3, delay: 0.6 + (index * 0.05) },
                            scale: { duration: 0.3 }
                        }}
                        whileHover={{ 
                            scale: 1.4,
                        }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: [0.5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
