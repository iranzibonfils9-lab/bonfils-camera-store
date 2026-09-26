export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function MerchantProductsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "MERCHANT" || !user.store) {
    redirect("/auth/login");
  }

  // Fetch all products associated with this Merchant's store
  const merchantProducts = await prisma.merchantProduct.findMany({
    where: { storeId: user.store.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  // SERVER ACTION: Delete / Remove product listing
  async function removeProduct(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;

    await prisma.merchantProduct.deleteMany({
      where: {
        storeId: user.store.id,
        productId,
      },
    });

    revalidatePath("/merchant/products");
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              INVENTORY CATALOG • {user.store.storeName}
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Products & Inventory Management
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Ibicuruzwa ushyize hano bihita bigaragara kuri Homepage no kuri Admin Catalog ako kanya.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/merchant/products/add"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              + Add New Custom Product
            </Link>
            <Link
              href="/merchant"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-emerald-500"
            >
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>

        {/* PRODUCTS TABLE / GRID */}
        {merchantProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl">
              📦
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Nta gicuruzwa urashyiramo</h3>
            <p className="mt-1 text-xs text-slate-500">
              Kanda akabuto ka **"+ Add New Custom Product"** utangire gushyiraho ibicuruzwa bijya kuri Homepage.
            </p>
            <Link
              href="/merchant/products/add"
              className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
            >
              + Add First Product
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-100 font-bold uppercase text-slate-600">
                  <tr>
                    <th className="p-4">Product Name & SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Retail Price</th>
                    <th className="p-4 text-center">Stock Quantity</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {merchantProducts.map(({ product, retailPrice }) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <span className="font-extrabold text-slate-900 block text-sm">
                          {product.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          SKU: {product.sku}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{product.category}</td>
                      <td className="p-4 text-right font-black text-emerald-600 text-sm">
                        {retailPrice.toLocaleString()} RWF
                      </td>
                      <td className="p-4 text-center">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-800">
                          {product.stockQuantity} pcs
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                          Live on Homepage 🌐
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <form action={removeProduct} className="inline-block">
                          <input type="hidden" name="productId" value={product.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}