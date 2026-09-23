import { useNavigate } from "react-router";
import { Btn } from "@/components/ui/Btn";

export default function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-black text-zinc-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Хуудас олдсонгүй</h1>
        <p className="text-zinc-500 text-sm mb-6">Энэ хаяг байхгүй эсвэл устсан байна.</p>
        <Btn onClick={() => navigate("/revenue")}>Нүүр хуудас руу буцах</Btn>
      </div>
    </div>
  );
}
