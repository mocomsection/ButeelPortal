import { useState, useRef, useEffect } from "react";
import { X, Clock, CheckCircle2, MoreHorizontal, UserPlus, Shield, User, Trash2, RefreshCw } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { USER_ROLES, USERS_DATA } from "@/data/users";

type UserRow = typeof USERS_DATA[0];

function ActionMenu({
  user,
  anchorRef,
  onClose,
  onResend,
  onRemove,
}: {
  user: UserRow;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onResend?: () => void;
  onRemove: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      const menuWidth = 192;
      setPos({
        top: rect.bottom + 4,
        left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
      });
    }
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  return (
    <div ref={menuRef}
      className="fixed z-50 bg-white rounded-xl shadow-xl border border-border py-1 w-48"
      style={{ top: pos.top, left: pos.left }}>
      {onResend && (
        <button type="button"
          onClick={() => { onResend(); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors text-left">
          <RefreshCw size={13} className="text-zinc-400" />Урилга дахин илгээх
        </button>
      )}
      <button type="button"
        onClick={() => { onRemove(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left">
        <Trash2 size={13} />
        {user.status === "invited" ? "Урилга цуцлах" : "Хэрэглэгч хасах"}
      </button>
    </div>
  );
}

export default function UsersScreen() {
  const [users, setUsers] = useState(USERS_DATA);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("sub");
  const [inviteSent, setInviteSent] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const roleMap = Object.fromEntries(USER_ROLES.map(r => [r.id, r]));
  const activeUsers  = users.filter(u => u.status === "active");
  const pendingUsers = users.filter(u => u.status === "invited");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleRemove = (id: string, status: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast(status === "invited" ? "Урилга цуцлагдлаа." : "Хэрэглэгч хасагдлаа.");
  };

  const handleResend = (email: string) => {
    showToast(`Урилга дахин илгээгдлээ → ${email}`);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const initials = inviteEmail.slice(0, 2).toUpperCase();
    setUsers(prev => [...prev, {
      id: `U${Date.now()}`,
      name: inviteEmail,
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      joined: new Date().toISOString().slice(0, 10),
      initials,
    }]);
    showToast(`Урилга илгээгдлээ → ${inviteEmail}`);
    setInviteEmail("");
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInvite(false); }, 1200);
  };

  return (
    <Shell title="Хэрэглэгч удирдах" subtitle="Аккаунтад нэвтрэх хэрэглэгчид">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />{toast}
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { if (!inviteSent) setShowInvite(false); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            {inviteSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={22} className="text-green-600" />
                </div>
                <p className="font-bold text-zinc-900 text-sm mb-1">Урилга илгээгдлээ</p>
                <p className="text-xs text-zinc-500">{inviteEmail}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-zinc-900 text-lg">Хэрэглэгч урих</h3>
                  <button type="button" onClick={() => setShowInvite(false)}
                    className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-colors">
                    <X size={17} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold normal-case text-zinc-400 block mb-1.5">И-мэйл хаяг</label>
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      placeholder="user@example.mn"
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold normal-case text-zinc-400 block mb-2">Хандах эрх</label>
                    <div className="space-y-2">
                      {USER_ROLES.filter(r => r.id !== "admin").map(r => {
                        const RIcon = r.icon;
                        const selected = inviteRole === r.id;
                        return (
                          <label key={r.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selected ? "border-primary bg-primary/5" : "border-zinc-200 hover:bg-zinc-50"}`}>
                            <input type="radio" name="role" value={r.id} checked={selected}
                              onChange={() => setInviteRole(r.id)} className="accent-[var(--primary)] flex-shrink-0" />
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? "bg-primary/10" : "bg-zinc-100"}`}>
                              <RIcon size={15} className={selected ? "text-primary" : "text-zinc-400"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-zinc-800"}`}>{r.label}</p>
                              <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{r.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="button" onClick={() => setShowInvite(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                    Болих
                  </button>
                  <button type="button" disabled={!inviteEmail.trim()} onClick={handleInvite}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                    Урилга илгээх
                  </button>
                </div>
              </>
            )}
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
            <Btn icon={<UserPlus size={14} />} size="sm" onClick={() => { setInviteEmail(""); setInviteRole("sub"); setInviteSent(false); setShowInvite(true); }}>Урих</Btn>
          </div>
          <div className="divide-y divide-zinc-50">
            {activeUsers.map(u => {
              const role = roleMap[u.role];
              const isAdmin = u.role === "admin";
              const RoleIcon = isAdmin ? Shield : User;
              return (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50/60 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${isAdmin ? "bg-violet-100 text-violet-700" : "bg-primary/10 text-primary"}`}>
                    {u.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-zinc-900">{u.name}</p>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{u.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 flex items-center gap-1 ${role?.color || "bg-zinc-100 text-zinc-600"}`}>
                    <RoleIcon size={10} />
                    {role?.label}
                  </span>
                  {!isAdmin && (
                    <div className="flex-shrink-0">
                      <button type="button"
                        ref={openMenuId === u.id ? anchorRef : undefined}
                        onClick={e => { anchorRef.current = e.currentTarget; setOpenMenuId(openMenuId === u.id ? null : u.id); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
                        <MoreHorizontal size={15} />
                      </button>
                      {openMenuId === u.id && (
                        <ActionMenu
                          user={u}
                          anchorRef={anchorRef}
                          onClose={() => setOpenMenuId(null)}
                          onRemove={() => handleRemove(u.id, u.status)}
                        />
                      )}
                    </div>
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
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50/60 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 text-xs font-bold flex-shrink-0">
                      {u.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-600 truncate">{u.email}</p>
                      <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock size={9} />Илгээсэн: {u.joined}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 flex items-center gap-1 ${role?.color || "bg-zinc-100 text-zinc-600"}`}>
                      <User size={10} />
                      {role?.label}
                    </span>
                    <div className="flex-shrink-0">
                      <button type="button"
                        ref={openMenuId === u.id ? anchorRef : undefined}
                        onClick={e => { anchorRef.current = e.currentTarget; setOpenMenuId(openMenuId === u.id ? null : u.id); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
                        <MoreHorizontal size={15} />
                      </button>
                      {openMenuId === u.id && (
                        <ActionMenu
                          user={u}
                          anchorRef={anchorRef}
                          onClose={() => setOpenMenuId(null)}
                          onResend={() => handleResend(u.email)}
                          onRemove={() => handleRemove(u.id, u.status)}
                        />
                      )}
                    </div>
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
