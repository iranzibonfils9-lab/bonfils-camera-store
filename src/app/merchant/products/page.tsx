export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function MerchantProductsListPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "MERCHANT" || !user.store) {
    redirect("/auth/login");
  }

  // Fetch listed products for this reseller store
  const storeProducts = await prisma.merchantProduct.findMany({
    where: { storeId: user.store.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  // Server Action: Remove Product from Store Catalog
  async function removeProductFromStore(formData: FormData) {
    "use server";

    const actionUser = await getCurrentUser();
    if (!actionUser || !actionUser.store) {
      redirect("/auth/login");
    }

    const productId = formData.get("productId") as string;
    if (!productId) return;

    await prisma.merchantProduct.deleteMany({
      where: {
        storeId: actionUser.store.id,
        productId,
      },
    });

    revalidatePath("/merchant/products");
    revalidatePath("/products");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              RESELLER CATALOG MANAGEMENT
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              My Listed Store Products
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage items currently visible to retail customers under <span className="font-bold text-slate-900">{user.store.storeName}</span>.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/merchant/products/add"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              + Publish Custom Product
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {storeProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">No Products in Your Reseller Catalog</h2>
            <p className="mt-1 text-xs text-slate-500">
              Nta gicuruzwa urashyira muri Store yawe. Wifuza guhitamo ibiri muri Central Inventory cyangwa gupublisha ibyaguturiye?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="/products"
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-emerald-500"
              >
                Browse Central Stock
              </a>
              <a
                href="/merchant/products/add"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                + Add Custom Product
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storeProducts.map((mp) => (
              <div
                key={mp.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                      {mp.product.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Live on Marketplace
                    </span>
                  </div>

                  <h3 className="mt-3 font-black text-slate-900 text-base">{mp.product.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{mp.product.description}</p>

                  <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Your Selling Price</span>
                      <span className="font-black text-slate-900 text-base">
                        {mp.retailPrice.toLocaleString()} RWF
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Available Stock</span>
                      <span className="font-bold text-slate-700">
                        {mp.product.stockQuantity} units
                      </span>
                    </div>
                  </div>
                </div>

                <form action={removeProductFromStore} className="mt-6 border-t border-slate-100 pt-4">
                  <input type="hidden" name="productId" value={mp.productId} />
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                  >
                    Remove from My Store
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}