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
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            {Array.from({ length: totalSections }).map((_, index) => (
                <motion.button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeSection === index
                            ? 'bg-blue-500 scale-125'
                            : 'bg-gray-400 dark:bg-gray-600 hover:bg-blue-300 dark:hover:bg-blue-400'
                    }`}
                    aria-label={`Ir para seção ${index + 1}`}
                    title={`Seção ${index + 1}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                        duration: 0.3, 
                        delay: 0.6 + (index * 0.05) // Stagger effect
                    }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                />
            ))}
        </motion.div>
    );
}
