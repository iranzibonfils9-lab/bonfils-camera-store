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

  const store = user.store;

  // SERVER ACTION: Update Store Profile & Branding
  async function updateStoreProfile(formData: FormData) {
    "use server";
    const storeName = formData.get("storeName") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const phone = formData.get("phone") as string;

    await prisma.store.update({
      where: { id: store.id },
      data: {
        storeName,
        description,
        location,
        phone,
      },
    });

    revalidatePath("/merchant/settings");
    revalidatePath(`/stores/${store.slug}`);
    revalidatePath("/stores");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              ALIBABA VENDOR BRANDING
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Store Profile & Settings</h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure how your store banner, location, and verified badges appear to public buyers.
            </p>
          </div>

          <a
            href={`/stores/${store.slug}`}
            target="_blank"
            className="rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
          >
            Preview Public Storefront 👁️
          </a>
        </div>

        {/* PROFILE FORM */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <form action={updateStoreProfile} className="space-y-6">
            {/* BRANDING SECTION */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4">
                1. Store Identity & Display Name
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Official Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    defaultValue={store.storeName}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Store URL Slug (Public Handle)</label>
                  <input
                    type="text"
                    disabled
                    value={store.slug}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* LOCATION & CONTACT */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-4">
                2. Physical Location & Contact Channels
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Physical Store Address (Plaza / Floor)</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={store.location || "Kigali Downtown Tropical Plaza, Floor 1, Shop F12"}
                    required
                    placeholder="e.g. Tropical Plaza, Floor 2, Room 204"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Public WhatsApp & MTN MoMo Contact</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={store.phone || user.phone}
                    required
                    placeholder="0788123456"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-2">
                3. Business Description & Speciality
              </h3>
              <textarea
                name="description"
                rows={4}
                defaultValue={
                  store.description ||
                  "Verified supplier of high-end surveillance gear, smart CCTV security, wireless PTZ cameras, and alarm systems at Tropical Plaza Kigali."
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-emerald-700"
            >
              Save & Publish Storefront Profile
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}