import type { Metadata } from "next";
import { getPhilosophyContent } from "@/content/philosophy.content";
import { SiteShell } from "@presentation/layouts/SiteShell";
import { PhilosophyView } from "@presentation/features/philosophy/components/PhilosophyView";

export const metadata: Metadata = {
  title: "Philosophy | Midhun J Raj",
  description: "Creative ethos, expertise, and the atmospheric narrative behind the work.",
};

/** Philosophy route — composition only. */
export default function PhilosophyPage() {
  const vm = getPhilosophyContent();
  return (
    <SiteShell active="philosophy">
      <PhilosophyView vm={vm} />
    </SiteShell>
  );
}
