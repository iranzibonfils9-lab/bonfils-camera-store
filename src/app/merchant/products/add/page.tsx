export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function MerchantAddProductPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "MERCHANT" || !user.store) {
    redirect("/login");
  }

  // SERVER ACTION: Add Custom Merchant Product
  async function createCustomProduct(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const retailPrice = parseFloat(formData.get("retailPrice") as string);
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const description = formData.get("description") as string;

    const sku = `CUSTOM-${Date.now()}`;

    // 1. Create Product in Central Catalog as Custom
    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        brand,
        suggestedRetail: retailPrice,
        wholesalePrice: 0, // Custom stock has no central wholesale price
        stockQuantity,
        description,
        isCustomMerchantProduct: true,
      },
    });

    // 2. Attach to Merchant Store
    await prisma.merchantProduct.create({
      data: {
        storeId: user.store.id,
        productId: product.id,
        retailPrice,
        isListed: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/merchant/products");

    redirect("/merchant/products");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="border-b border-slate-100 pb-6">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              MERCHANT INVENTORY CONTROL
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Add New Custom Product
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Products added here will immediately display on Homepage and Admin Catalog. 
              <strong> 2% System Fee</strong> applies upon successful retail sale.
            </p>
          </div>

          <form action={createCustomProduct} className="mt-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Solar Security Camera 4K"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Category</label>
                <select
                  name="category"
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="CCTV Cameras">CCTV Cameras</option>
                  <option value="DVR Systems">DVR Systems</option>
                  <option value="Solar Cameras">Solar Cameras</option>
                  <option value="Accessories">Accessories & Wiring</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  required
                  placeholder="e.g. Hikvision / Custom"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Retail Price (RWF)</label>
                <input
                  type="number"
                  name="retailPrice"
                  required
                  placeholder="85000"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Available Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  required
                  defaultValue="10"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Product Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Write full product specs, night vision range, warranty details..."
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              🚀 Publish Product Live Now
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}