import Header from "@/components/layout/Header";

const customers = [
  {
    name: "Customer Example",
    phone: "078 XXX XXXX",
    orders: 4,
    spent: "420,000 RWF",
    lastOrder: "24 Sep 2026",
    status: "Active",
  },
  {
    name: "Business Customer",
    phone: "079 XXX XXXX",
    orders: 2,
    spent: "315,000 RWF",
    lastOrder: "23 Sep 2026",
    status: "Active",
  },
  {
    name: "Home Customer",
    phone: "072 XXX XXXX",
    orders: 1,
    spent: "110,000 RWF",
    lastOrder: "22 Sep 2026",
    status: "Active",
  },
];

export default function MerchantCustomersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS MERCHANT
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Customers
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                View customers who have purchased products from your store.
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

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* STATS */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="mt-2 text-3xl font-bold text-[#0B192C]">
                {customers.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Active Customers</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {customers.filter((customer) => customer.status === "Active").length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Customer Orders</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {customers.reduce(
                  (total, customer) => total + customer.orders,
                  0
                )}
              </p>
            </div>
          </div>

          {/* CUSTOMER LIST */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Customer List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your store's customer activity.
              </p>
            </div>

            {/* DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Orders</th>
                    <th className="px-6 py-4 font-semibold">Total Spent</th>
                    <th className="px-6 py-4 font-semibold">Last Order</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer.name}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B192C] font-bold text-emerald-400">
                            {customer.name.charAt(0)}
                          </div>

                          <span className="font-semibold text-slate-900">
                            {customer.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {customer.phone}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {customer.orders}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {customer.spent}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {customer.lastOrder}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="space-y-4 p-5 md:hidden">
              {customers.map((customer) => (
                <div
                  key={customer.name}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B192C] font-bold text-emerald-400">
                      {customer.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {customer.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {customer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Orders</span>
                      <span className="font-semibold">
                        {customer.orders}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Spent</span>
                      <span className="font-bold">
                        {customer.spent}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Order</span>
                      <span>{customer.lastOrder}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Status</span>
                      <span className="font-semibold text-emerald-600">
                        {customer.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRIVACY NOTE */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="font-bold text-slate-900">
              Customer privacy
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              In the real marketplace, customer information should only be
              shown to authorized merchants when necessary for fulfilling an
              order. Sensitive personal information should not be exposed
              unnecessarily.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}