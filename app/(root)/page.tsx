import { Hero } from "@/features/home/landing/hero";
import { WorkspaceShowcase } from "@/features/home/landing/workspace";
import { LandingSections } from "@/features/home/landing/sections";

export default function Home() {
  return (
    <div className="font-body relative z-20 overflow-hidden">
      <Hero />
      <WorkspaceShowcase />
      <LandingSections />
    </div>
  );
}
