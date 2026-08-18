import { useNavigate } from "react-router-dom";
import { ChevronRight, Users, UserCog, Search } from "lucide-react";

const roles = [
  {
    label: "Athlete",
    description: "I am a player looking for opportunities",
    icon: Users,
    value: "athlete",
  },
  {
    label: "Coach",
    description: "I coach and train athletes",
    icon: UserCog,
    value: "coach",
  },
  {
    label: "Scout / Academy",
    description: "I discover and support talent",
    icon: Search,
    value: "scout",
  },
] as const;

export function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f9]">
      <header className="flex h-16 items-center justify-center bg-[#0d5a8f] shadow-md">
        <span className="text-lg font-semibold tracking-wide text-white">
          KhelSetu
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Register as a new user
          </h1>
          <p className="mt-2 text-sm text-[#666]">
            Select your role to get started
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() =>
                  navigate(`/register?role=${role.value}`)
                }
                className="group flex items-center gap-4 rounded-xl border border-[#e0e5ec] bg-white p-5 text-left shadow-sm transition-all hover:border-[#0d5a8f] hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f1f9] text-[#0d5a8f] transition-colors group-hover:bg-[#0d5a8f] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-[#1a1a1a]">
                    {role.label}
                  </p>
                  <p className="text-sm text-[#888]">{role.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#bbb] transition-transform group-hover:translate-x-1 group-hover:text-[#0d5a8f]" />
              </button>
            );
          })}
        </div>

        <div className="mt-8 border-t border-[#e0e5ec] pt-6 text-center">
          <p className="text-sm text-[#666]">Already registered?</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-1 text-base font-semibold text-[#0d5a8f] underline-offset-4 hover:underline"
          >
            Login here
          </button>
        </div>
      </main>
    </div>
  );
}
