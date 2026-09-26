export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function MerchantOrdersPage() {
  const merchantStore = await prisma.store.findFirst();

  const orders = await prisma.order.findMany({
    where: { storeId: merchantStore?.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Server Action: Update Order Status
  async function updateOrderStatus(formData: FormData) {
    "use server";

    const orderId = formData.get("orderId") as string;
    const newStatus = formData.get("status") as string;

    if (!orderId || !newStatus) return;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    revalidatePath("/merchant/orders");
    revalidatePath("/admin/orders");
  }

  const totalEarnings = orders.reduce((acc, order) => acc + order.netProfit, 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              BONFILS MERCHANT PORTAL
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
              Customer Orders
            </h1>
          </div>

          <a
            href="/merchant"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-500"
          >
            &larr; Back to Dashboard
          </a>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* STATS OVERVIEW */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Total Orders Received</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{orders.length}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Total Profit Earned</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                {totalEarnings.toLocaleString()} RWF
              </p>
            </div>
          </div>

          {/* ORDERS LIST */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900">Live Orders Directory</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <div className="p-10 text-center text-slate-500 text-sm">
                  No orders placed yet. Place an order from the Shopping Cart to test!
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-slate-900">
                          Customer: {order.customerName}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {order.customerPhone}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Delivery Address: <span className="font-medium text-slate-800">{order.deliveryAddress}</span>
                      </p>

                      <div className="mt-3 text-xs text-slate-600 space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id}>
                            • <span className="font-bold">{item.product.name}</span> (Qty: {item.quantity})
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="text-right sm:text-left">
                        <p className="text-xs text-slate-500">Your Net Profit</p>
                        <p className="text-lg font-extrabold text-emerald-600">
                          +{order.netProfit.toLocaleString()} RWF
                        </p>
                      </div>

                      <form action={updateOrderStatus} className="flex items-center gap-2">
                        <input type="hidden" name="orderId" value={order.id} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="rounded-xl border border-slate-300 p-2 text-xs font-bold focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}