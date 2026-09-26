export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function CartAndCheckoutPage() {
  // Fetch sample active item from Central Stock to demonstrate live checkout
  const featuredProduct = await prisma.product.findFirst({
    where: { stockQuantity: { gt: 0 } },
  });

  const activeStore = await prisma.store.findFirst();
  const sampleBuyer = await prisma.user.findFirst({
    where: { role: "BUYER" },
  });

  // Server Action: Process Checkout & Deduct Stock in Real-Time
  async function processOrder(formData: FormData) {
    "use server";

    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const deliveryAddress = formData.get("deliveryAddress") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const productId = formData.get("productId") as string;
    const storeId = formData.get("storeId") as string;
    const buyerId = formData.get("buyerId") as string;

    if (!customerName || !customerPhone || !deliveryAddress || !productId) return;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stockQuantity < 1) return;

    const retailPrice = product.suggestedRetail;
    const wholesalePrice = product.wholesalePrice;
    const netProfit = retailPrice - wholesalePrice;

    // 1. Create Order in DB
    await prisma.order.create({
      data: {
        buyerId: buyerId || (await prisma.user.findFirst({ where: { role: "BUYER" } }))!.id,
        storeId: storeId || (await prisma.store.findFirst())!.id,
        totalRetail: retailPrice,
        totalWholesale: wholesalePrice,
        netProfit: netProfit,
        status: "PENDING",
        paymentMethod: paymentMethod || "MOMO",
        customerName,
        customerPhone,
        deliveryAddress,
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            retailPrice: retailPrice,
            wholesalePrice: wholesalePrice,
          },
        },
      },
    });

    // 2. Reduce Stock in Database
    await prisma.product.update({
      where: { id: product.id },
      data: {
        stockQuantity: {
          decrement: 1,
        },
      },
    });

    revalidatePath("/cart");
    revalidatePath("/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/merchant/orders");

    redirect("/products?orderSuccess=true");
  }

  const deliveryFee = 3000;
  const itemPrice = featuredProduct?.suggestedRetail || 85000;
  const grandTotal = itemPrice + deliveryFee;

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER SECTION */}
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS MARKETPLACE
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Shopping Cart & Checkout
          </h1>
        </div>
      </section>

      {/* MAIN CHECKOUT FORM */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <form action={processOrder} className="grid gap-10 lg:grid-cols-12">
            <input type="hidden" name="productId" value={featuredProduct?.id || ""} />
            <input type="hidden" name="storeId" value={activeStore?.id || ""} />
            <input type="hidden" name="buyerId" value={sampleBuyer?.id || ""} />

            {/* LEFT: ORDER ITEMS & CUSTOMER DETAILS (8 COLS) */}
            <div className="space-y-8 lg:col-span-8">
              {/* SELECTED ITEM */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

                <div className="mt-6 divide-y divide-slate-100">
                  <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {featuredProduct?.name || "Hikvision 4MP Outdoor PTZ Camera"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Merchant Store:{" "}
                        <span className="font-semibold text-emerald-600">
                          {activeStore?.storeName || "BONFILS CAMERA - Tropical Branch"}
                        </span>
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-slate-900">
                        {itemPrice.toLocaleString()} RWF
                      </p>
                    </div>

                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 w-fit">
                      Qty: 1
                    </span>
                  </div>
                </div>
              </div>

              {/* DELIVERY DETAILS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Delivery Details</h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      placeholder="e.g. Iranzi Bonfils"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Phone Number (MoMo Registered)
                    </label>
                    <input
                      type="text"
                      name="customerPhone"
                      required
                      placeholder="078 XXX XXXX"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Delivery Address / Location
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      required
                      placeholder="e.g. Kigali downtown, Tropical Plaza Store #12"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: PAYMENT SUMMARY (4 COLS) */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Payment Summary</h2>

                <div className="mt-6 space-y-3 border-b border-slate-100 pb-4 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">
                      {itemPrice.toLocaleString()} RWF
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Standard Kigali Delivery</span>
                    <span className="font-bold text-slate-900">
                      {deliveryFee.toLocaleString()} RWF
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-lg font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">{grandTotal.toLocaleString()} RWF</span>
                </div>

                {/* PAYMENT METHOD SELECTION */}
                <div className="mt-6">
                  <label className="block text-xs font-bold text-slate-700">Payment Method</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center gap-3 rounded-xl border border-emerald-500 bg-emerald-50/50 p-3 text-xs font-bold text-slate-900 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="MOMO"
                        defaultChecked
                        className="accent-emerald-600"
                      />
                      <span>MTN MoMo Direct Checkout</span>
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CASH"
                        className="accent-emerald-600"
                      />
                      <span>Pay on Delivery / Pickup at Store</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-md transition hover:bg-emerald-700"
                >
                  Confirm & Pay Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}