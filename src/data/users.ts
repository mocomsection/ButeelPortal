import { Shield, Music2, TrendingUp, Eye } from "lucide-react";

export const USER_ROLES = [
  {
    id: "admin",
    label: "Үндсэн Хэрэглэгч",
    desc: "Бүх эрх. Аккаунт удирдах, контент илгээх, орлого харах.",
    color: "bg-violet-100 text-violet-700",
    icon: Shield,
    access: ["Хяналтын самбар", "Каталог", "Контент нэмэх", "Орлого", "Хэрэглэгчид", "Аккаунт"],
  },
  {
    id: "artist",
    label: "Зохиолч / Артист",
    desc: "Каталог харах, контент илгээх эрхтэй. Орлого, аккаунт харахгүй.",
    color: "bg-blue-100 text-blue-700",
    icon: Music2,
    access: ["Хяналтын самбар", "Каталог", "Контент нэмэх"],
  },
  {
    id: "finance",
    label: "Санхүүгийн Ажилтан",
    desc: "Орлого ба тайлан хэсгийг харах эрхтэй. Контент илгээхгүй.",
    color: "bg-green-100 text-green-700",
    icon: TrendingUp,
    access: ["Хяналтын самбар", "Орлого", "Тайлан"],
  },
  {
    id: "readonly",
    label: "Зөвхөн Харах",
    desc: "Хяналтын самбар болон каталогийг зөвхөн харах боломжтой.",
    color: "bg-zinc-100 text-zinc-600",
    icon: Eye,
    access: ["Хяналтын самбар", "Каталог"],
  },
];

export const USERS_DATA = [
  { id:"U1", name:"Болд Жаргал",   email:"bold@example.mn",   role:"admin",   status:"active",  joined:"2024-10-15", initials:"БЖ", labels:["Steppe Records"] },
  { id:"U2", name:"Эрдэнэ Батаар", email:"erdene@example.mn", role:"artist",  status:"active",  joined:"2024-11-02", initials:"ЭБ", labels:["Steppe Records"] },
  { id:"U3", name:"Номин Цэрэн",   email:"nomin@example.mn",  role:"finance", status:"active",  joined:"2024-12-20", initials:"НЦ", labels:["Steppe Records"] },
  { id:"U4", name:"Ганчимэг Дорж", email:"ganchi@example.mn", role:"artist",  status:"invited", joined:"2025-01-08", initials:"ГД", labels:["Steppe Records"] },
];
