export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";

export default async function OrderTrackingInvoicePage({
  params,
}: {
  params: { trackingId: string };
}) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: params.trackingId },
        { trackingNumber: params.trackingId },
      ],
    },
    include: {
      items: { include: { product: true } },
      store: true,
    },
  });

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-xl py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Order Not Found</h1>
          <p className="text-xs text-slate-500 mt-2">Invalid tracking code or order ID.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      <Header />

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* INVOICE CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex justify-between items-start border-b border-slate-100 pb-6">
            <div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                OFFICIAL MARKETPLACE INVOICE
              </span>
              <h1 className="mt-2 text-2xl font-black text-slate-900">
                BONFILS CAMERA STORE
              </h1>
              <p className="text-xs text-slate-500">Kigali Downtown Tropical Plaza, Rwanda</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-400 block">TRACKING CODE</span>
              <span className="text-lg font-extrabold text-emerald-600">{order.trackingNumber}</span>
              <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* CUSTOMER & SHIPPING INFO */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-xs">
            <div>
              <p className="font-bold text-slate-800">Billed To (Customer):</p>
              <p className="text-slate-600">{order.customerName}</p>
              <p className="text-slate-600">{order.customerPhone}</p>
              <p className="text-slate-600">{order.deliveryAddress}</p>
            </div>

            <div>
              <p className="font-bold text-slate-800">Fulfillment Store:</p>
              <p className="text-slate-600">{order.store?.storeName || "BONFILS Central"}</p>
              <p className="font-bold text-emerald-700 mt-2">Status: {order.status}</p>
            </div>
          </div>

          {/* ORDER ITEMS TABLE */}
          <div className="mt-6">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-100 font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-3 font-bold text-slate-800">{it.product.name}</td>
                    <td className="p-3 text-center">{it.quantity}</td>
                    <td className="p-3 text-right">{it.retailPrice.toLocaleString()} RWF</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {(it.retailPrice * it.quantity).toLocaleString()} RWF
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL & COMMISSION BREAKDOWN */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-right space-y-1">
            <p className="text-xs text-slate-500">
              Paid via: <strong className="text-slate-800">{order.paymentMethod}</strong>
            </p>
            <p className="text-2xl font-black text-emerald-600">
              Total Amount: {order.totalAmount.toLocaleString()} RWF
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}