import Image from "next/image";
import { GITHUB_PROFILE_IMAGE_URL, GITHUB_PROFILE_README_URL } from "./lib/constants";
import ProfileMarkdown from "./components/ProfleMarkdown";
import ThemeToggle from "./components/ThemeToggle";
import SectionIndicators from "./components/SectionIndicators";
import { parseMarkdownIntoSections } from "./lib/markdown-sections";

export default async function Home() {
  // Busca o markdown para contar as seções
  const res = await fetch(GITHUB_PROFILE_README_URL, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
  const source = await res.text();
  const sections = await parseMarkdownIntoSections(source);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory transition-colors">
      {/* ThemeToggle fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Indicadores de seção */}
      <SectionIndicators totalSections={sections.length} />
      
      {/* Container com scroll snap */}
      <ProfileMarkdown />
    </div>
  );
}
