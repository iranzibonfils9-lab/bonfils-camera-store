import Header from "@/components/layout/Header";

const orders = [
  {
    id: "#ORD-1001",
    customer: "Customer Example",
    product: "6MP Smart CCTV Camera",
    quantity: 2,
    total: "180,000 RWF",
    status: "Pending",
    date: "24 Sep 2026",
  },
  {
    id: "#ORD-1002",
    customer: "Business Customer",
    product: "PTZ Dual-Lens Camera",
    quantity: 1,
    total: "115,000 RWF",
    status: "Confirmed",
    date: "23 Sep 2026",
  },
  {
    id: "#ORD-1003",
    customer: "Home Customer",
    product: "4G Solar Security Camera",
    quantity: 1,
    total: "110,000 RWF",
    status: "Delivered",
    date: "22 Sep 2026",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
};

export default function MerchantOrdersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS MERCHANT
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Orders
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                View and manage orders placed by customers through your
                merchant store.
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

      {/* STATS */}
      <section className="px-6 pt-10">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Orders</p>
            <p className="mt-2 text-2xl font-bold text-[#0B192C]">3</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">1</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Confirmed</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">1</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Delivered</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">1</p>
          </div>
        </div>
      </section>

      {/* ORDERS */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Orders from your customers.
              </p>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Quantity</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">
                          {order.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.date}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        {order.customer}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {order.product}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {order.quantity}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {order.total}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 p-5 md:hidden">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">
                        {order.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.date}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400">Customer</p>
                      <p className="font-semibold text-slate-800">
                        {order.customer}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Product</p>
                      <p className="font-semibold text-slate-800">
                        {order.product}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Quantity</span>
                      <span className="font-semibold">{order.quantity}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Total</span>
                      <span className="font-bold text-slate-900">
                        {order.total}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
                  >
                    View Order
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="mt-8 rounded-2xl bg-[#0B192C] p-7 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Order Management
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Manage every customer order from one place.
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              In the real marketplace, merchants will be able to confirm
              orders, update delivery status, communicate with customers and
              track their earnings from each order.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}