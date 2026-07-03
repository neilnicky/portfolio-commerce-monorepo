import type { WorksPageVm } from "@application/view-models/works-page.vm";
import { cn } from "@lib/cn";
import { Container } from "@presentation/components/ui/Container";
import { Reveal } from "@presentation/components/ui/Reveal";

/** Works page header — title, intro, and the category filter row. Presentational. */
export function WorksHeader({
  header,
  categories,
}: Pick<WorksPageVm, "header" | "categories">) {
  return (
    <Container className="mb-20 md:mb-32">
      <div className="max-w-4xl">
        <Reveal as="div">
          <h1 className="mb-8 font-display text-headline-lg-mobile leading-tight text-primary md:text-display-lg">
            {header.heading}
          </h1>
        </Reveal>
        <Reveal as="div" delay={100}>
          <p className="max-w-2xl font-body text-body-lg text-on-surface-variant">{header.intro}</p>
        </Reveal>
      </div>

      <Reveal as="div" delay={200} className="mt-16 flex flex-wrap gap-8 border-b border-hairline pb-6">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={cn(
              "pb-5 font-body text-label-md uppercase tracking-widest transition-colors",
              cat.active
                ? "border-b-2 border-primary text-primary"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            {cat.label}
          </button>
        ))}
      </Reveal>
    </Container>
  );
}
