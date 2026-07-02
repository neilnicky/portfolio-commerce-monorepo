import Link from "next/link";
import type { ProductVm } from "@application/view-models/product.vm";

/** Presentational — renders a ViewModel, zero data logic. Server-renderable. */
export function ProductCard({ vm }: { vm: ProductVm }) {
  return (
    <Link href={`/products/${vm.id}`} className="block rounded-lg border border-white/10 p-5">
      <h3 className="text-lg font-medium">{vm.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-white/60">{vm.description}</p>
      <p className="mt-3 text-sm font-semibold">{vm.priceText}</p>
    </Link>
  );
}
