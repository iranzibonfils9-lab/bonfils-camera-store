import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";

export default async function MerchantProductsPage() {
  // Fetch merchant store (using the seeded default merchant store)
  const store = await prisma.store.findFirst({
    where: { slug: "bonfils-tropical" },
    include: {
      merchantProducts: true,
    },
  });

  // Fetch all available central stock from BONFILS Supplier Warehouse
  const bonfilsInventory = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Create a map of listed product IDs and custom retail prices for this store
  const listedMap = new Map(
    store?.merchantProducts.map((mp) => [mp.productId, mp.retailPrice]) || []
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER SECTION */}
      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS B2B MARKETPLACE
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Supplier Product Catalog
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Browse products available in BONFILS central inventory. Add items to your store catalog and set your custom retail selling price.
              </p>
            </div>

            <a
              href="/merchant"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CATALOG CONTENT */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold text-slate-900">
              Available Supplier Stock ({bonfilsInventory.length})
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search products..."
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {bonfilsInventory.map((item) => {
              const isAdded = listedMap.has(item.id);
              const customPrice = listedMap.get(item.id) || item.suggestedRetail;
              const profitMargin = customPrice - item.wholesalePrice;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {item.category}
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-slate-900">
                        {item.name}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isAdded
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isAdded ? "In My Store" : "Not Added"}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-sm">
                    <div>
                      <p className="text-slate-500">BONFILS Wholesale Price</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {item.wholesalePrice.toLocaleString()} RWF
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Available Stock</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {item.stockQuantity} units
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Your Retail Price</p>
                      <p className="mt-1 font-bold text-emerald-600">
                        {isAdded
                          ? `${customPrice.toLocaleString()} RWF`
                          : `${item.suggestedRetail.toLocaleString()} RWF (Suggested)`}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Est. Profit / Sale</p>
                      <p className="mt-1 font-bold text-blue-600">
                        +{profitMargin.toLocaleString()} RWF
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    {isAdded ? (
                      <>
                        <button className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                          Edit Selling Price
                        </button>
                        <button className="w-full rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                          Remove from Store
                        </button>
                      </>
                    ) : (
                      <button className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                        + Add to My Reseller Store
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}