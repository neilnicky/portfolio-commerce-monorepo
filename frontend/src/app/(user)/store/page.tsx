import type { Metadata } from "next";
import { getStoreContent } from "@/content/store.content";
import { SiteShell } from "@presentation/layouts/SiteShell";
import { StoreView } from "@presentation/features/store/components/StoreView";

export const metadata: Metadata = {
  title: "Store | Steal My Stuff — Midhun J Raj",
  description: "Post-production assets, LUTs, presets, and creative templates for the visual auteur.",
};

/** Store route — composition only. */
export default function StorePage() {
  const vm = getStoreContent();
  return (
    <SiteShell active="store">
      <StoreView vm={vm} />
    </SiteShell>
  );
}
