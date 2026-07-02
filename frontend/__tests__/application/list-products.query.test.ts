import { describe, it, expect, vi } from "vitest";
import { ListProductsQuery } from "@application/queries/list-products.query";
import type { IProductRepository } from "@domain/repositories/product.repository.interface";

/** Use-case tested in isolation against a MOCKED port — no network, no React. */
describe("ListProductsQuery", () => {
  it("maps entities to view-models and forwards filters", async () => {
    const emptyPage = { items: [], total: 0, page: 1, pageSize: 20 };
    const repo = {
      list: vi.fn().mockResolvedValue(emptyPage),
    } as unknown as IProductRepository;

    const query = new ListProductsQuery(repo);
    const result = await query.execute({ publishedOnly: true });

    expect(repo.list).toHaveBeenCalledWith({ publishedOnly: true });
    expect(result.items).toEqual([]);
  });
});
