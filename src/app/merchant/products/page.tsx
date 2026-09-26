export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function MerchantProductsPage() {
  // Fetch active merchant's store
  const merchantStore = await prisma.store.findFirst({
    include: {
      merchantProducts: true,
    },
  });

  // Fetch central inventory from BONFILS Supplier
  const supplierProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Server Action: Add product to Merchant's store catalog
  async function addToStore(formData: FormData) {
    "use server";

    const productId = formData.get("productId") as string;
    const storeId = formData.get("storeId") as string;
    const customPrice = parseFloat(formData.get("retailPrice") as string);

    if (!productId || !storeId || !customPrice) return;

    await prisma.merchantProduct.upsert({
      where: {
        storeId_productId: {
          storeId,
          productId,
        },
      },
      update: {
        retailPrice: customPrice,
        isListed: true,
      },
      create: {
        storeId,
        productId,
        retailPrice: customPrice,
      },
    });

    revalidatePath("/merchant/products");
    revalidatePath("/products");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER BAR */}
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              BONFILS RESELLER CATALOG
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
              Select Products for Your Store
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Store: <span className="font-bold text-slate-900">{merchantStore?.storeName || "My Merchant Store"}</span>
            </p>
          </div>

          <a
            href="/merchant"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-500"
          >
            &larr; Back to Dashboard
          </a>
        </div>
      </section>

      {/* MAIN PRODUCTS GRID */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-slate-900">
            Available Supplier Stock ({supplierProducts.length})
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {supplierProducts.map((product) => {
              const listedItem = merchantStore?.merchantProducts.find(
                (mp) => mp.productId === product.id
              );
              const isAdded = Boolean(listedItem);

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {product.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          isAdded
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isAdded ? "In My Store" : "Not Added"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-900">
                      {product.name}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3 text-xs">
                      <div>
                        <p className="text-slate-500">Wholesale Price</p>
                        <p className="mt-0.5 font-bold text-slate-900">
                          {product.wholesalePrice.toLocaleString()} RWF
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Suggested Retail</p>
                        <p className="mt-0.5 font-bold text-slate-700">
                          {product.suggestedRetail.toLocaleString()} RWF
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FORM TO ADD/EDIT SELLING PRICE */}
                  <form action={addToStore} className="mt-6 space-y-3">
                    <input type="hidden" name="productId" value={product.id} />
                    <input
                      type="hidden"
                      name="storeId"
                      value={merchantStore?.id || ""}
                    />

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Your Custom Selling Price (RWF)
                      </label>
                      <input
                        type="number"
                        name="retailPrice"
                        required
                        defaultValue={
                          listedItem?.retailPrice || product.suggestedRetail
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full rounded-xl py-3 text-xs font-bold transition shadow-sm ${
                        isAdded
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {isAdded ? "Update Selling Price" : "+ Add to My Reseller Store"}
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}