import type { ProductVm } from "@application/view-models/product.vm";
import { ProductCard } from "./ProductCard";

/** Presentational — props-only, server-renderable. */
export function ProductList({ items }: { items: ProductVm[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-white/50">No products yet.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((vm) => (
        <ProductCard key={vm.id} vm={vm} />
      ))}
    </div>
  );
}
