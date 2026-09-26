import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";

export default async function AdminMerchantsPage() {
  // Fetch real stores and merchant users from Prisma Database
  const registeredMerchants = await prisma.store.findMany({
    include: {
      merchant: true,
      _count: {
        select: {
          merchantProducts: true,
          orders: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
                Merchant Network
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Manage registered resellers, review application requests, and track store performance.
              </p>
            </div>

            <a
              href="/admin"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
            >
              Back to Admin
            </a>
          </div>
        </div>
      </section>

      {/* STATS & TABLE */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* STATS OVERVIEW */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Registered Stores in DB</p>
              <p className="mt-2 text-3xl font-bold text-[#0B192C]">
                {registeredMerchants.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Active Resellers</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {registeredMerchants.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Pending Approval</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                0
              </p>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Reseller Network Directory
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Overview of all merchant partners operating on the platform.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search merchant or store..."
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Store & Owner</th>
                    <th className="px-6 py-4 font-semibold">Phone & Email</th>
                    <th className="px-6 py-4 font-semibold">Catalog Items</th>
                    <th className="px-6 py-4 font-semibold">Total Orders</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {registeredMerchants.map((store) => (
                    <tr
                      key={store.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">
                          {store.storeName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Owner: {store.merchant.name}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        <p>{store.phone || store.merchant.phone || "N/A"}</p>
                        <p className="text-xs text-slate-400">{store.merchant.email}</p>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {store._count.merchantProducts} items
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {store._count.orders}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          Active
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600">
                          Inspect Store
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="space-y-4 p-5 md:hidden">
              {registeredMerchants.map((store) => (
                <div
                  key={store.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {store.storeName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {store.merchant.name} ({store.merchant.email})
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Listed Items:</span>
                      <span className="font-semibold">{store._count.merchantProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Orders:</span>
                      <span className="font-bold text-emerald-600">
                        {store._count.orders}
                      </span>
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