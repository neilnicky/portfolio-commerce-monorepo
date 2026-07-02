/** Exactly what a product component renders. Plain + serializable (crosses server→client). */
export interface ProductVm {
  id: string;
  title: string;
  description: string;
  priceText: string; // already formatted, e.g. "₹1,499"
  isBuyable: boolean;
  canEdit: boolean; // derived permission flag, computed here not in the component
}
