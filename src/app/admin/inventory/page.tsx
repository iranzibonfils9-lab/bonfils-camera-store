export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Server Action: Add Central Stock Product
  async function addCentralProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const wholesalePrice = parseFloat(formData.get("wholesalePrice") as string);
    const suggestedRetail = parseFloat(formData.get("suggestedRetail") as string);
    const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
    const description = formData.get("description") as string;

    if (!name || !wholesalePrice || isNaN(stockQuantity)) return;

    await prisma.product.create({
      data: {
        name,
        category: category || "CCTV Cameras",
        wholesalePrice,
        suggestedRetail: suggestedRetail || wholesalePrice * 1.25,
        stockQuantity: stockQuantity,
        description,
      },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/products");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              MASTER SUPPLIER PORTAL
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Central Inventory Management
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage wholesale stock supplied to Kigali Tropical Plaza Resellers.
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-emerald-500 transition"
          >
            &larr; Back to Admin Dashboard
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* ADD PRODUCT FORM (4 COLS) */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl h-fit">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📦</span> Add Central Stock Product
            </h2>

            <form action={addCentralProduct} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Hikvision 4MP PTZ Outdoor Camera"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Category</label>
                <select
                  name="category"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="CCTV Cameras">CCTV Cameras</option>
                  <option value="DVR / NVR Recorders">DVR / NVR Recorders</option>
                  <option value="Security Accessories">Security Accessories</option>
                  <option value="Solar Lighting">Solar Lighting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Wholesale (RWF)</label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    required
                    placeholder="65000"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Retail (RWF)</label>
                  <input
                    type="number"
                    name="suggestedRetail"
                    placeholder="85000"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  required
                  defaultValue={50}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="High definition night vision surveillance camera..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700"
              >
                Add to Central Inventory
              </button>
            </form>
          </div>

          {/* PRODUCTS LIST TABLE (8 COLS) */}
          <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              Central Products Directory ({products.length})
            </h2>

            {products.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-xs text-slate-500">
                Nta gicuruzwa kirinjizwa muri Central Inventory.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-100 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Product Info</th>
                      <th className="p-3">Wholesale Price</th>
                      <th className="p-3">Suggested Retail</th>
                      <th className="p-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.category}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-700">
                          {p.wholesalePrice.toLocaleString()} RWF
                        </td>
                        <td className="p-3 font-bold text-emerald-600">
                          {p.suggestedRetail.toLocaleString()} RWF
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px]">
                            {p.stockQuantity} units
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}