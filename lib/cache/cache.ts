import { config } from "@/lib/config";
import { getJson, setJson } from "@/lib/cache/redis";

export function transcriptCacheKey(videoId: string, language?: string) {
  return `transcript:${videoId}:${language ?? "default"}`;
}

export function metadataCacheKey(videoId: string) {
  return `metadata:${videoId}`;
}

export async function readCache<T>(key: string) {
  return getJson<T>(key);
}

export async function writeTranscriptCache<T>(key: string, value: T) {
  await setJson(key, value, config.TRANSCRIPT_CACHE_TTL_SECONDS);
}

export async function writeMetadataCache<T>(key: string, value: T) {
  await setJson(key, value, config.METADATA_CACHE_TTL_SECONDS);
}
