import { config } from "@/lib/config";
import { getJson, setJson } from "@/lib/cache/redis";

export type CacheStatus = "hit" | "miss";

export type CacheMetadata = {
  status: CacheStatus;
  fetchedAt: string;
  ttlSeconds: number;
};

export type CachedValue<T> = {
  data: T;
  fetchedAt: string;
  ttlSeconds: number;
};

export function transcriptCacheKey(videoId: string, language?: string) {
  return `transcript:${videoId}:${language ?? "default"}`;
}

export function formattedTranscriptCacheKey(videoId: string, language: string, format: string) {
  return `transcript:${videoId}:${language}:${format}`;
}

export function metadataCacheKey(videoId: string) {
  return `metadata:${videoId}`;
}

export async function readCache<T>(key: string) {
  return getJson<T>(key);
}

export function createCachedValue<T>(data: T, ttlSeconds = config.TRANSCRIPT_CACHE_TTL_SECONDS) {
  return {
    data,
    fetchedAt: new Date().toISOString(),
    ttlSeconds
  };
}

export function isCachedValue<T>(value: unknown): value is CachedValue<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "fetchedAt" in value &&
    "ttlSeconds" in value
  );
}

export function cacheMetadata(
  status: CacheStatus,
  cachedValue?: Pick<CachedValue<unknown>, "fetchedAt" | "ttlSeconds">
): CacheMetadata {
  return {
    status,
    fetchedAt: cachedValue?.fetchedAt ?? new Date().toISOString(),
    ttlSeconds: cachedValue?.ttlSeconds ?? config.TRANSCRIPT_CACHE_TTL_SECONDS
  };
}

export async function writeTranscriptCache<T>(key: string, value: T) {
  await setJson(key, value, config.TRANSCRIPT_CACHE_TTL_SECONDS);
}

export async function writeMetadataCache<T>(key: string, value: T) {
  await setJson(key, value, config.METADATA_CACHE_TTL_SECONDS);
}
