export type ArtistRef = { id: string; name: string; tags: string };
export type ContribRef = { id: string; name: string; affiliation: string };
export type OtherContribRef = { id: string; name: string; role: string };

export interface TrackData {
  id: string;
  // Localized titles (album mode; single inherits from release)
  titleMn: string;
  titleEn: string;
  titleLang: "mn" | "en";
  // Track-level artists and genre (album mode)
  trackPrimary: ArtistRef[];
  trackFeatured: ArtistRef[];
  trackPrimarySearch: string;
  trackFeatSearch: string;
  showTrackPrimaryDrop: boolean;
  showTrackFeatDrop: boolean;
  trackGenre: string;
  trackSecondaryGenre: string;
  // Audio
  hasAudio: boolean;
  audioName: string;
  duration: string;
  fileFormat: string;
  sampleRate: string;
  bitDepth: string;
  uploadProgress: number;
  uploading: boolean;
  // ISRC
  isrcMode: "generate" | "existing";
  isrc: string;
  // Lyrics
  hasLyrics: boolean | null;
  explicitStatus: "not_explicit" | "explicit";
  vocalLanguage: string;
  lyrics: string;
  // Contributors
  composers: ContribRef[];
  lyricists: ContribRef[];
  otherContribs: OtherContribRef[];
  // Add-form inline state
  showAddComposer: boolean;
  addComposerName: string;
  addComposerAffil: string;
  showAddLyricist: boolean;
  addLyricistName: string;
  addLyricistAffil: string;
  showAddOther: boolean;
  addOtherRole: string;
  addOtherName: string;
}

export function makeTrack(id: number, releasePrimary: ArtistRef[] = []): TrackData {
  return {
    id: `T${id}`,
    titleMn: "", titleEn: "", titleLang: "mn",
    trackPrimary: [...releasePrimary], trackFeatured: [],
    trackPrimarySearch: "", trackFeatSearch: "",
    showTrackPrimaryDrop: false, showTrackFeatDrop: false,
    trackGenre: "", trackSecondaryGenre: "",
    hasAudio: false, audioName: "", duration: "",
    fileFormat: "", sampleRate: "", bitDepth: "",
    uploadProgress: 0, uploading: false,
    isrcMode: "generate", isrc: "",
    hasLyrics: null, explicitStatus: "not_explicit", vocalLanguage: "", lyrics: "",
    composers: [], lyricists: [], otherContribs: [],
    showAddComposer: false, addComposerName: "", addComposerAffil: "",
    showAddLyricist: false, addLyricistName: "", addLyricistAffil: "",
    showAddOther: false, addOtherRole: "producer", addOtherName: "",
  };
}

// Legacy compat for older sub-components
export type Writer = {
  id: string; name: string;
  role: "Үг" | "Ая" | "Үг & Ая" | "Бусад";
  publisher: string; customPublisher: string;
};
