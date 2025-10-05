import ProfileMarkdown from "./components/ProfleMarkdown";
import ThemeToggle from "./components/ThemeToggle";
import SectionIndicators from "./components/SectionIndicators";
import ScrollNavigation from "./components/ScrollNavigation";
import { fetchMarkdownSections } from "./lib/fetch-markdown";

export default async function Home() {
  // Busca as seções do markdown (com cache)
  const sections = await fetchMarkdownSections();

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory transition-colors">
      {/* ThemeToggle fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Indicadores de seção */}
      <SectionIndicators totalSections={sections.length} />
      
      {/* Navegação com bordas neon */}
      <ScrollNavigation totalSections={sections.length} />
      
      {/* Container com scroll snap */}
      <ProfileMarkdown />
    </div>
  );
}
