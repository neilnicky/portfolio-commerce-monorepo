import { Fragment } from "react";
import type { WorksPageVm, WorkSpan } from "@application/view-models/works-page.vm";
import { cn } from "@lib/cn";
import { Container } from "@presentation/components/ui/Container";
import { Reveal } from "@presentation/components/ui/Reveal";
import { WorksGridItem } from "./WorksGridItem";

/** Layout footprint (column span + vertical rhythm) per project span. */
const LAYOUT: Record<WorkSpan, string> = {
  wide: "col-span-12",
  vertical: "col-span-12 md:col-span-5",
  horizontal: "col-span-12 md:col-span-7 md:mt-32",
  "square-center": "col-span-12 md:col-span-6 md:col-start-4 mt-12 md:mt-24",
  "thin-wide": "col-span-12 mt-12 md:mt-32",
};

/** Asymmetric 12-column editorial grid. Presentational. */
export function WorksGrid({ items }: Pick<WorksPageVm, "items">) {
  return (
    <Container>
      <div className="grid grid-cols-12 gap-gutter">
        {items.map((item, i) => (
          <Fragment key={item.work.id}>
            <Reveal className={cn("group", LAYOUT[item.span])}>
              <WorksGridItem item={item} />
            </Reveal>
            {/* Rhythm spacer after the opening wide frame. */}
            {i === 0 ? <div className="col-span-12 hidden h-12 md:block" /> : null}
          </Fragment>
        ))}
      </div>
    </Container>
  );
}
