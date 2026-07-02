interface PageProps {
  params: Promise<{ id: string }>;
}

/** Edit product — same RHF + Zod form, calls admin.updateProduct command. */
export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <section className="max-w-lg">
      <h1 className="text-2xl font-semibold">Edit product</h1>
      <p className="mt-1 text-sm text-white/50">{id}</p>
      {/* TODO: <ProductFormContainer productId={id} /> */}
    </section>
  );
}
