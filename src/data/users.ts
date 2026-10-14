import { Shield, User } from "lucide-react";

export const USER_ROLES = [
  {
    id: "admin",
    label: "Үндсэн хэрэглэгч",
    desc: "Бүх эрх. Аккаунт удирдах, контент илгээх, орлого харах.",
    color: "bg-violet-100 text-violet-700",
    icon: Shield,
    access: ["Хяналтын самбар", "Каталог", "Контент нэмэх", "Орлого", "Хэрэглэгчид", "Аккаунт"],
  },
  {
    id: "sub",
    label: "Дэд хэрэглэгч",
    desc: "Каталог харах, контент илгээх эрхтэй. Орлого, аккаунт удирдахгүй.",
    color: "bg-blue-100 text-blue-700",
    icon: User,
    access: ["Хяналтын самбар", "Каталог", "Контент нэмэх"],
  },
];

export const USERS_DATA = [
  { id:"U1", name:"Болд Жаргал",   email:"bold@example.mn",   role:"admin", status:"active",  joined:"2024-10-15", initials:"БЖ" },
  { id:"U2", name:"Эрдэнэ Батаар", email:"erdene@example.mn", role:"sub",   status:"active",  joined:"2024-11-02", initials:"ЭБ" },
  { id:"U3", name:"Номин Цэрэн",   email:"nomin@example.mn",  role:"sub",   status:"active",  joined:"2024-12-20", initials:"НЦ" },
  { id:"U4", name:"Ганчимэг Дорж", email:"ganchi@example.mn", role:"sub",   status:"invited", joined:"2025-01-08", initials:"ГД" },
];
