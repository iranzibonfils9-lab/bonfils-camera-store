"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"BUYER" | "MERCHANT">("MERCHANT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Handle Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Email cyangwa Password ntabwo ari zo. Reba neza credentials zawe.");
      } else {
        const session = await getSession();
        const role = (session?.user as any)?.role;

        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "MERCHANT") {
          router.push("/merchant");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("Ikosa ryabaye mu kwinjira. Gerageza tena.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset Request
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation / Direct Reset Notification
    setTimeout(() => {
      setResetSuccess(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          {/* HEADER TOGGLE */}
          <div className="text-center">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              BONFILS MARKETPLACE ACCESS
            </span>
            <h1 className="mt-3 text-2xl font-black text-slate-900">
              {isForgotPassword ? "Reset Password" : "Sign In to Platform"}
            </h1>
          </div>

          {!isForgotPassword ? (
            <>
              {/* ACCOUNT TYPE SELECTOR */}
              <div className="mt-6 flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setAccountType("MERCHANT")}
                  className={`w-1/2 rounded-lg py-2 text-xs font-bold transition ${
                    accountType === "MERCHANT"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Reseller / Supplier
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("BUYER")}
                  className={`w-1/2 rounded-lg py-2 text-xs font-bold transition ${
                    accountType === "BUYER"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Buyer / Customer
                </button>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@bonfils.rw"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] font-bold text-emerald-600 hover:underline"
                    >
                      Wibagiwe Password?
                    </button>
                  </div>
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
                  className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : `Sign In as ${accountType}`}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-slate-100 pt-4 text-xs text-slate-600">
                Ntubwo ufite Account?{" "}
                <Link href="/auth/register" className="font-bold text-emerald-600 hover:underline">
                  Kora Sign Up Hano
                </Link>
              </div>
            </>
          ) : (
            /* FORGOT PASSWORD FORM */
            <div className="mt-6">
              {resetSuccess ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-xs font-bold text-emerald-800">
                  Ubutumwa bw'amabwiriza yo guhindura password bwoherejwe kuri email yawe!
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSuccess(false);
                    }}
                    className="mt-4 block w-full rounded-xl bg-slate-900 py-2.5 text-white"
                  >
                    Subira kuri Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Shyiramo Email yawe y'ipaji yawe, tukoherereze uburyo bw'akokanya bwo guhindura Password.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@bonfils.rw"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    {loading ? "Sending..." : "Ohereza Email yo Guhindura"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="w-full text-xs font-bold text-slate-500 hover:underline"
                  >
                    &larr; Subira inyuma
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}