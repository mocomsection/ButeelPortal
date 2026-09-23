import { Disc3, Smartphone, BookOpen, Mic2, Film } from "lucide-react";

export const RELEASE_TYPES = [
  { id: "album",     icon: Disc3,      label: "Цомог / Дуу",  sub: "Single · EP · Album",   available: true },
  { id: "ringtone",  icon: Smartphone, label: "Ring Tone",    sub: "PRBT · Авах дуу",        available: false, lock: "PRBT гэрээ" },
  { id: "audiobook", icon: BookOpen,   label: "Аудио Ном",    sub: "Audio Book",              available: true },
  { id: "karaoke",   icon: Mic2,       label: "Каракоке Дуу", sub: "OTT Karaoke",            available: false, lock: "OTT Karaoke гэрээ" },
  { id: "film",      icon: Film,       label: "Кино",          sub: "Кино видео бүтээл",       available: false, lock: "Кино видео бүтээл түгээх гэрээ" },
];

export const RELEASE_STEPS = ["Үндсэн Мэдээлэл", "Дууны Мэдээлэл", "Ковер Зураг", "Нийтлэх & Түгээх", "Шалгах & Илгээх"];

export const SERVICES_CONFIG = {
  domestic: [
    { id:"sonsy",   name:"Sonsy Music",  available:true },
    { id:"mmusic",  name:"Mmusic",       available:true },
  ],
  international: [
    { id:"egshig",    name:"Egshig Music",  available:true },
    { id:"spotify",   name:"Spotify",       available:true },
    { id:"apple",     name:"Apple Music",   available:true },
    { id:"youtube",   name:"YouTube Music", available:true },
    { id:"deezer",    name:"Deezer",        available:true },
    { id:"amazon",    name:"Amazon Music",  available:true },
    { id:"tidal",     name:"Tidal",         available:true },
    { id:"soundcloud",name:"SoundCloud",    available:true },
  ],
  prbt: [
    { id:"hitone",    name:"HiTone",      available:false },
    { id:"unimusic",  name:"Unimusic",    available:false },
    { id:"skymelody", name:"Skymelody",   available:false },
    { id:"gtone",     name:"GTone",       available:false },
  ],
  karaoke: [
    { id:"gopluskaraoke", name:"Go Plus Karaoke", available:false },
    { id:"vookaraoke",    name:"Voo Karaoke",      available:false },
  ],
};

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
    submitPath: "/submit/audiobook-info",
  },
  {
    id: "film",
    icon: Film,
    label: "Кино",
    sub: "Богино хэрэглэл · Документаль · Тоглолт",
    contractName: "Кино видео бүтээл түгээх гэрээ",
    available: true,
    color: "amber",
    submitPath: "/submit/film-info",
  },
];
