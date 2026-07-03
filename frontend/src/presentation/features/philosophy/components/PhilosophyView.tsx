import type { PhilosophyPageVm } from "@application/view-models/philosophy-page.vm";
import { PhilosophyHero } from "./PhilosophyHero";
import { CreativeEthos } from "./CreativeEthos";
import { ExpertiseGrid } from "./ExpertiseGrid";
import { PhilosophyCta } from "./PhilosophyCta";

/** Philosophy page composition. Pure — receives the page ViewModel. */
export function PhilosophyView({ vm }: { vm: PhilosophyPageVm }) {
  return (
    <>
      <PhilosophyHero hero={vm.hero} />
      <CreativeEthos ethos={vm.ethos} />
      <ExpertiseGrid expertise={vm.expertise} />
      <PhilosophyCta cta={vm.cta} />
    </>
  );
}
