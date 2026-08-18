import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase, type UserRole } from "../lib/supabase";

const roleLabels: Record<UserRole, string> = {
  athlete: "Athlete",
  coach: "Coach",
  scout: "Scout / Academy",
};

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || "athlete";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName.trim(),
        role,
        phone: phone.trim() || null,
        location: location.trim() || null,
      });

      if (profileError) {
        setError("Account created but profile save failed. Please try logging in.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f9]">
      <header className="flex h-16 items-center bg-[#0d5a8f] shadow-md">
        <Link
          to="/"
          className="flex items-center gap-2 pl-4 text-white hover:opacity-80"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="mx-auto text-lg font-semibold tracking-wide text-white pr-8">
          KhelSetu
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-[#e8f1f9] px-3 py-1 text-sm font-medium text-[#0d5a8f]">
            {roleLabels[role]}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-[#1a1a1a]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            Fill in your details to register
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full Name" required>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
            />
          </Field>

          <Field label="Email" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="form-input"
            />
          </Field>

          <Field label="Phone Number">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              className="form-input"
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, District or Village"
              className="form-input"
            />
          </Field>

          <Field label="Password" required>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
          </Field>

          <Field label="Confirm Password" required>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="form-input"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 items-center justify-center rounded-lg bg-[#0d5a8f] text-base font-semibold text-white transition-colors hover:bg-[#0a4a77] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#666]">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#0d5a8f] hover:underline"
          >
            Login here
          </Link>
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#333]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
