import Header from "@/components/layout/Header";

const stats = [
  {
    title: "Total Orders",
    value: "0",
    description: "All your orders",
    icon: "🛒",
  },
  {
    title: "Pending Orders",
    value: "0",
    description: "Orders being processed",
    icon: "⏳",
  },
  {
    title: "Completed Orders",
    value: "0",
    description: "Successfully delivered",
    icon: "✅",
  },
  {
    title: "Total Spent",
    value: "0 RWF",
    description: "Your marketplace spending",
    icon: "💰",
  },
];

const accountActions = [
  {
    title: "Browse Products",
    description: "Find cameras and security equipment.",
    href: "/products",
    icon: "📦",
  },
  {
    title: "My Orders",
    description: "Track your purchases and order status.",
    href: "#",
    icon: "🛒",
  },
  {
    title: "Saved Products",
    description: "View products you saved for later.",
    href: "#",
    icon: "❤️",
  },
  {
    title: "My Profile",
    description: "Manage your personal account information.",
    href: "#",
    icon: "👤",
  },
];

export default function BuyerDashboard() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS CUSTOMER
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Buyer Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Manage your purchases, orders and account from one place.
              </p>
            </div>

            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-[#0B192C] px-5 py-3 font-semibold text-white transition hover:bg-[#1E3E62]"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  {stat.icon}
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#0B192C]">
                  {stat.value}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* RECENT ORDERS */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest marketplace purchases will appear here.
              </p>
            </div>

            <div className="p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🛒
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No orders yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Once you purchase a security product, your order history and
                delivery status will appear here.
              </p>

              <a
                href="/products"
                className="mt-6 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
              >
                Browse Products
              </a>
            </div>
          </div>

          {/* ACCOUNT ACTIONS */}
          <div className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">
                My Account
              </h2>

              <p className="mt-1 text-slate-500">
                Manage your marketplace account.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {accountActions.map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-emerald-50">
                    {action.icon}
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {action.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* SHOPPING CTA */}
          <div className="mt-10 rounded-3xl bg-[#0B192C] p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              BONFILS Marketplace
            </p>

            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Looking for reliable security equipment?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Explore CCTV cameras, NVR recorders, PTZ cameras, wireless
              systems and other security equipment from BONFILS merchants.
            </p>

            <a
              href="/products"
              className="mt-7 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Explore Marketplace
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}