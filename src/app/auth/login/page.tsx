"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Email cyangwa password sio byo. Reba neza credentials zawe.");
      } else {
        // Fetch session status to redirect based on role
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;

        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "MERCHANT") {
          router.push("/merchant");
        } else {
          router.push("/products");
        }
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("Ikosa ryabaye mu kwinjira. Gerageza tena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              BONFILS PORTAL ACCESS
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Sign In to Your Account
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Enter your credentials to access your account.
            </p>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Nturagira account?{" "}
            <a href="/auth/register" className="font-bold text-emerald-600 hover:underline">
              Kora Register (Signup) Hano
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}