import type { StoreProductVm } from "@application/view-models/store-page.vm";
import { Divider } from "@presentation/components/ui/Divider";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";
import { MediaFrame } from "@presentation/components/ui/MediaFrame";
import { AddToCartButton } from "./AddToCartButton";

/**
 * Presentational store product. Renders one of three footprints (half / feature
 * / third). The interactive purchase button is delegated to a client island.
 * The grid parent supplies the column span + `group`.
 */
export function StoreProductCard({ vm }: { vm: StoreProductVm }) {
  if (vm.span === "feature") {
    return (
      <div className="grid grid-cols-1 overflow-hidden border border-hairline bg-surface-container-lowest md:grid-cols-2">
        <div className="aspect-square md:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vm.imageSrc}
            alt={vm.imageAlt}
            className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
          />
        </div>
        <div className="flex flex-col justify-center p-12 md:p-20">
          {vm.eyebrow ? (
            <Eyebrow tracking="metadata-wide" className="mb-4">
              {vm.eyebrow}
            </Eyebrow>
          ) : null}
          <h3 className="mb-8 font-display text-headline-lg-mobile md:text-headline-lg">{vm.title}</h3>
          <p className="mb-12 font-body text-body-lg leading-relaxed text-on-surface-variant">
            {vm.description}
          </p>
          <div className="flex items-center gap-8">
            <AddToCartButton label={vm.cta} styleVariant="feature" />
            {vm.secondaryCta ? (
              <a
                href={vm.secondaryCta.href}
                className="border-b border-hairline-active pb-1 font-body text-label-md uppercase tracking-widest transition-colors hover:border-primary"
              >
                {vm.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (vm.span === "third") {
    return (
      <div>
        <MediaFrame src={vm.imageSrc} alt={vm.imageAlt} aspect="aspect-square" bordered={false} className="mb-6" />
        <h3 className="mb-2 font-display text-headline-sm">{vm.title}</h3>
        <p className="mb-4 font-body text-label-md uppercase tracking-widest text-on-surface-variant">
          {vm.metaLine}
        </p>
        <AddToCartButton label={vm.cta} styleVariant="add" />
      </div>
    );
  }

  // Default: half-width card.
  return (
    <div className="cursor-pointer">
      <MediaFrame src={vm.imageSrc} alt={vm.imageAlt} aspect="aspect-[16/10]" bordered={false} className="mb-6" />
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-2 font-display text-headline-sm">{vm.title}</h3>
          <p className="font-body text-body-md text-on-surface-variant">{vm.description}</p>
        </div>
        <span className="border border-hairline bg-primary/5 px-3 py-1 font-body text-label-md">{vm.price}</span>
      </div>
      <Divider className="mb-6" />
      <AddToCartButton label={vm.cta} styleVariant="purchase" />
    </div>
  );
}
