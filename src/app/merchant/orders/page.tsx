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

  // SERVER ACTION: Alibaba Style Fulfillment (Tracking & Delivery Setup)
  async function updateFulfillment(formData: FormData) {
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
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              ALIBABA FULFILLMENT CENTER
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Manage Customer Orders & Shipping</h1>
          </div>
          <a href="/merchant" className="text-xs font-bold text-slate-600 hover:underline">
            &larr; Back to Reseller Dashboard
          </a>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            Nta order n'imwe iragera mu duka ryawe.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => (
              <div key={ord.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Tracking Number</span>
                    <h3 className="font-mono text-lg font-black text-emerald-600">{ord.trackingNumber}</h3>
                    <p className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Buyer Info</span>
                    <p className="font-extrabold text-sm text-slate-900">{ord.customerName}</p>
                    <p className="text-xs text-slate-500">{ord.customerPhone} • {ord.deliveryAddress}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Reseller Earning (Net)</span>
                    <p className="font-black text-xl text-slate-900">{ord.merchantEarning.toLocaleString()} RWF</p>
                    <span className="text-[10px] text-emerald-600 font-bold">Web Commission deducted</span>
                  </div>

                  {/* FULFILLMENT CONTROL FORM */}
                  <form action={updateFulfillment} className="flex gap-2 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <input type="hidden" name="orderId" value={ord.id} />
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Shipping Status</label>
                      <select
                        name="status"
                        defaultValue={ord.status}
                        className="rounded-xl border border-slate-300 p-2 text-xs font-bold bg-white"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING (Packing)</option>
                        <option value="SHIPPED">SHIPPED (Express Logistics)</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <button type="submit" className="mt-3.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700">
                      Update Shipping
                    </button>
                  </form>
                </div>

                {/* ORDERED ITEMS LIST */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Order Line Items:</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ord.items.map((it) => (
                      <div key={it.id} className="rounded-xl bg-slate-50 p-3 text-xs flex justify-between items-center">
                        <div>
                          <strong className="text-slate-900 block">{it.product.name}</strong>
                          <span className="text-slate-500">Quantity: {it.quantity}</span>
                        </div>
                        <strong className="text-slate-900">{(it.retailPrice * it.quantity).toLocaleString()} RWF</strong>
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