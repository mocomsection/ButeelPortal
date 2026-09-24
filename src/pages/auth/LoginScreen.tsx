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
      </div>

      {/* Right 40% — login form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo — centered above form */}
          <div className="flex flex-col items-center pb-6 mb-6 border-b border-zinc-100">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-violet-200" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
              <img src={buteelLogo} alt="Buteel" className="w-9 h-9 object-contain" />
            </div>
            <span className="text-xl font-extrabold text-zinc-900 tracking-tight">Buteel Portal</span>
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
          
        </div>
      </div>
    </div>
  );
}
