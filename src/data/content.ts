import { Disc3, BookOpen, Film } from "lucide-react";

export const RELEASE_STEPS = ["Үндсэн Мэдээлэл", "Дууны Мэдээлэл", "Ковер Зураг", "Нийтлэх & Түгээх", "Шалгах & Илгээх"];

export const CONTENT_TYPES = [
  {
    id: "music",
    icon: Disc3,
    label: "Цомог / Дуу",
    sub: "Single · EP · Album · Ringtone · Karaoke",
    contractName: "Дуу түгээх гэрээ",
    available: true,
    color: "violet",
    submitPath: "/submit/release-info",
  },
  {
    id: "audiobook",
    icon: BookOpen,
    label: "Аудио ном",
    sub: "Ном, Podcast, Хичээл",
    contractName: "Аудио ном түгээх гэрээ",
    available: true,
    color: "blue",
    submitPath: "/submit/audiobook",
  },
  {
    id: "film",
    icon: Film,
    label: "Кино",
    sub: "Богино хэрэглэл · Документаль · Тоглолт",
    contractName: "Кино видео бүтээл түгээх гэрээ",
    available: true,
    color: "amber",
    submitPath: "/submit/film",
  },
];
