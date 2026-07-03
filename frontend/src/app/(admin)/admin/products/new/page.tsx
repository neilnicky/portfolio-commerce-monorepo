// Backend-gated admin route — never prerendered.
export const dynamic = "force-dynamic";

/** Create product — RHF + Zod (ProductFormSchema), asset uploaded directly to private R2. */
export default function NewProductPage() {
  return (
    <section className="max-w-lg">
      <h1 className="text-2xl font-semibold">New product</h1>
      {/* TODO: <ProductFormContainer /> — RHF + Zod, calls admin.createProduct command */}
    </section>
  );
}
