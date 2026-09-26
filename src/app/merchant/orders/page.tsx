import Header from "@/components/layout/Header";

const merchantOrders = [
  {
    id: "ORD-8921",
    customerName: "Eric Manzi",
    customerPhone: "078 812 3456",
    productName: "Hikvision 4MP Outdoor PTZ Camera",
    quantity: 2,
    retailPrice: 80000, // Retail price set by merchant
    wholesalePrice: 65000, // Wholesale price charged by BONFILS
    orderDate: "25 Sep 2026",
    status: "Delivered",
    paymentStatus: "Paid",
  },
  {
    id: "ORD-8910",
    customerName: "Kigali Tech Office",
    customerPhone: "079 123 4567",
    productName: "Dahua 8-Channel DVR System",
    quantity: 1,
    retailPrice: 135000,
    wholesalePrice: 110000,
    orderDate: "24 Sep 2026",
    status: "Processing",
    paymentStatus: "Paid",
  },
  {
    id: "ORD-8895",
    customerName: "Aline Umuhoza",
    customerPhone: "072 987 6543",
    productName: "Wireless Solar Security Camera 4G",
    quantity: 1,
    retailPrice: 115000,
    wholesalePrice: 90000,
    orderDate: "22 Sep 2026",
    status: "Pending",
    paymentStatus: "Unpaid",
  },
];

export default function MerchantOrdersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER SECTION */}
      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS MERCHANT
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Customer Orders
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Track and manage orders placed through your reseller storefront.
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

      {/* MAIN CONTENT */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* STATS OVERVIEW */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="mt-2 text-3xl font-bold text-[#0B192C]">
                {merchantOrders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Retail Sales</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {merchantOrders
                  .reduce(
                    (total, order) =>
                      total + order.retailPrice * order.quantity,
                    0
                  )
                  .toLocaleString()}{" "}
                RWF
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Estimated Total Profit</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {merchantOrders
                  .reduce(
                    (total, order) =>
                      total +
                      (order.retailPrice - order.wholesalePrice) *
                        order.quantity,
                    0
                  )
                  .toLocaleString()}{" "}
                RWF
              </p>
            </div>
          </div>

          {/* ORDERS TABLE */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Store Orders
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Orders fulfillment is handled directly by BONFILS central warehouse.
              </p>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Total Revenue</th>
                    <th className="px-6 py-4 font-semibold">Your Profit</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {merchantOrders.map((order) => {
                    const totalRevenue = order.retailPrice * order.quantity;
                    const profit =
                      (order.retailPrice - order.wholesalePrice) *
                      order.quantity;

                    return (
                      <tr
                        key={order.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5 font-bold text-slate-900">
                          {order.id}
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.customerPhone}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {order.productName}{" "}
                          <span className="font-bold">x{order.quantity}</span>
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-slate-900">
                          {totalRevenue.toLocaleString()} RWF
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-emerald-600">
                          +{profit.toLocaleString()} RWF
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              order.status === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : order.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="space-y-4 p-5 md:hidden">
              {merchantOrders.map((order) => {
                const totalRevenue = order.retailPrice * order.quantity;
                const profit =
                  (order.retailPrice - order.wholesalePrice) * order.quantity;

                return (
                  <div
                    key={order.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {order.id}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="font-semibold text-slate-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.customerPhone}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
                      <p className="text-slate-700">
                        <span className="font-semibold">Item:</span>{" "}
                        {order.productName} (x{order.quantity})
                      </p>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total:</span>
                        <span className="font-bold">
                          {totalRevenue.toLocaleString()} RWF
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Your Profit:</span>
                        <span className="font-bold text-emerald-600">
                          +{profit.toLocaleString()} RWF
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}