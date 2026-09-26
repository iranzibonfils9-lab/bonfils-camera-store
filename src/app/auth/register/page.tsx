"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"BUYER" | "MERCHANT">("BUYER");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    storeName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Account yaremwe neza! Hitamo kwinjira (Login).");
        router.push("/auth/login");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err: any) {
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS CAMERA STORE
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Create Your Account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select your account type to register on the platform.
          </p>

          {/* ROLE SELECTOR */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("BUYER")}
              className={`rounded-xl border py-3 text-sm font-bold transition ${
                role === "BUYER"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              🛒 Buyer / Retail Customer
            </button>

            <button
              type="button"
              onClick={() => setRole("MERCHANT")}
              className={`rounded-xl border py-3 text-sm font-bold transition ${
                role === "MERCHANT"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              🏪 Merchant / Reseller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                placeholder="Iranzi Bonfils"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {role === "MERCHANT" && (
              <div>
                <label className="block text-xs font-bold text-slate-700">Store / Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="BONFILS CAMERA - Tropical Plaza"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                placeholder="iranzi@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Phone Number (MTN / Airtel)</label>
              <input
                type="text"
                required
                placeholder="078 XXX XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : `Register as ${role}`}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <a href="/auth/login" className="font-bold text-emerald-600 hover:underline">
              Log In Here
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}