"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex rounded-2xl border border-gray-300/40 dark:border-blue-500/20 p-1 backdrop-blur-md bg-gray-100/60 dark:bg-gray-900/40">
        <button className="px-3 py-1.5 rounded-xl text-sm font-medium">
          Carregando...
        </button>
      </div>
    );
  }

  const themes = [
    { value: "system", label: "Sistema", icon: "💻" },
    { value: "light", label: "Claro", icon: "☀️" },
    { value: "dark", label: "Escuro", icon: "🌙" },
  ];

  return (
    <motion.div 
      className="inline-flex gap-2 rounded-2xl border border-gray-300/40 dark:border-blue-500/20 p-1.5 backdrop-blur-md bg-gray-100/60 dark:bg-gray-900/40 shadow-lg"
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {themes.map((t, index) => (
        <motion.button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden ${
            theme === t.value
              ? "text-white shadow-lg"
              : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50"
          }`}
          style={
            theme === t.value
              ? {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }
              : {}
          }
          aria-label={`Tema ${t.label}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === t.value && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
          <span className="mr-2 text-base">{t.icon}</span>
          <span className="relative z-10">{t.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
