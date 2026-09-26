export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Server Action: Add product directly into Database
  async function addProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const wholesalePrice = parseFloat(formData.get("wholesalePrice") as string);
    const suggestedRetail = parseFloat(formData.get("suggestedRetail") as string);
    const stock = parseInt(formData.get("stock") as string);
    const description = formData.get("description") as string;

    if (!name || !wholesalePrice || !stock) return;

    await prisma.product.create({
      data: {
        name,
        category: category || "CCTV Cameras",
        brand: brand || "Hikvision",
        wholesalePrice,
        suggestedRetail: suggestedRetail || wholesalePrice * 1.25,
        stock,
        description,
      },
    });

    revalidatePath("/admin/inventory");
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
              BONFILS MASTER SUPPLIER
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
              Central Warehouse Inventory
            </h1>
          </div>

          <a
            href="/admin"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-500"
          >
            &larr; Back to Admin Dashboard
          </a>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-3">
          {/* LEFT: ADD PRODUCT FORM */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-slate-900">
              + Add New Supplier Product
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Insert new camera/hardware into central stock for all resellers.
            </p>

            <form action={addProduct} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dahua 5MP ColorVu Camera"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Category</label>
                  <select
                    name="category"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CCTV Cameras">CCTV Cameras</option>
                    <option value="Recorders">Recorders (DVR/NVR)</option>
                    <option value="Solar Cameras">Solar Cameras</option>
                    <option value="Storage">Storage</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    defaultValue="Hikvision"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Wholesale (RWF)</label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    required
                    placeholder="e.g. 50000"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Stock Units</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    placeholder="e.g. 20"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Suggested Retail (RWF)</label>
                <input
                  type="number"
                  name="suggestedRetail"
                  placeholder="e.g. 65000"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Technical specifications, lens, night vision..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Save & Publish to Inventory
              </button>
            </form>
          </div>

          {/* RIGHT: INVENTORY TABLE */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
            <h2 className="text-xl font-bold text-slate-900">
              Current Stock ({products.length})
            </h2>

            <table className="mt-4 w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Wholesale Price</th>
                  <th className="py-3 px-4">Suggested Retail</th>
                  <th className="py-3 px-4">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <span className="text-[11px] text-slate-500">{p.category} • {p.brand}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {p.wholesalePrice.toLocaleString()} RWF
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      {p.suggestedRetail.toLocaleString()} RWF
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {p.stock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}