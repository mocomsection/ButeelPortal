import type { ReleaseData } from "@/types";
import abCover001 from "@/imports/eyJidWNrZXQiOiJnZXJ1LW1uIiwia2V5IjoibGlua2x5L2ZpbGUtdXBsb2Fkcy9BTVdxRGhEVFdRSWRfaEFWOWd2YkoiLCJlZGl0cyI6eyJyZXNpemUiOnsiaGVpZ2h0Ijo2MDAsIndpZHRoIjo2MDAsImZpdCI6ImNvbnRhaW4iLCJiYWNrZ3JvdW5kIjoiI2ZmZiJ9LC.png";
import abCover002 from "@/imports/eyJidWNrZXQiOiJnZXJ1LW1uIiwia2V5IjoibGlua2x5L2ZpbGUtdXBsb2Fkcy9GYk1ta1lyMHVMcjR5RVJqUlZZcDgiLCJlZGl0cyI6eyJyZXNpemUiOnsiaGVpZ2h0Ijo2MDAsIndpZHRoIjo2MDAsImZpdCI6ImNvbnRhaW4iLCJiYWNrZ3JvdW5kIjoiI2ZmZi__1_.png";
import abCover003 from "@/imports/eyJidWNrZXQiOiJnZXJ1LW1uIiwia2V5IjoibGlua2x5L2ZpbGUtdXBsb2Fkcy83bWlLM0JvTzJMTnFuTUFCUjJNWU8iLCJlZGl0cyI6eyJyZXNpemUiOnsiaGVpZ2h0Ijo2MDAsIndpZHRoIjo2MDAsImZpdCI6ImNvbnRhaW4iLCJiYWNrZ3JvdW5kIjoiI2ZmZiJ9LC.png";
import abCover004 from "@/imports/eyJidWNrZXQiOiJnZXJ1LW1uIiwia2V5IjoibGlua2x5L2ZpbGUtdXBsb2Fkcy90UWpOU2xRRXZBeTByUU90TG9ncHkiLCJlZGl0cyI6eyJyZXNpemUiOnsiaGVpZ2h0Ijo2MDAsIndpZHRoIjo2MDAsImZpdCI6ImNvbnRhaW4iLCJiYWNrZ3JvdW5kIjoiI2ZmZiJ9LC.jpg";
import abCover005 from "@/imports/eyJidWNrZXQiOiJnZXJ1LW1uIiwia2V5IjoibGlua2x5L2ZpbGUtdXBsb2Fkcy9xV3BrblpNaTlVTTBqa2pKWC1Sam4iLCJlZGl0cyI6eyJyZXNpemUiOnsiaGVpZ2h0Ijo2MDAsIndpZHRoIjo2MDAsImZpdCI6ImNvbnRhaW4iLCJiYWNrZ3JvdW5kIjoiI2ZmZiJ9LC.png";

