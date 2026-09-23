import { TrackData } from "./types";

interface Props {
  track: TrackData;
  updateTrack: (id: string, patch: Partial<TrackData>) => void;
}

// Deprecated — logic moved into SubmitTracksScreen.tsx
export function TrackRightsSection(_: Props) {
  return null;
}
