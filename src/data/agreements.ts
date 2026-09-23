import { Music2, Headphones, FileText } from "lucide-react";

export const OB_STEPS = ["Аккаунтын төрөл", "Лейбл тохиргоо", "Гэрээ сонголт", "Дуусгах"];

export const OB_AGREEMENTS = [
  {
    id: "distribution", required: true,
    icon: Music2, iconBg: "bg-[#6C4DF6]",
    bg: "border-[#6C4DF6] bg-violet-50/60", unselBg: "border-zinc-200 hover:border-violet-300",
    badge: "bg-violet-100 text-violet-700",
    name: "Дуу түгээх үйлчилгээний гэрээ",
    desc: "Цахим хөгжмийн тавцнуудад дуугаа тараах",
    services: ["Spotify","Apple Music","YouTube Music","Deezer","Amazon Music","Tidal","Pandora","SoundCloud"],
  },
  {
    id: "prbt", required: false,
    icon: Headphones, iconBg: "bg-blue-600",
    bg: "border-blue-500 bg-blue-50/60", unselBg: "border-zinc-200 hover:border-blue-300",
    badge: "bg-blue-100 text-blue-700",
    name: "PRBT үйлчилгээний гэрээ",
    desc: "Монголын гар утасны компаниудын авах дуу",
    services: ["Unitel PRBT","MobiCom PRBT","Skytel PRBT","G-Mobile PRBT"],
  },
  {
    id: "karaoke", required: false,
    icon: Music2, iconBg: "bg-emerald-600",
    bg: "border-emerald-500 bg-emerald-50/60", unselBg: "border-zinc-200 hover:border-emerald-300",
    badge: "bg-emerald-100 text-emerald-700",
    name: "OTT Karaoke үйлчилгээний гэрээ",
    desc: "Karaoke платформуудад дуугаа оруулах",
    services: ["OTT Karaoke MN","YouTube Karaoke","KTV Platform"],
  },
  {
    id: "sync", required: false,
    icon: FileText, iconBg: "bg-amber-500",
    bg: "border-amber-400 bg-amber-50/60", unselBg: "border-zinc-200 hover:border-amber-300",
    badge: "bg-amber-100 text-amber-700",
    name: "Sync Licensing гэрээ",
    desc: "Кино, реклам, видео контентд ашиглах",
    services: ["TV / Film Sync","Реклам Sync","YouTube Content ID"],
  },
];
