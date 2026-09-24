import type { ReleaseData } from "@/types";
import musicCover001 from "@/imports/3000x3000bb__1_.jpg";
import musicCover002 from "@/imports/3000x3000bb__2_.jpg";
import musicCover003 from "@/imports/3000x3000bb__3_.jpg";
import musicCover004 from "@/imports/3000x3000bb__4_.jpg";
import musicCover005 from "@/imports/3000x3000bb__5_.jpg";
import musicCover006 from "@/imports/3000x3000bb.jpg";

export const RELEASES: ReleaseData[] = [
  // ── Album (Distributed) ─────────────────────────────────────────────────────
  {
    id: "47382910",
    cover: musicCover001,
    title: "Говийн Оргил",
    primaryArtist: "Энхтайван",
    featArtists: [],
    type: "Album",
    createdAt: "2026-06-10",
    releaseDate: "2026-09-01",
    upc: "8801234567890",
    status: "distributed",
    updatedAt: "2026-09-02 10:15",
    label: "Steppe Records",
    genre: "Traditional",
    subGenre: "Нутгийн дуу",
    contentType: "music",
    services: ["Sonsy Music", "M Music", "Egshig", "Spotify", "Apple Music", "Deezer", "Hitone", "Unimusic"],
    tracks: [
      { no:1, title:"Говийн Оргил",   isrc:"MNSTE2600001", primaryArtist:"Энхтайван", featArtists:[],        explicit:false, duration:"4:32", fileName:"track01.wav", fileSize:"181 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:2, title:"Цагаан Хад",     isrc:"MNSTE2600002", primaryArtist:"Энхтайван", featArtists:["Номин"], explicit:false, duration:"3:58", fileName:"track02.wav", fileSize:"158 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:3, title:"Нутгийн Дуу",    isrc:"MNSTE2600003", primaryArtist:"Энхтайван", featArtists:[],        explicit:false, duration:"5:10", fileName:"track03.wav", fileSize:"206 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:4, title:"Хангайн Салхи",  isrc:"MNSTE2600004", primaryArtist:"Энхтайван", featArtists:["Дорж"],  explicit:false, duration:"4:48", fileName:"track04.wav", fileSize:"191 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:5, title:"Мөнхийн Зам",    isrc:"MNSTE2600005", primaryArtist:"Энхтайван", featArtists:[],        explicit:false, duration:"6:02", fileName:"track05.wav", fileSize:"240 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
    ],
  },

  // ── EP (Reviewing) ──────────────────────────────────────────────────────────
  {
    id: "82719304",
    cover: musicCover002,
    title: "Нэгэн Цаг",
    primaryArtist: "Нэнэ",
    featArtists: ["ThunderZ"],
    type: "EP",
    createdAt: "2026-08-01",
    releaseDate: "2026-09-15",
    upc: "8801234567891",
    status: "reviewing",
    updatedAt: "2026-09-10 14:20",
    label: "Sky Entertainment",
    genre: "Pop",
    subGenre: "Инди поп",
    contentType: "music",
    services: ["Sonsy Music", "Spotify", "Apple Music", "YouTube Music", "Hitone", "SkyMelody"],
    tracks: [
      { no:1, title:"Нэгэн Цаг",  isrc:"MNSKY2600011", primaryArtist:"Нэнэ", featArtists:[],           explicit:false, duration:"3:24", fileName:"track01.wav", fileSize:"136 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:2, title:"Хот Шөнө",   isrc:"MNSKY2600012", primaryArtist:"Нэнэ", featArtists:["ThunderZ"], explicit:false, duration:"3:51", fileName:"track02.wav", fileSize:"153 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:3, title:"Дурсамж",    isrc:"MNSKY2600013", primaryArtist:"Нэнэ", featArtists:[],           explicit:false, duration:"4:08", fileName:"track03.wav", fileSize:"165 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
    ],
  },

  // ── Single (Revision) ───────────────────────────────────────────────────────
  {
    id: "63047291",
    cover: musicCover003,
    title: "Гал Сэтгэл",
    primaryArtist: "ThunderZ",
    featArtists: ["Нэнэ"],
    type: "Single",
    createdAt: "2026-07-20",
    releaseDate: "2026-08-01",
    upc: "8801234567892",
    status: "revision",
    statusReason: "1. Ковер зургийн нягтрал шаардлага хангахгүй байна (3000×3000px шаардлагатай, одоогийн: 1200×1200px).\n2. ISRC код MNTHZ2600021 нь системд бүртгэлтэй байна — шинэ ISRC оруулна уу.\n3. Хамтарсан артист «Нэнэ»-ийн бүртгэлтэй нэр латин үсгээр «Nene» байх шаардлагатай.",
    updatedAt: "2026-08-05 09:30",
    label: "Thunder Music",
    genre: "Hip-Hop / Rap",
    subGenre: "Trap",
    contentType: "music",
    services: ["Sonsy Music", "Spotify", "Apple Music", "YouTube Music", "GTone"],
    tracks: [
      { no:1, title:"Гал Сэтгэл", isrc:"MNTHZ2600021", primaryArtist:"ThunderZ", featArtists:["Нэнэ"], explicit:true, duration:"3:12", fileName:"gal_segtsel_master.wav", fileSize:"128 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
    ],
  },

  // ── Single (Draft) ──────────────────────────────────────────────────────────
  {
    id: "19485720",
    cover: musicCover004,
    title: "Хайр",
    primaryArtist: "Болд",
    featArtists: ["Номин"],
    type: "Single",
    createdAt: "2026-09-01",
    releaseDate: "2026-10-01",
    upc: "",
    status: "draft",
    updatedAt: "2026-09-01 16:20",
    label: "Steppe Records",
    genre: "Pop",
    subGenre: "R&B",
    contentType: "music",
    services: ["Spotify", "Apple Music", "YouTube Music"],
    tracks: [
      { no:1, title:"Хайр", isrc:"", primaryArtist:"Болд", featArtists:["Номин"], explicit:false, duration:"3:55", fileName:"hair_v3.wav", fileSize:"156 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
    ],
  },

  // ── Single (Submitted) ───────────────────────────────────────────────────────
  {
    id: "36204817",
    cover: musicCover005,
    title: "Мөнгөн Шөнө",
    primaryArtist: "Нэнэ",
    featArtists: [],
    type: "Single",
    createdAt: "2026-09-05",
    releaseDate: "2026-10-10",
    upc: "8801234567897",
    status: "submitted",
    updatedAt: "2026-09-05 18:30",
    label: "Sky Entertainment",
    genre: "R&B / Soul",
    subGenre: "Contemporary R&B",
    contentType: "music",
    services: ["Sonsy Music", "Spotify", "Apple Music", "YouTube Music", "SkyMelody"],
    tracks: [
      { no:1, title:"Мөнгөн Шөнө", isrc:"MNSKY2600021", primaryArtist:"Нэнэ", featArtists:[], explicit:false, duration:"3:44", fileName:"mongon_shono_master.wav", fileSize:"149 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
    ],
  },

  // ── EP (Withdrawn) ──────────────────────────────────────────────────────────
  {
    id: "85920374",
    cover: musicCover006,
    title: "Хот Дуусгавар",
    primaryArtist: "DJ Greko",
    featArtists: ["Болд"],
    type: "EP",
    createdAt: "2026-04-10",
    releaseDate: "2026-05-01",
    upc: "8801234567898",
    status: "withdrawn",
    updatedAt: "2026-06-01 09:00",
    label: "Greko Productions",
    genre: "Electronic",
    subGenre: "House",
    contentType: "music",
    services: ["Spotify", "Apple Music", "Deezer"],
    tracks: [
      { no:1, title:"Хот Шөнө",     isrc:"MNGKP2600001", primaryArtist:"DJ Greko", featArtists:[],       explicit:false, duration:"4:22", fileName:"hot_shono.wav",     fileSize:"174 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:2, title:"Дуусгавар",    isrc:"MNGKP2600002", primaryArtist:"DJ Greko", featArtists:["Болд"], explicit:false, duration:"3:55", fileName:"duusgavar.wav",    fileSize:"156 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
      { no:3, title:"Дахин Эргэлт", isrc:"MNGKP2600003", primaryArtist:"DJ Greko", featArtists:[],       explicit:true,  duration:"5:01", fileName:"dahiin_ergelt.wav", fileSize:"200 MB", audioFormat:"WAV", bitrate:"1411kbps", sampleRate:"44.1 kHz", bitDepth:"24-bit" },
    ],
  },
] satisfies ReleaseData[];
