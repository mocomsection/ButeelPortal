import { RELEASES } from "@/data/releases";
import { AUDIOBOOKS } from "@/data/audiobooks";
import { MOVIES } from "@/data/movies";
import type { ReleaseData, Track } from "@/types";

export function assetKey(product: ReleaseData, track: Track) {
  return track.assetId || (track.isrc ? `${product.contentType}:isrc:${track.isrc.replace(/[-\s]/g, "").toUpperCase()}` : `${product.id}:track:${track.no}`);
}

export function planDraftDeletion(products: ReleaseData[], productId: string) {
  const product = products.find(item => item.id === productId);
  if (!product) throw new Error("Бүтээл олдсонгүй.");
  if (product.status !== "draft") throw new Error("Зөвхөн ноорог бүтээлийг устгах боломжтой. Илгээгдсэн болон түгээгдсэн бүтээлийг устгахгүй.");
  const remaining = products.filter(item => item.id !== productId);
  const referenced = new Set(remaining.flatMap(item => item.tracks.map(track => assetKey(item, track))));
  const deletedAssetIds = [...new Set(product.tracks.map(track => assetKey(product, track)))].filter(key => !referenced.has(key));
  return { products: remaining, deletedAssetIds };
}

const seed: ReleaseData[] = [...RELEASES, ...AUDIOBOOKS, ...MOVIES];
const storageKey = "buteel-catalog-deletions-v1";
let deletedProductIds: string[] = [];
let deletedAssetIds: string[] = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved && Array.isArray(saved.products) && Array.isArray(saved.assets)) {
    deletedProductIds = saved.products.filter((id: unknown) => typeof id === "string" && seed.some(item => item.id === id && item.status === "draft"));
    deletedAssetIds = saved.assets.filter((id: unknown) => typeof id === "string");
  }
} catch {}
let snapshot = seed.filter(item => !deletedProductIds.includes(item.id));
let assets = new Map(seed.flatMap(product => product.tracks.map(track => [assetKey(product, track), track] as const)));
const retainedAssetIds = new Set(snapshot.flatMap(product => product.tracks.map(track => assetKey(product, track))));
deletedAssetIds.forEach(id => { if (!retainedAssetIds.has(id)) assets.delete(id); });
const listeners = new Set<() => void>();
export const getCatalogSnapshot = () => snapshot;
export const getCatalogAsset = (id: string) => assets.get(id);
export function subscribeCatalog(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function deleteDraftProduct(id: string) {
  const result = planDraftDeletion(snapshot, id);
  const nextProducts = [...deletedProductIds, id];
  const nextAssets = [...new Set([...deletedAssetIds, ...result.deletedAssetIds])];
  localStorage.setItem(storageKey, JSON.stringify({ products: nextProducts, assets: nextAssets }));
  deletedProductIds = nextProducts;
  deletedAssetIds = nextAssets;
  const nextAssetRecords = new Map(assets);
  result.deletedAssetIds.forEach(assetId => nextAssetRecords.delete(assetId));
  assets = nextAssetRecords;
  snapshot = result.products;
  listeners.forEach(listener => listener());
}
