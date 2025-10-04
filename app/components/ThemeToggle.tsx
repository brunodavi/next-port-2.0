"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 p-1">
        <button className="px-3 py-1.5 rounded-md text-sm font-medium">
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
    <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 p-1 bg-gray-100 dark:bg-gray-800">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            theme === t.value
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          aria-label={`Tema ${t.label}`}
        >
          <span className="mr-1.5">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
