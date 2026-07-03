/** A single portfolio project, render-ready. Shared by the home preview and the works grid. */

export interface WorkVm {
  id: string;
  title: string;
  /** Pre-formatted metadata line, e.g. "Documentary Short • 2024". */
  meta: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional long description (used by the wide editorial rows on the works page). */
  description?: string;
  /** Optional role credit, e.g. "Director / Cinematographer". */
  role?: string;
  href?: string;
}

export interface WorkCategoryVm {
  label: string;
  active?: boolean;
}
