import type { StorePreviewItemVm } from "@application/view-models/home.vm";
import { EditorialButton } from "@presentation/components/ui/EditorialButton";

/** Digital-product teaser card with a ghosted "film-slate" backdrop word. */
export function StorePreviewCard({ vm }: { vm: StorePreviewItemVm }) {
  return (
    <div className="group border border-hairline-faint bg-surface p-8 transition-all duration-500 hover:border-hairline-strong">
      <div className="relative mb-8 flex aspect-video items-center justify-center overflow-hidden bg-surface-container-high">
        <span className="font-display text-body-lg text-primary/5 transition-transform duration-700 group-hover:scale-110">
          {vm.backdropWord}
        </span>
        <div className="absolute inset-0 border-[24px] border-surface" />
      </div>
      <h3 className="mb-2 font-display text-headline-sm uppercase tracking-tighter">{vm.title}</h3>
      <p className="mb-8 h-12 overflow-hidden font-body text-body-md text-on-surface-variant">
        {vm.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-display text-headline-sm">{vm.price}</span>
        <EditorialButton href={vm.cta.href} className="px-6 py-2">
          {vm.cta.label}
        </EditorialButton>
      </div>
    </div>
  );
}
