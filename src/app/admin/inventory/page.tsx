import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";

export default async function AdminInventoryPage() {
  // Fetch real-time products from database including their active reseller listings count
  const centralStock = await prisma.product.findMany({
    include: {
      _count: {
        select: { merchantProducts: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalStockItems = centralStock.reduce(
    (total, item) => total + item.stockQuantity,
    0
  );
  const totalStockValue = centralStock.reduce(
    (total, item) => total + item.wholesalePrice * item.stockQuantity,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER SECTION */}
      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS SYSTEM ADMIN
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Central Warehouse Inventory
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Manage base supplier stock, set wholesale prices, and monitor stock distribution across resellers.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="/admin"
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
              >
                Back to Admin
              </a>
              <button className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                + Add Product to Stock
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS & DYNAMIC TABLE */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* STATS CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Unique SKUs in DB</p>
              <p className="mt-2 text-3xl font-bold text-[#0B192C]">
                {centralStock.length} Products
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Units in Stock</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {totalStockItems} Units
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Inventory Wholesale Value</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {totalStockValue.toLocaleString()} RWF
              </p>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Warehouse Stock Catalog
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Products listed here are automatically accessible to registered resellers.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search SKU or name..."
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">SKU & Name</th>
                    <th className="px-6 py-4 font-semibold">Wholesale Price</th>
                    <th className="px-6 py-4 font-semibold">Suggested Retail</th>
                    <th className="px-6 py-4 font-semibold">Available Stock</th>
                    <th className="px-6 py-4 font-semibold">Active Merchants</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {centralStock.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs font-semibold text-slate-400">{item.sku}</p>
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {item.wholesalePrice.toLocaleString()} RWF
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-emerald-600">
                        {item.suggestedRetail.toLocaleString()} RWF
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {item.stockQuantity} units
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                          {item._count.merchantProducts} Stores
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600">
                          Edit Stock / Price
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="space-y-4 p-5 md:hidden">
              {centralStock.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400">{item.sku}</p>
                      <h3 className="font-bold text-slate-900 mt-1">{item.name}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {item.stockQuantity} left
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Wholesale:</span>
                      <span className="font-bold">{item.wholesalePrice.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Resellers Active:</span>
                      <span className="font-semibold">{item._count.merchantProducts} Stores</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}