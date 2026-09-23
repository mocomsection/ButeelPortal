import { useState } from "react";
import { X, Clock, CheckCircle2, MoreHorizontal, UserPlus } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { USER_ROLES, USERS_DATA } from "@/data/users";

export default function UsersScreen() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("artist");

  const roleMap = Object.fromEntries(USER_ROLES.map(r => [r.id, r]));
  const activeUsers  = USERS_DATA.filter(u => u.status === "active");
  const pendingUsers = USERS_DATA.filter(u => u.status === "invited");

  return (
    <Shell title="Хэрэглэгчид">
      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-zinc-900 text-lg">Хэрэглэгч урих</h3>
              <button type="button" onClick={() => setShowInvite(false)} className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-colors">
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-zinc-400 block mb-1.5">И-мэйл хаяг</label>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder="user@example.mn"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-400 block mb-2">Хандах эрх</label>
                <div className="space-y-2">
                  {USER_ROLES.filter(r => r.id !== "admin").map(r => (
                    <label key={r.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${inviteRole === r.id ? "border-violet-400 bg-violet-50/50" : "border-zinc-200 hover:bg-zinc-50"}`}>
                      <input type="radio" name="role" value={r.id} checked={inviteRole === r.id}
                        onChange={() => setInviteRole(r.id)} className="mt-1 accent-[var(--primary)]" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-800">{r.label}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {r.access.map(section => (
                            <span key={section} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500">
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button type="button" onClick={() => setShowInvite(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                Болих
              </button>
              <button type="button" onClick={() => { setShowInvite(false); setInviteEmail(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                Урилга илгээх
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl space-y-4">
        {/* Active users */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-zinc-900 text-sm">Идэвхтэй хэрэглэгчид</h3>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{activeUsers.length}</span>
            </div>
            <Btn icon={<UserPlus size={14} />} size="sm" onClick={() => setShowInvite(true)}>Урих</Btn>
          </div>
          <div className="divide-y divide-zinc-50">
            {activeUsers.map(u => {
              const role = roleMap[u.role];
              return (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-100/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    {u.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-zinc-900">{u.name}</p>
                      {u.role === "admin" && (
                        <span className="text-xs bg-violet-100 text-violet-700 font-bold px-1.5 py-0.5 rounded-md">Үндсэн</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{u.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex-shrink-0 ${role?.color || "bg-zinc-100 text-zinc-600"}`}>
                    {role?.label}
                  </span>
                  {u.role !== "admin" && (
                    <button type="button" className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors flex-shrink-0">
                      <MoreHorizontal size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pending invitations */}
        {pendingUsers.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2.5">
              <h3 className="font-bold text-zinc-900 text-sm">Хүлээгдэж буй урилгууд</h3>
              <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{pendingUsers.length}</span>
            </div>
            <div className="divide-y divide-zinc-50">
              {pendingUsers.map(u => {
                const role = roleMap[u.role];
                return (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-100/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 text-xs font-bold flex-shrink-0">
                      {u.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-600 truncate">{u.email}</p>
                      <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock size={9} />Илгээсэн: {u.joined}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex-shrink-0 ${role?.color || "bg-zinc-100 text-zinc-600"}`}>
                      {role?.label}
                    </span>
                    <button type="button" className="text-xs font-semibold text-red-500 hover:underline flex-shrink-0">
                      Цуцлах
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </Shell>
  );
}
