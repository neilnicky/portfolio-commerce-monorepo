import type { FeaturedGridVm } from "@application/view-models/home.vm";
import { Container } from "@presentation/components/ui/Container";
import { MediaFrame } from "@presentation/components/ui/MediaFrame";
import { Reveal } from "@presentation/components/ui/Reveal";

/** Asymmetric "bento" editorial grid — one 21:9 lead frame + two square tiles. */
export function FeaturedGrid({ vm }: { vm: FeaturedGridVm }) {
  return (
    <section className="py-32">
      <Container size="full">
        <div className="grid grid-cols-12 gap-gutter">
          {/* Lead frame */}
          <div className="col-span-12 lg:col-span-8">
            <Reveal className="group mb-12">
              <MediaFrame src={vm.lead.imageSrc} alt={vm.lead.imageAlt} aspect="aspect-[21/9]" />
              <div className="border-b border-hairline py-8">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-body text-label-md uppercase tracking-widest text-on-surface-variant">
                      {vm.lead.kicker}
                    </span>
                    <h3 className="font-display text-headline-md">{vm.lead.title}</h3>
                  </div>
                  <span className="font-body text-label-md uppercase tracking-widest">{vm.lead.tag}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Square tiles */}
          <div className="col-span-12 space-y-12 lg:col-span-4">
            {vm.tiles.map((tile, i) => (
              <Reveal key={tile.id} delay={300 + i * 100} className="group block">
                <MediaFrame
                  src={tile.imageSrc}
                  alt={tile.imageAlt}
                  aspect="aspect-square"
                  duration="duration-500"
                  className="mb-4"
                />
                <div className="flex justify-between border-b border-hairline pb-4">
                  <h4 className="font-display text-headline-sm">{tile.title}</h4>
                  <span className="self-center font-body text-label-md uppercase opacity-60">
                    {tile.tag}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
