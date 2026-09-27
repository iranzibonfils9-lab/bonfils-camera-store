export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const productId = resolvedParams?.productId;

  const product = productId
    ? await prisma.product.findUnique({ where: { id: productId } })
    : await prisma.product.findFirst();

  async function processCartCheckout(formData: FormData) {
    "use server";

    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const deliveryAddress = formData.get("deliveryAddress") as string;
    const selectedProductId = formData.get("productId") as string;

    if (!customerName || !customerPhone || !selectedProductId) return;

    const itemProduct = await prisma.product.findUnique({
      where: { id: selectedProductId },
    });

    if (!itemProduct) return;

    const retailPrice = itemProduct.suggestedRetail || itemProduct.wholesalePrice * 1.25;
    const wholesalePrice = itemProduct.wholesalePrice;
    const netProfit = retailPrice - wholesalePrice;

    const store = await prisma.store.findFirst();
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        trackingNumber,
        customerName,
        customerPhone,
        deliveryAddress: deliveryAddress || "Kigali Downtown",
        totalAmount: retailPrice,
        netProfit: netProfit,
        merchantEarning: netProfit,
        status: "PENDING",
        storeId: store?.id,
        items: {
          create: {
            productId: itemProduct.id,
            quantity: 1,
            unitPrice: retailPrice,
            retailPrice: retailPrice,
          },
        },
      },
    });

    redirect(`/orders/track/${order.trackingNumber}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Shopping Cart & Checkout</h1>

        {!product ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Nta gicuruzwa gihari muri Cart.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h3 className="mt-1 font-bold text-slate-900">{product.name}</h3>
                </div>
                <p className="font-black text-slate-900 text-lg">
                  {product.suggestedRetail.toLocaleString()} RWF
                </p>
              </div>
            </div>

            <div className="md:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-lg font-black text-slate-900 mb-4">Customer Details</h2>
              <form action={processCartCheckout} className="space-y-4">
                <input type="hidden" name="productId" value={product.id} />

                <div>
                  <label className="block text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="Jean Paul"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Phone Number (MTN MoMo)</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    placeholder="0788000000"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Delivery Address</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    placeholder="Kigali, Nyarugenge, City Center"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700"
                >
                  Confirm & Pay with MoMo
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}