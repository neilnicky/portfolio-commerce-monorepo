import type { WorksPageVm } from "@application/view-models/works-page.vm";
import { WorksHeader } from "./WorksHeader";
import { WorksGrid } from "./WorksGrid";
import { WorksCta } from "./WorksCta";

/** Works page composition. Pure — receives the page ViewModel, renders sections. */
export function WorksView({ vm }: { vm: WorksPageVm }) {
  return (
    <div className="pb-32 pt-24">
      <WorksHeader header={vm.header} categories={vm.categories} />
      <WorksGrid items={vm.items} />
      <WorksCta cta={vm.cta} />
    </div>
  );
}
