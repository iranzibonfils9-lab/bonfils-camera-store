export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function MerchantOrdersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "MERCHANT" || !user.store) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
    where: { storeId: user.store.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  // SERVER ACTION: Update Order Status
  async function updateOrderStatus(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    const status = formData.get("status") as any;

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/merchant/orders");
    revalidatePath("/merchant");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Live Customer Orders</h1>
            <p className="text-xs text-slate-500">Manage fulfillment, shipping status, and earnings.</p>
          </div>
          <a href="/merchant" className="text-xs font-bold text-slate-600 hover:underline">
            &larr; Back to Dashboard
          </a>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No active orders received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-4 gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase">Tracking Code</span>
                    <h3 className="font-mono text-base font-bold text-slate-900">{ord.trackingNumber}</h3>
                    <p className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Customer</span>
                    <p className="font-bold text-sm text-slate-800">{ord.customerName}</p>
                    <p className="text-xs text-slate-500">{ord.customerPhone} • {ord.deliveryAddress}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Your Earning</span>
                    <p className="font-black text-lg text-emerald-600">{ord.merchantEarning.toLocaleString()} RWF</p>
                  </div>

                  <form action={updateOrderStatus} className="flex gap-2 items-center">
                    <input type="hidden" name="orderId" value={ord.id} />
                    <select
                      name="status"
                      defaultValue={ord.status}
                      className="rounded-xl border border-slate-300 p-2 text-xs font-bold"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button type="submit" className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">
                      Update
                    </button>
                  </form>
                </div>

                <div className="mt-4 pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Order Items:</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ord.items.map((it) => (
                      <div key={it.id} className="rounded-lg bg-slate-50 p-2.5 text-xs flex justify-between">
                        <span>{it.product.name} (x{it.quantity})</span>
                        <strong className="text-slate-800">{(it.retailPrice * it.quantity).toLocaleString()} RWF</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}