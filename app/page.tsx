import Image from "next/image";
import { GITHUB_PROFILE_IMAGE_URL, SITE_DESCRIPTION, SITE_NAME } from "./lib/constants";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome to {SITE_NAME}</h1>
      <p className="mt-4">{SITE_DESCRIPTION}</p>
      <Image
        src={GITHUB_PROFILE_IMAGE_URL}
        alt="Profile Picture"
        width={150}
        height={150}
        className="rounded-full mt-4"
      />
    </div>
  );
}
