import Header from "@/components/layout/Header";

const adminQuickLinks = [
  {
    title: "Central Inventory",
    description: "Manage wholesale products, stock levels, and supplier pricing.",
    href: "/admin/inventory",
    badge: "Supplier Stock",
  },
  {
    title: "Merchant Network",
    description: "Approve new resellers, inspect merchant stores, and view sales.",
    href: "/admin/merchants",
    badge: "Resellers",
  },
  {
    title: "Platform Orders",
    description: "Overview of all orders across all active merchant storefronts.",
    href: "/admin/orders",
    badge: "Fulfillment",
  },
  {
    title: "Payouts & Commissions",
    description: "Process merchant balance withdrawals and calculate net profits.",
    href: "/admin/payouts",
    badge: "Finance",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* ADMIN HERO HEADER */}
      <section className="border-b border-slate-200 bg-[#0B192C] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
            BONFILS SYSTEM ADMIN
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Master Management Control
              </h1>

              <p className="mt-2 max-w-2xl text-slate-300">
                Monitor platform-wide transactions, active resellers, central warehouse inventory, and system commissions.
              </p>
            </div>

            <a
              href="/admin/inventory/new"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-500 text-center"
            >
              + Add Central Stock Item
            </a>
          </div>
        </div>
      </section>

      {/* METRICS / STATS OVERVIEW */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Gross Platform Revenue</p>
              <p className="mt-2 text-3xl font-extrabold text-[#0B192C]">
                4,250,000 RWF
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">BONFILS Wholesale Revenue</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                3,400,000 RWF
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Active Resellers</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-600">
                12 Merchants
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Pending Payouts</p>
              <p className="mt-2 text-3xl font-extrabold text-amber-600">
                850,000 RWF
              </p>
            </div>
          </div>

          {/* ADMIN MANAGEMENT MODULES */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Admin Operations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select an option below to manage central operations.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {adminQuickLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                      {link.badge}
                    </span>
                    <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-emerald-600">
                    {link.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}