export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}) {
  const resolvedParams = await params;
  const trackingId = resolvedParams?.trackingId;

  // Fetch order from database using tracking ID or fallback search
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: trackingId }, { customerPhone: trackingId }],
    },
    include: {
      items: {
        include: { product: true },
      },
      store: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            LIVE ORDER STATUS
          </span>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Track Customer Order
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Tracking Ref / Phone: <span className="font-mono font-bold text-emerald-600">{trackingId}</span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        {!order ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
            <p className="mt-1 text-xs text-slate-500">
              Nta komande ibonetse ikoresheje numero cyangwa tracking ID ya <span className="font-bold">{trackingId}</span>.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-700"
            >
              &larr; Subira ku Bicuruzwa
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* STATUS BADGE */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500">Order Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xl font-black text-slate-900">{order.status}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-bold text-slate-500">Total Amount</p>
                <p className="text-xl font-black text-emerald-600">
                  {order.totalRetail.toLocaleString()} RWF
                </p>
              </div>
            </div>

            {/* ORDER DETAILS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Customer & Delivery Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Customer Name:</span>
                  <span className="font-bold text-slate-900">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone Number:</span>
                  <span className="font-bold text-slate-900">{order.customerPhone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Delivery Address:</span>
                  <span className="font-bold text-slate-900">{order.deliveryAddress}</span>
                </div>
              </div>
            </div>

            {/* ORDERED ITEMS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Items Ordered
              </h2>
              <div className="mt-4 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.product.name}</p>
                      <p className="text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-black text-slate-900">
                      {(item.retailPrice * item.quantity).toLocaleString()} RWF
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}