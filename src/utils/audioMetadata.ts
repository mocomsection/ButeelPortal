export interface AudioMetadata {
  duration: string;
  sampleRate: string;
  bitDepth: string;
  fileFormat: string;
  fileSize: string;
  bitrate: string;
  uploadedAt: string;
}

export async function readAudioMetadata(file: File): Promise<AudioMetadata> {
  const buffer = await file.slice(0, 65536).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const signature = (offset: number, length: number) => String.fromCharCode(...bytes.slice(offset, offset + length));
  let sampleRate = 0;
  let bitDepth = 0;
  let duration = 0;
  let bitrate = 0;

  if (signature(0, 4) === "RIFF" && signature(8, 4) === "WAVE") {
    let byteRate = 0;
    let dataSize = 0;
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const size = view.getUint32(offset + 4, true);
      const chunk = signature(offset, 4);
      if (chunk === "fmt " && size >= 16 && offset + 24 <= bytes.length) {
        sampleRate = view.getUint32(offset + 12, true);
        byteRate = view.getUint32(offset + 16, true);
        bitrate = byteRate * 8;
        bitDepth = view.getUint16(offset + 22, true);
      }
      if (chunk === "data") {
        dataSize = Math.min(size, Math.max(0, file.size - offset - 8));
        break;
      }
      offset += 8 + size + size % 2;
    }
    if (byteRate) duration = dataSize / byteRate;
  } else if (signature(0, 4) === "fLaC" && bytes.length >= 42 && (bytes[4] & 127) === 0) {
    sampleRate = (bytes[18] << 12) | (bytes[19] << 4) | (bytes[20] >> 4);
    bitDepth = (((bytes[20] & 1) << 4) | (bytes[21] >> 4)) + 1;
    const totalSamples = (bytes[21] & 15) * 4294967296 + view.getUint32(22, false);
    if (sampleRate) duration = totalSamples / sampleRate;
  } else if ((signature(0, 4) === "FORM") && ["AIFF", "AIFC"].includes(signature(8, 4))) {
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const size = view.getUint32(offset + 4, false);
      if (signature(offset, 4) === "COMM" && size >= 18 && offset + 26 <= bytes.length) {
        const channels = view.getUint16(offset + 8, false);
        const samples = view.getUint32(offset + 10, false);
        bitDepth = view.getUint16(offset + 14, false);
        const exponent = view.getUint16(offset + 16, false) & 32767;
        const mantissa = view.getUint32(offset + 18, false) * 4294967296 + view.getUint32(offset + 22, false);
        sampleRate = Math.round(mantissa * 2 ** (exponent - 16383 - 63));
        if (sampleRate) duration = samples / sampleRate;
        if (signature(8, 4) === "AIFF") bitrate = sampleRate * channels * bitDepth;
        break;
      }
      offset += 8 + size + size % 2;
    }
  } else if (/\.mp3$/i.test(file.name)) {
    let start = 0;
    if (signature(0, 3) === "ID3" && bytes.length >= 10) {
      start = 10 + ((bytes[6] & 127) * 2097152 + (bytes[7] & 127) * 16384 + (bytes[8] & 127) * 128 + (bytes[9] & 127));
    }
    for (let offset = start; offset + 4 <= bytes.length; offset++) {
      if (bytes[offset] !== 255 || (bytes[offset + 1] & 224) !== 224) continue;
      const version = (bytes[offset + 1] >> 3) & 3;
      const layer = (bytes[offset + 1] >> 1) & 3;
      const rateIndex = (bytes[offset + 2] >> 2) & 3;
      const bitrateIndex = (bytes[offset + 2] >> 4) & 15;
      if (version === 1 || layer !== 1 || rateIndex === 3 || bitrateIndex === 0 || bitrateIndex === 15) continue;
      sampleRate = [44100, 48000, 32000][rateIndex] / (version === 3 ? 1 : version === 2 ? 2 : 4);
      break;
    }
  }

  if (!duration) {
    duration = await new Promise<number>(resolve => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      const finish = (value: number) => {
        clearTimeout(timeout);
        audio.onloadedmetadata = null;
        audio.onerror = null;
        audio.removeAttribute("src");
        audio.load();
        URL.revokeObjectURL(url);
        resolve(value);
      };
      const timeout = setTimeout(() => finish(0), 5000);
      audio.onloadedmetadata = () => finish(Number.isFinite(audio.duration) ? audio.duration : 0);
      audio.onerror = () => finish(0);
      audio.preload = "metadata";
      audio.src = url;
    });
  }

  const seconds = Math.round(duration);
  const averageBitrate = duration > 0 ? file.size * 8 / duration : 0;
  return {
    duration: duration > 0 ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "",
    sampleRate: sampleRate ? `${sampleRate / 1000} kHz` : "kHz: Уншигдсангүй",
    bitDepth: bitDepth ? `${bitDepth} bits` : "",
    uploadedAt: new Date().toISOString(),
    fileFormat: file.name.split(".").pop()?.toUpperCase() || "AUDIO",
    fileSize: file.size >= 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`,
    bitrate: bitrate ? `${Math.round(bitrate / 1000)} kbps` : averageBitrate ? `≈ ${Math.round(averageBitrate / 1000)} kbps` : "Bitrate: Уншигдсангүй",
  };
}
