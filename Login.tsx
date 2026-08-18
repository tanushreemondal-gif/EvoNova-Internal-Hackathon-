import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f9]">
      <header className="flex h-16 items-center justify-center bg-[#0d5a8f] shadow-md">
        <span className="text-lg font-semibold tracking-wide text-white">
          KhelSetu
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            Login to your account to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#333]">
              Email<span className="text-red-500"> *</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#333]">
              Password<span className="text-red-500"> *</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 items-center justify-center rounded-lg bg-[#0d5a8f] text-base font-semibold text-white transition-colors hover:bg-[#0a4a77] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#666]">
          New user?{" "}
          <Link
            to="/"
            className="font-semibold text-[#0d5a8f] hover:underline"
          >
            Register here
          </Link>
        </p>
      </main>
    </div>
  );
}
