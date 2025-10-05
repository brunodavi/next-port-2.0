import Image from "next/image";
import { GITHUB_PROFILE_IMAGE_URL } from "./lib/constants";
import ProfileMarkdown from "./components/ProfleMarkdown";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="max-w-4xl mx-auto mt-8">
          <ProfileMarkdown />
        </div>
      </div>
    </div>
  );
}
