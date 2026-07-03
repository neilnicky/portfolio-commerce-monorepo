import type { ServiceVm } from "@application/view-models/philosophy-page.vm";
import { Icon } from "@presentation/components/ui/Icon";

/** Bento expertise card: icon + title + body, indexed. Presentational. */
export function ServiceCard({ vm }: { vm: ServiceVm }) {
  return (
    <div className="group flex h-[400px] flex-col justify-between border border-hairline p-8 transition-all duration-500 ease-cinematic hover:-translate-y-1.5 hover:border-hairline-strong hover:bg-surface-container md:p-12">
      <div>
        <Icon
          name={vm.icon}
          className="mb-8 text-[40px] text-primary transition-transform duration-500 ease-spring group-hover:-translate-y-1 group-hover:scale-110"
        />
        <h3 className="mb-4 font-display text-headline-sm text-primary">{vm.title}</h3>
        <p className="font-body text-body-md text-on-surface-variant">{vm.body}</p>
      </div>
      <span className="font-body text-label-md uppercase text-primary">{vm.index}</span>
    </div>
  );
}
