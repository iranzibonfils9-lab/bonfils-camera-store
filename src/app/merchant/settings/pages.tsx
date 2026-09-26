export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function MerchantSettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "MERCHANT" || !user.store) {
    redirect("/auth/login");
  }

  async function updateStoreSettings(formData: FormData) {
    "use server";
    const storeName = formData.get("storeName") as string;
    const location = formData.get("location") as string;
    const phone = formData.get("phone") as string;
    const description = formData.get("description") as string;

    await prisma.store.update({
      where: { id: user.store.id },
      data: { storeName, location, phone, description },
    });

    revalidatePath("/merchant");
    revalidatePath("/merchant/settings");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">Store Profile & Branding</h1>
          <p className="text-xs text-slate-500 mt-1">Update store details shown to Kigali buyers.</p>

          <form action={updateStoreSettings} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Store Name</label>
              <input
                type="text"
                name="storeName"
                defaultValue={user.store.storeName}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Location (Plaza Floor/Shop #)</label>
              <input
                type="text"
                name="location"
                defaultValue={user.store.location || ""}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">MTN MoMo Contact Phone</label>
              <input
                type="text"
                name="phone"
                defaultValue={user.store.phone || user.phone}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Store Description</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={user.store.description || ""}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700"
            >
              Save Store Profile
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}