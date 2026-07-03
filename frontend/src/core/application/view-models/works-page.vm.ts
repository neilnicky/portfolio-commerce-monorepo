import type { WorkVm, WorkCategoryVm } from "./work.vm";

/** Render-ready shape for the Works page. */

/** Layout footprint for a project inside the asymmetric editorial grid. */
export type WorkSpan = "wide" | "vertical" | "horizontal" | "square-center" | "thin-wide";

export interface WorksGridItemVm {
  work: WorkVm;
  span: WorkSpan;
}

export interface WorksPageVm {
  header: {
    heading: string;
    intro: string;
  };
  categories: WorkCategoryVm[];
  items: WorksGridItemVm[];
  cta: {
    heading: string;
    button: { label: string; href: string };
  };
}
