"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      // Redirect based on credentials
      if (email.includes("admin")) {
        router.push("/admin");
      } else if (email.includes("merchant")) {
        router.push("/merchant");
      } else {
        router.push("/products");
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
              BONFILS MARKETPLACE
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Sign In to Your Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Access your dashboard, reseller store, or order history.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-bold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@bonfilscamera.rw"
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
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
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* QUICK DEMO CREDENTIALS HINT */}
          <div className="mt-8 space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-bold text-slate-800">Demo Accounts (Seeded):</p>
            <p>
              👑 <span className="font-semibold">Admin:</span> admin@bonfilscamera.rw / adminpassword123
            </p>
            <p>
              🏪 <span className="font-semibold">Merchant:</span> merchant@bonfilscamera.rw / merchantpassword123
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}