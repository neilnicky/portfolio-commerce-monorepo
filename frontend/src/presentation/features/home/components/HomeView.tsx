import type { HomeVm } from "@application/view-models/home.vm";
import { HeroSection } from "./HeroSection";
import { PhilosophyTeaser } from "./PhilosophyTeaser";
import { SelectedWorks } from "./SelectedWorks";
import { FeaturedGrid } from "./FeaturedGrid";
import { StorePreview } from "./StorePreview";
import { ConnectSection } from "./ConnectSection";

/** Home page composition. Pure — receives the whole page ViewModel, renders sections. */
export function HomeView({ vm }: { vm: HomeVm }) {
  return (
    <>
      <HeroSection vm={vm.hero} />
      <PhilosophyTeaser vm={vm.philosophy} />
      <SelectedWorks vm={vm.selectedWorks} />
      <FeaturedGrid vm={vm.featured} />
      <StorePreview vm={vm.store} />
      <ConnectSection vm={vm.connect} />
    </>
  );
}
