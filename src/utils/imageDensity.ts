export async function readImageDensity(file: File): Promise<{ x: number; y: number } | null> {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const text = (offset: number, length: number) => String.fromCharCode(...bytes.slice(offset, offset + length));
  if (bytes.length >= 8 && view.getUint32(0) === 0x89504e47) {
    for (let offset = 8; offset + 12 <= bytes.length;) {
      const length = view.getUint32(offset);
      if (offset + 12 + length > bytes.length) break;
      if (text(offset + 4, 4) === "pHYs" && length === 9 && bytes[offset + 16] === 1) {
        return { x: view.getUint32(offset + 8) * 0.0254, y: view.getUint32(offset + 12) * 0.0254 };
      }
      offset += length + 12;
    }
  }
  if (bytes.length >= 2 && view.getUint16(0) === 0xffd8) {
    for (let offset = 2; offset + 4 <= bytes.length;) {
      const marker = view.getUint16(offset);
      if (marker === 0xffda || marker === 0xffd9) break;
      const length = view.getUint16(offset + 2);
      const end = offset + 2 + length;
      if (length < 2 || end > bytes.length) break;
      if (marker === 0xffe0 && length >= 16 && text(offset + 4, 5) === "JFIF\0") {
        const unit = bytes[offset + 11];
        if (unit === 1 || unit === 2) {
          const multiplier = unit === 1 ? 1 : 2.54;
          return { x: view.getUint16(offset + 12) * multiplier, y: view.getUint16(offset + 14) * multiplier };
        }
      }
      if (marker === 0xffe1 && length >= 16 && text(offset + 4, 6) === "Exif\0\0") {
        const base = offset + 10;
        const little = text(base, 2) === "II";
        const directory = base + view.getUint32(base + 4, little);
        if (directory >= base && directory + 2 <= end) {
          const count = view.getUint16(directory, little);
          let horizontal = 0;
          let vertical = 0;
          let unit = 2;
          for (let index = 0; index < count; index++) {
            const entry = directory + 2 + index * 12;
            if (entry + 12 > end) break;
            const tag = view.getUint16(entry, little);
            if (tag === 0x128) unit = view.getUint16(entry + 8, little);
            if ((tag === 0x11a || tag === 0x11b) && view.getUint16(entry + 2, little) === 5) {
              const rational = base + view.getUint32(entry + 8, little);
              if (rational < base || rational + 8 > end) continue;
              const denominator = view.getUint32(rational + 4, little);
              const resolution = denominator ? view.getUint32(rational, little) / denominator : 0;
              if (tag === 0x11a) horizontal = resolution;
              else vertical = resolution;
            }
          }
          if (horizontal && vertical && (unit === 2 || unit === 3)) {
            const multiplier = unit === 2 ? 1 : 2.54;
            return { x: horizontal * multiplier, y: vertical * multiplier };
          }
        }
      }
      offset = end;
    }
  }
  return null;
}
