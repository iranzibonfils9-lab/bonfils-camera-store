import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";

export default async function MarketplaceCatalogPage() {
  // Fetch dynamic products from Prisma Database
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = [
    "All Categories",
    "CCTV Cameras",
    "Recorders",
    "Solar Cameras",
    "Storage",
    "Accessories",
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER BAR */}
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS B2B MARKETPLACE
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Equipment Catalog
              </h1>
              <p className="mt-1 text-slate-600">
                Explore authentic security hardware direct from supplier inventory.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">
                Live Products in Database: {products.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTER BAR */}
      <section className="border-b border-slate-200 bg-slate-100 px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <input
              type="text"
              placeholder="Search cameras, DVRs, storage..."
              className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                  idx === 0
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC PRODUCT GRID FROM DATABASE */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-lg font-bold text-slate-700">No products found in database.</p>
              <p className="mt-1 text-sm text-slate-500">Add products through the admin dashboard.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative flex h-52 items-center justify-center bg-slate-100 p-6 text-slate-400">
                    <span className="text-xs font-semibold">
                      [ Product Image Placeholder ]
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-700">
                      {product.brand}
                    </span>
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-semibold text-emerald-600">
                      {product.category}
                    </span>

                    <h3 className="mt-1 text-lg font-bold text-slate-900 line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                      {product.description || "High performance security equipment."}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Suggested Retail</p>
                        <p className="text-xl font-bold text-slate-900">
                          {product.suggestedRetail.toLocaleString()} RWF
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`/products/${product.id}`}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
                        >
                          Details
                        </a>
                        <button className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
                          + Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}