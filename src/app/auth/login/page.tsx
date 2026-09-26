"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Redirect dynamically based on role returned from server
      router.push(data.redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="text-center">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              BONFILS PORTAL ACCESS
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
              Sign In to Your Account
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              Enter your credentials to access Admin, Merchant, or Buyer portal.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-center text-xs font-bold text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bonfilscamera.com"
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* QUICK DEMO CREDENTIALS HINT */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-bold text-slate-900">Quick Portal Demo Accounts:</p>
            <div className="mt-2 space-y-1">
              <p><span className="font-semibold text-emerald-700">Admin:</span> admin@bonfils.rw / admin123</p>
              <p><span className="font-semibold text-blue-700">Merchant:</span> merchant@bonfils.rw / merchant123</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}