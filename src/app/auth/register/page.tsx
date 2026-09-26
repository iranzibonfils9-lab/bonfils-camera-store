"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUYER");
  const [storeName, setStoreName] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role, storeName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Regsitration failed");
      } else {
        // Redirect to login page after successful registration
        router.push("/auth/login?registered=true");
      }
    } catch (err) {
      setErrorMsg("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              CREATE NEW ACCOUNT
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Join BONFILS Platform
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Select your role and create an account to get started.
            </p>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Account Type (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="BUYER">Buyer / Customer</option>
                <option value="MERCHANT">Reseller / Seller Store</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Iranzi Bonfils"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {role === "MERCHANT" && (
              <div>
                <label className="block text-xs font-bold text-slate-700">Store / Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bonfils Electronics Kigali"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-400 bg-emerald-50/30 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700">Phone Number</label>
              <input
                type="text"
                required
                placeholder="078 XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account & Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Ufite account tayari?{" "}
            <a href="/auth/login" className="font-bold text-emerald-600 hover:underline">
              Sign In Hano
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}