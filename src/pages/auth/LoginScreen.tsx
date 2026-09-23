import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Input } from "@/components/ui/Input";
import { Btn } from "@/components/ui/Btn";

const MOSAIC_IDS = [
  "1676068368612-1c8b3e2afed0","1635169852185-37f90ac07189","1736882178500-f99bbe22d77d","1618172842918-3eabce30c912",
  "1657627157213-c5f44dbd0724","1630917162522-73e16631c059","1766430414516-95fc5903b234","1749496935342-11fddc03871c",
  "1719090024588-80c604910b14","1713880854797-3299ceb6ae4e","1766430414531-b992dacf1a5e","1636690619068-eb3849be82d1",
  "1676068368612-1c8b3e2afed0","1635169852185-37f90ac07189","1736882178500-f99bbe22d77d","1618172842918-3eabce30c912",
  "1657627157213-c5f44dbd0724","1630917162522-73e16631c059","1766430414516-95fc5903b234","1749496935342-11fddc03871c",
  "1719090024588-80c604910b14","1713880854797-3299ceb6ae4e","1766430414531-b992dacf1a5e","1636690619068-eb3849be82d1",
];

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="min-h-screen flex">
      {/* Left 60% — album mosaic */}
      <div className="hidden lg:block w-[60%] relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 grid grid-cols-4" style={{ gridTemplateRows: "repeat(6, 1fr)" }}>
          {MOSAIC_IDS.map((id, i) => (
            <div key={i} className="relative overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&q=70&auto=format`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#1a0533]/25" />
            </div>
          ))}
        </div>
        {/* right-edge fade into the white panel */}
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-white/30" />
        {/* bottom brand lockup */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0f0025]/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-8 left-8 z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/40" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <p className="text-white font-extrabold text-xl leading-none">Buteel</p>
            <p className="text-white/55 text-xs mt-0.5">Монгол хөгжимчдийн платформ</p>
          </div>
        </div>
      </div>

      {/* Right 40% — login form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
              <img src={buteelLogo} alt="Buteel" className="w-9 h-9 object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900">Buteel</h1>
          </div>

          <h2 className="text-2xl font-extrabold text-zinc-900 mb-1">Нэвтрэх</h2>
          <p className="text-sm text-zinc-400 mb-8">Тавтай морилно уу. Аккаунтаа нэвтрэнэ үү.</p>

          <div className="space-y-4">
            <Input label="И-мэйл хаяг" type="email" placeholder="name@example.com" value={email} onChange={setEmail} />
            <Input label="Нууц үг" type="password" placeholder="••••••••" value={pass} onChange={setPass} />
            <div className="flex justify-end -mt-1">
              <button className="text-sm text-primary hover:text-primary/80 font-medium">Нууц үгээ мартсан?</button>
            </div>
            <Btn full size="lg" onClick={() => navigate("/dashboard")}>Нэвтрэх</Btn>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <span className="text-sm text-zinc-500">Аккаунт байхгүй юу? </span>
            <button type="button" className="text-sm font-semibold text-primary hover:text-primary/80" onClick={() => navigate("/register")}>Бүртгүүлэх</button>
          </div>

          {/* Demo shortcut */}
          <div className="mt-4 p-3 rounded-xl bg-violet-50 border border-violet-100">
            <p className="text-xs text-violet-500 font-semibold uppercase mb-1.5">Шинэ аккаунт нээх урсгал</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "① Бүртгэл",        path: "/register" },
                { label: "② Баталгаа",        path: "/verify" },
                { label: "③ Аккаунт төрөл",  path: "/onboarding/account-type" },
                { label: "④ Лейбл",           path: "/onboarding/label" },
                { label: "⑤ Гэрээ",           path: "/onboarding/agreements" },
                { label: "⑥ Дуусгах",         path: "/onboarding/complete" },
              ].map(({ label, path }) => (
                <button type="button" key={path}
                  onClick={() => navigate(path)}
                  className="text-xs font-semibold bg-white border border-violet-200 text-violet-700 hover:bg-violet-100 px-2.5 py-1 rounded-lg transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
