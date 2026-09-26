export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminModerationPage() {
  // Fetch all users and their stores
  const users = await prisma.user.findMany({
    include: { store: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all listed products with seller info
  const merchantProducts = await prisma.merchantProduct.findMany({
    include: {
      product: true,
      store: { include: { merchant: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // SERVER ACTION: Delete product for violation
  async function deleteProductViolation(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    if (!productId) return;

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/moderation");
    revalidatePath("/");
    revalidatePath("/products");
  }

  // SERVER ACTION: Update User Profile / Role / Phone
  async function updateUserProfile(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const role = formData.get("role") as "ADMIN" | "MERCHANT" | "BUYER";

    if (!userId) return;

    await prisma.user.update({
      where: { id: userId },
      data: { name, phone, role },
    });

    revalidatePath("/admin/moderation");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 uppercase tracking-wider">
              MASTER ADMIN CONTROL & MODERATION
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              User Profiles, Merchant Management & Moderation
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor Buyers & Sellers, update credentials, and clean up policy violations.
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-500"
          >
            &larr; Admin Dashboard
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 space-y-12">
        {/* 1. USERS & MERCHANTS DIRECTORY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            👥 All Registered Users ({users.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Store / Business</th>
                  <th className="py-3 px-4 text-right">Quick Edit Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{u.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : u.role === "MERCHANT"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.store ? (
                        <div>
                          <p className="font-bold text-xs text-slate-800">{u.store.storeName}</p>
                          <p className="text-[10px] text-slate-400">{u.store.location || "Kigali"}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">— No Store —</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <form action={updateUserProfile} className="inline-flex gap-2 items-center">
                        <input type="hidden" name="userId" value={u.id} />
                        <input
                          type="text"
                          name="name"
                          defaultValue={u.name}
                          className="rounded border border-slate-300 px-2 py-1 text-xs w-28"
                        />
                        <input
                          type="text"
                          name="phone"
                          defaultValue={u.phone}
                          className="rounded border border-slate-300 px-2 py-1 text-xs w-24"
                        />
                        <select
                          name="role"
                          defaultValue={u.role}
                          className="rounded border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="BUYER">BUYER</option>
                          <option value="MERCHANT">MERCHANT</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded bg-slate-800 px-3 py-1 text-xs font-bold text-white hover:bg-slate-900"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. PUBLIC LISTED PRODUCTS MODERATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            🛒 Reseller & Public Products Control ({merchantProducts.length})
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Items visible on Home catalog. Delete any product violating store rules.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {merchantProducts.map((mp) => (
              <div
                key={mp.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                      {mp.store.storeName}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {mp.retailPrice.toLocaleString()} RWF
                    </span>
                  </div>

                  <h3 className="mt-2 font-bold text-slate-800">{mp.product.name}</h3>
                  <p className="text-xs text-slate-500">{mp.product.category} • {mp.product.brand}</p>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                    {mp.product.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">
                    Seller: <strong>{mp.store.merchant.name}</strong>
                  </span>

                  <form action={deleteProductViolation}>
                    <input type="hidden" name="productId" value={mp.product.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700"
                    >
                      Delete Violation
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}