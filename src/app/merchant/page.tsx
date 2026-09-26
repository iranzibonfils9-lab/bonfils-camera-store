import Header from "@/components/layout/Header";

const quickLinks = [
  {
    title: "Products",
    description: "Manage your store inventory, pricing, and stock status.",
    href: "/merchant/products",
    badge: "Catalog",
  },
  {
    title: "Orders",
    description: "Track customer orders, fulfillments, and delivery status.",
    href: "/merchant/orders",
    badge: "Sales",
  },
  {
    title: "Customers",
    description: "View customer profiles, purchase history, and contact details.",
    href: "/merchant/customers",
    badge: "CRM",
  },
  {
    title: "Store Settings",
    description: "Customize your store profile, branding, and contact details.",
    href: "/merchant/settings",
    badge: "Profile",
  },
  {
    title: "Withdrawals",
    description: "Manage your payouts, transaction logs, and wallet balance.",
    href: "/merchant/withdraw",
    badge: "Payouts",
  },
  {
    title: "Public Store",
    description: "Preview how customers see your store front.",
    href: "/merchant/store",
    badge: "Live View",
  },
];

export default function MerchantDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HERO SECTION */}
      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS CAMERA STORE
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Merchant Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Welcome back! Manage your products, view latest sales, track customer activity, and update store settings.
              </p>
            </div>

            <a
              href="/merchant/products/new"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 text-center"
            >
              + Add New Product
            </a>
          </div>
        </div>
      </section>

      {/* METRICS / STATS */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Sales</p>
              <p className="mt-2 text-3xl font-bold text-[#0B192C]">845,000 RWF</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">7</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">3</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Available Balance</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">530,000 RWF</p>
            </div>
          </div>

          {/* QUICK NAVIGATION MODULES */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Management Modules
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a section below to manage your store operations.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link) => (
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