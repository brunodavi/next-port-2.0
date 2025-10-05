import ProfileMarkdown from "./components/ProfleMarkdown";
import ThemeToggle from "./components/ThemeToggle";
import FloatingThemeToggle from "./components/FloatingThemeToggle";
import SectionIndicators from "./components/SectionIndicators";
import ScrollNavigation from "./components/ScrollNavigation";
import BehanceProjects from "./components/BehanceProjects";
import { fetchMarkdownSections } from "./lib/fetch-markdown";

export default async function Home() {
  // Busca as seções do markdown (com cache)
  const sections = await fetchMarkdownSections();
  
  // Total de seções = seções do markdown + 1 (Behance)
  const totalSections = sections.length + 1;

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory transition-colors">
      {/* ThemeToggle fixo no canto superior direito - oculto em mobile */}
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <ThemeToggle />
      </div>
      
      {/* Botão flutuante de tema - apenas em mobile */}
      <div className="md:hidden">
        <FloatingThemeToggle />
      </div>
      
      {/* Indicadores de seção - oculto em mobile */}
      <div className="hidden md:block">
        <SectionIndicators totalSections={totalSections} />
      </div>
      
      {/* Navegação com bordas neon */}
      <ScrollNavigation totalSections={totalSections} />
      
      {/* Container com scroll snap */}
      <ProfileMarkdown />
      
      {/* Seção customizada do Behance */}
      <BehanceProjects sectionIndex={sections.length} />
    </div>
  );
}
