import { TrackData } from "./types";

interface Props {
  track: TrackData;
  isSingle: boolean;
  updateTrack: (id: string, patch: Partial<TrackData>) => void;
}

// Deprecated — logic moved into SubmitTracksScreen.tsx
export function TrackBasicSection(_: Props) {
  return null;
}
