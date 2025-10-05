"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: "system", label: "Sistema", icon: "💻" },
    { value: "light", label: "Claro", icon: "☀️" },
    { value: "dark", label: "Escuro", icon: "🌙" },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  const handleThemeSelect = (value: string) => {
    setTheme(value);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Overlay transparente para fechar quando clicar fora */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-end gap-3">
        {/* Botões flutuantes que aparecem acima */}
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col gap-3 mb-2">
              {themes.filter(t => t.value !== theme).map((t, index) => (
                <motion.button
                  key={t.value}
                  onClick={() => handleThemeSelect(t.value)}
                  className="flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-md bg-gray-100/90 dark:bg-gray-900/90 border border-gray-300/40 dark:border-blue-500/30 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                  style={{
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 20, 
                    scale: 0,
                  }}
                  transition={{ 
                    duration: 0.2,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  aria-label={`Tema ${t.label}`}
                >
                  <span className="text-2xl">{t.icon}</span>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Botão principal flutuante */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-md bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 text-white shadow-lg"
          style={{
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Menu de temas"
        >
          <span className="text-3xl">{currentTheme.icon}</span>
        </motion.button>
      </div>
    </div>
  );
}
