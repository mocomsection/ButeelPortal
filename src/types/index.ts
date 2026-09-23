export type StatusType = "draft" | "submitted" | "reviewing" | "revision" | "approved" | "distributed" | "failed" | "paid" | "waiting" | "withdrawn";
export const STATUS_MAP: Record<StatusType, { label: string; cls: string }> = {
  draft:        { label: "Ноорог",               cls: "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200" },
  submitted:    { label: "Илгээгдсэн",            cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  reviewing:    { label: "Шалгагдаж Байна",      cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  revision:     { label: "Засвар Шаардсан",      cls: "bg-red-50 text-red-700 ring-1 ring-red-200" },
  approved:     { label: "Батлагдсан",           cls: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  distributed:  { label: "Түгээгдсэн",            cls: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  failed:       { label: "Амжилтгүй",            cls: "bg-red-50 text-red-700 ring-1 ring-red-200" },
  paid:         { label: "Төлөгдсөн",            cls: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  waiting:      { label: "Хүлээгдэж Байна",      cls: "bg-orange-50 text-orange-700 ring-1 ring-orange-200" },
  withdrawn:    { label: "Татан Буулгасан",       cls: "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200" },
};

export interface Track {
  no: number; title: string; isrc: string; primaryArtist: string;
  featArtists: string[]; explicit: boolean; duration: string;
  fileName: string; fileSize: string; audioFormat: string; bitrate: string;
  sampleRate?: string; bitDepth?: string;
}
export interface ReleaseData {
  id: string; title: string; primaryArtist: string; featArtists: string[];
  type: "Single" | "EP" | "Album"; createdAt: string; releaseDate: string;
  upc: string; status: StatusType; statusReason?: string; updatedAt: string;
  label: string; genre: string; subGenre?: string;
  contentType: "music" | "audiobook" | "film";
  services: string[];
  tracks: Track[];
  synopsis?: string;
  ageRating?: string;
  filmDuration?: string;
  trailerUrl?: string;
  cast?: { name: string; role: string }[];
}