export const AUDIOBOOKS: ReleaseData[] = [
  // ── Audiobook (Distributed) ──────────────────────────────────────────────────
  {
    id: "57312840",
    cover: abCover001,
    title: "Нутгийн тэмдэглэл",
    primaryArtist: "Болд Жаргал",
    featArtists: [],
    type: "Album",
    createdAt: "2025-03-10",
    releaseDate: "2025-04-01",
    upc: "8801234567894",
    status: "distributed",
    updatedAt: "2025-04-05 10:00",
    label: "Steppe Records",
    genre: "Audiobook",
    synopsis: "Монгол хөдөөгийн уламжлалт ахуй амьдралын дурсамжийг цэгцтэй тэмдэглэн бичсэн хоёр хэсгээс бүрдсэн аудио номын эхний боть.",
    contentType: "audiobook",
    services: ["Audible", "Apple Books", "Google Play Books"],
    tracks: [
      { no:1, title:"1-р бүлэг: Эхлэл",   isrc:"MNSTE2500010", primaryArtist:"Болд Жаргал", featArtists:[], explicit:false, duration:"12:30", fileName:"chapter01.wav", fileSize:"297 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:2, title:"2-р бүлэг: Зам мөр", isrc:"MNSTE2500011", primaryArtist:"Болд Жаргал", featArtists:[], explicit:false, duration:"15:45", fileName:"chapter02.wav", fileSize:"374 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
    ],
  },

  // ── Audiobook (Reviewing) ────────────────────────────────────────────────────
  {
    id: "28473910",
    cover: abCover002,
    title: "Чингисийн Зам",
    primaryArtist: "Д. Мөнхбат",
    featArtists: [],
    type: "Album",
    createdAt: "2026-07-15",
    releaseDate: "2026-10-01",
    upc: "8801234567896",
    status: "reviewing",
    updatedAt: "2026-08-20 11:00",
    label: "Heritage Audio",
    genre: "Audiobook",
    synopsis: "Монгол эзэнт гүрний үүсэл, тэлэлт, уналтын тухай өгүүлдэг түүхэн аудио ном. Чингис хааны амьдрал, тулалдааны дайчин замыг тайлбарлан өгүүлнэ.",
    contentType: "audiobook",
    services: ["Audible", "Apple Books"],
    tracks: [
      { no:1, title:"1-р бүлэг: Тал нутгийн хүү",      isrc:"MNHAG2600001", primaryArtist:"Д. Мөнхбат", featArtists:[], explicit:false, duration:"18:20", fileName:"ch01.wav", fileSize:"436 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:2, title:"2-р бүлэг: Нэгдэл ба тулалдаан", isrc:"MNHAG2600002", primaryArtist:"Д. Мөнхбат", featArtists:[], explicit:false, duration:"21:05", fileName:"ch02.wav", fileSize:"500 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:3, title:"3-р бүлэг: Эзэнт гүрний өргөн",  isrc:"MNHAG2600003", primaryArtist:"Д. Мөнхбат", featArtists:[], explicit:false, duration:"19:48", fileName:"ch03.wav", fileSize:"470 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
    ],
  },

  // ── Audiobook (Distributed) ──────────────────────────────────────────────────
  {
    id: "42918305",
    cover: abCover003,
    title: "Нүүдлийн Соёл",
    primaryArtist: "Б. Дашдорж",
    featArtists: [],
    type: "Album",
    createdAt: "2026-01-15",
    releaseDate: "2026-02-01",
    upc: "8801234567901",
    status: "distributed",
    updatedAt: "2026-02-05 09:00",
    label: "Steppe Records",
    genre: "Audiobook",
    synopsis: "Монгол нүүдлийн соёл иргэншлийн гарал үүсэл, өв уламжлал, орчин цагийн ертөнцөд хэрхэн оршин тогтнож байгааг судалсан ерөнхий боловсролын аудио ном.",
    contentType: "audiobook",
    services: ["Audible", "Apple Books", "Google Play Books"],
    tracks: [
      { no:1, title:"1-р бүлэг: Эзэгтэй тал нутаг",    isrc:"MNSTE2600101", primaryArtist:"Б. Дашдорж", featArtists:[], explicit:false, duration:"14:20", fileName:"ch01.wav", fileSize:"341 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:2, title:"2-р бүлэг: Гэр ба гэр бүл",        isrc:"MNSTE2600102", primaryArtist:"Б. Дашдорж", featArtists:[], explicit:false, duration:"16:05", fileName:"ch02.wav", fileSize:"382 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:3, title:"3-р бүлэг: Аж ахуй ба уламжлал",   isrc:"MNSTE2600103", primaryArtist:"Б. Дашдорж", featArtists:[], explicit:false, duration:"18:40", fileName:"ch03.wav", fileSize:"443 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:4, title:"4-р бүлэг: Орчин үед",               isrc:"MNSTE2600104", primaryArtist:"Б. Дашдорж", featArtists:[], explicit:false, duration:"13:55", fileName:"ch04.wav", fileSize:"331 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
    ],
  },

  // ── Audiobook (Revision) ─────────────────────────────────────────────────────
  {
    id: "67035192",
    cover: abCover004,
    title: "Хайрын Үлгэр",
    primaryArtist: "Н. Баясгалан",
    featArtists: [],
    type: "Album",
    createdAt: "2026-05-20",
    releaseDate: "2026-07-01",
    upc: "",
    status: "revision",
    updatedAt: "2026-06-15 14:30",
    label: "Heritage Audio",
    genre: "Audiobook",
    synopsis: "Хүүхдэд зориулсан уянгын үлгэр туужуудын цуглуулга. Хайр, найрамдал, зоригийн сэдэвтэй богино өгүүллэгүүдийг уран уншигч дуут өнгөөр амилуулжээ.",
    statusReason: "Бүлэг 3-ын аудио чанар шаардлага хангахгүй байна. Дахин бичлэг хийж илгээнэ үү.",
    contentType: "audiobook",
    services: ["Audible", "Apple Books"],
    tracks: [
      { no:1, title:"1-р үлгэр: Арслан ба Жараахай",    isrc:"MNHAG2600011", primaryArtist:"Н. Баясгалан", featArtists:[], explicit:false, duration:"8:15",  fileName:"story01.wav", fileSize:"196 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:2, title:"2-р үлгэр: Нарны охин",              isrc:"MNHAG2600012", primaryArtist:"Н. Баясгалан", featArtists:[], explicit:false, duration:"9:40",  fileName:"story02.wav", fileSize:"230 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:3, title:"3-р үлгэр: Хурдан Морь",             isrc:"MNHAG2600013", primaryArtist:"Н. Баясгалан", featArtists:[], explicit:false, duration:"11:20", fileName:"story03.wav", fileSize:"269 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
    ],
  },

  // ── Audiobook (Draft) ────────────────────────────────────────────────────────
  {
    id: "93810472",
    cover: abCover005,
    title: "Монгол Судар",
    primaryArtist: "Э. Гантулга",
    featArtists: [],
    type: "Album",
    createdAt: "2026-09-01",
    releaseDate: "2026-11-15",
    upc: "",
    status: "draft",
    updatedAt: "2026-09-18 11:00",
    label: "Nomad Audio",
    genre: "Audiobook",
    synopsis: "Монголын эртний сударт тэмдэглэгдсэн он дараалал, домог, угсаа гарал, дайн тулааны тухай тэмдэглэлүүдийг орчин цагийн монгол хэлнээ шилжүүлэн аудио номын хэлбэрт оруулжээ.",
    contentType: "audiobook",
    services: ["Audible"],
    tracks: [
      { no:1, title:"Нэгдүгээр хэсэг: Гарал үүсэл",    isrc:"MNNOM2600001", primaryArtist:"Э. Гантулга", featArtists:[], explicit:false, duration:"22:10", fileName:"part1.wav", fileSize:"527 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
      { no:2, title:"Хоёрдугаар хэсэг: Дайн ба тулаан", isrc:"MNNOM2600002", primaryArtist:"Э. Гантулга", featArtists:[], explicit:false, duration:"25:35", fileName:"part2.wav", fileSize:"608 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"16-bit" },
    ],
  },
] satisfies ReleaseData[];
