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
        <div className="flex flex-col items-center">
          <Image
            src={GITHUB_PROFILE_IMAGE_URL}
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full mt-4 border-4 border-gray-300 dark:border-gray-700"
          />
        </div>
        <div className="max-w-4xl mx-auto mt-8">
          <ProfileMarkdown />
        </div>
      </div>
    </div>
  );
}
