import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, MapPin, Phone, User } from "lucide-react";
import { useAuth } from "../lib/auth";
import type { UserRole } from "../lib/supabase";

const roleLabels: Record<UserRole, string> = {
  athlete: "Athlete",
  coach: "Coach",
  scout: "Scout / Academy",
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d5a8f]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f9]">
      <header className="flex h-16 items-center justify-between bg-[#0d5a8f] px-6 shadow-md">
        <span className="text-lg font-semibold tracking-wide text-white">
          KhelSetu
        </span>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate("/login");
          }}
          className="flex items-center gap-2 text-sm text-white/90 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f1f9] text-2xl font-bold text-[#0d5a8f]">
              {profile?.full_name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a1a1a]">
                {profile?.full_name ?? "User"}
              </h1>
              <span className="inline-block rounded-full bg-[#e8f1f9] px-3 py-0.5 text-sm font-medium text-[#0d5a8f]">
                {profile ? roleLabels[profile.role] : "Member"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={User}
            label="Email"
            value={user.email ?? "—"}
          />
          <InfoCard
            icon={Phone}
            label="Phone"
            value={profile?.phone ?? "Not provided"}
          />
          <InfoCard
            icon={MapPin}
            label="Location"
            value={profile?.location ?? "Not provided"}
          />
          <InfoCard
            icon={User}
            label="Member Since"
            value={
              profile
                ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
          />
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-[#cfd8e3] bg-white p-6 text-center">
          <p className="text-sm text-[#888]">
            More features coming soon — profiles, connections, and opportunities.
          </p>
        </div>
      </main>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f1f9] text-[#0d5a8f]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#999]">{label}</p>
        <p className="truncate text-sm font-semibold text-[#1a1a1a]">
          {value}
        </p>
      </div>
    </div>
  );
}
