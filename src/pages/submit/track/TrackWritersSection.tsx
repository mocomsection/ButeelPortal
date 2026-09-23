import { TrackData, Writer } from "./types";

interface Props {
  track: TrackData;
  updateTrack: (id: string, patch: Partial<TrackData>) => void;
  addWriter: (trackId: string, track: TrackData, w: { id: string; name: string; role: string }) => void;
}

// Deprecated — logic moved into SubmitTracksScreen.tsx
export function TrackWritersSection(_: Props) {
  return null;
}
