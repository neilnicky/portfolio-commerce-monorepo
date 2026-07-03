import Link from "next/link";
import type { WorkVm } from "@application/view-models/work.vm";
import { Icon } from "@presentation/components/ui/Icon";
import { MediaFrame } from "@presentation/components/ui/MediaFrame";

/** 16:9 project preview card with hover zoom + reveal arrow. Presentational. */
export function WorkPreviewCard({ vm }: { vm: WorkVm }) {
  return (
    <Link href={vm.href ?? "#"} className="group block cursor-pointer">
      <MediaFrame src={vm.imageSrc} alt={vm.imageAlt} aspect="aspect-[16/9]" duration="duration-1000" className="mb-6" />
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-display text-headline-sm uppercase tracking-tight">{vm.title}</h3>
          <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant">
            {vm.meta}
          </p>
        </div>
        <Icon name="north_east" className="opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
