import type { WorksGridItemVm, WorkSpan } from "@application/view-models/works-page.vm";
import { Icon } from "@presentation/components/ui/Icon";
import { MediaFrame } from "@presentation/components/ui/MediaFrame";

const ASPECT: Record<WorkSpan, string> = {
  wide: "aspect-[2.35/1]",
  vertical: "aspect-[4/5]",
  horizontal: "aspect-[16/9]",
  "square-center": "aspect-square",
  "thin-wide": "aspect-[3/1]",
};

/** Caption + media for a single works-grid cell. Layout footprint set by parent. */
export function WorksGridItem({ item }: { item: WorksGridItemVm }) {
  const { work, span } = item;

  const media =
    span === "wide" ? (
      <div className="relative overflow-hidden">
        <MediaFrame src={work.imageSrc} alt={work.imageAlt} aspect={ASPECT.wide} grayscale bordered={false} />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="border border-hairline-active px-3 py-1 font-body text-label-md uppercase text-primary">
            View Film
          </span>
        </div>
      </div>
    ) : (
      <MediaFrame src={work.imageSrc} alt={work.imageAlt} aspect={ASPECT[span]} grayscale bordered={false} />
    );

  return (
    <>
      {media}

      {span === "wide" ? (
        <div className="mt-6 flex items-baseline justify-between">
          <div>
            <h3 className="mb-1 font-display text-headline-sm text-primary">{work.title}</h3>
            <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant">
              {work.meta}
            </p>
          </div>
          <Icon name="arrow_outward" className="text-primary-fixed-dim" />
        </div>
      ) : span === "thin-wide" ? (
        <div className="mt-6 flex items-start gap-12">
          <div className="flex-1">
            <h3 className="mb-1 font-display text-headline-sm text-primary">{work.title}</h3>
            {work.description ? (
              <p className="mt-4 max-w-xl font-body text-body-md text-on-surface-variant">
                {work.description}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant">
              {work.meta}
            </p>
            {work.role ? (
              <p className="mt-2 font-body text-label-md text-primary">{work.role}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={`mt-6 ${span === "square-center" ? "text-center" : ""}`}>
          <h3 className="mb-1 font-display text-headline-sm text-primary">{work.title}</h3>
          <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant">
            {work.meta}
          </p>
        </div>
      )}
    </>
  );
}
