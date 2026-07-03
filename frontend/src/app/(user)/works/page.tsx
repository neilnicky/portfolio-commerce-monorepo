import type { Metadata } from "next";
import { getWorksContent } from "@/content/works.content";
import { SiteShell } from "@presentation/layouts/SiteShell";
import { WorksView } from "@presentation/features/works/components/WorksView";

export const metadata: Metadata = {
  title: "Works | Midhun J Raj",
  description: "A curated anthology of frames — commercial, digital film, and photography.",
};

/** Works route — composition only. */
export default function WorksPage() {
  const vm = getWorksContent();
  return (
    <SiteShell active="works">
      <WorksView vm={vm} />
    </SiteShell>
  );
}
