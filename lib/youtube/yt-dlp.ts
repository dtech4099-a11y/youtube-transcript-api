import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { logger } from "@/lib/logger/logger";
import type { TranscriptItem } from "@/lib/youtube/transcript";

const execFileAsync = promisify(execFile);
const ytdlpTimeoutMs = 45_000;
const cookiesDirectory = join(tmpdir(), "youtube-transcript-api");
const cookiesPath = join(cookiesDirectory, "youtube-cookies.txt");
let cookiesWritePromise: Promise<string | null> | null = null;

type YtDlpSubtitle = {
  url?: string;
  ext?: string;
};

type YtDlpInfo = {
  requested_subtitles?: Record<string, YtDlpSubtitle | undefined>;
  subtitles?: Record<string, YtDlpSubtitle[] | undefined>;
  automatic_captions?: Record<string, YtDlpSubtitle[] | undefined>;
};

type Json3Segment = {
  utf8?: string;
};

type Json3Event = {
  tStartMs?: number;
  dDurationMs?: number;
  segs?: Json3Segment[];
};

type Json3Caption = {
  events?: Json3Event[];
};

function youtubeUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function normalizeLanguage(language: string) {
  return language.toLowerCase();
}

function pickSubtitleUrl(info: YtDlpInfo, language: string): string | null {
  const normalizedLanguage = normalizeLanguage(language);
  const requested = info.requested_subtitles?.[normalizedLanguage]?.url;

  if (requested) {
    return requested;
  }

  const exactManual = info.subtitles?.[normalizedLanguage]?.find((item) => item.url)?.url;

  if (exactManual) {
    return exactManual;
  }

  const exactAuto = info.automatic_captions?.[normalizedLanguage]?.find((item) => item.url)?.url;

  if (exactAuto) {
    return exactAuto;
  }

  const languagePrefix = `${normalizedLanguage}-`;
  const manualFallback = Object.entries(info.subtitles ?? {}).find(([code]) =>
    code.toLowerCase().startsWith(languagePrefix)
  )?.[1]?.find((item) => item.url)?.url;

  if (manualFallback) {
    return manualFallback;
  }

  return (
    Object.entries(info.automatic_captions ?? {}).find(([code]) =>
      code.toLowerCase().startsWith(languagePrefix)
    )?.[1]?.find((item) => item.url)?.url ?? null
  );
}

function parseJson3Caption(caption: Json3Caption): TranscriptItem[] {
  return (caption.events ?? [])
    .map((event) => {
      const text = (event.segs ?? [])
        .map((segment) => segment.utf8 ?? "")
        .join("")
        .replace(/\s+/g, " ")
        .trim();

      if (!text || event.tStartMs === undefined) {
        return null;
      }

      return {
        text,
        offset: Number(event.tStartMs),
        duration: Number(event.dDurationMs ?? 0)
      };
    })
    .filter((item): item is TranscriptItem => Boolean(item));
}

async function getCookiesPath(): Promise<string | null> {
  if (!process.env.YOUTUBE_COOKIES_BASE64) {
    return null;
  }

  cookiesWritePromise ??= (async () => {
    const decodedCookies = Buffer.from(process.env.YOUTUBE_COOKIES_BASE64 ?? "", "base64")
      .toString("utf8")
      .trim();

    if (!decodedCookies) {
      return null;
    }

    await mkdir(cookiesDirectory, { recursive: true });
    await writeFile(cookiesPath, `${decodedCookies}\n`, { mode: 0o600 });

    return cookiesPath;
  })();

  return cookiesWritePromise;
}

async function getYtDlpInfo(videoId: string, language: string): Promise<YtDlpInfo> {
  const runtimeCookiesPath = await getCookiesPath();
  const args = [
    "--dump-json",
    "--skip-download",
    "--ignore-no-formats",
    "--no-warnings",
    "--write-subs",
    "--write-auto-subs",
    "--sub-langs",
    language,
    "--sub-format",
    "json3"
  ];

  if (runtimeCookiesPath) {
    args.push("--cookies", runtimeCookiesPath);
  }

  args.push(youtubeUrl(videoId));

  const { stdout } = await execFileAsync(
    "yt-dlp",
    args,
    {
      timeout: ytdlpTimeoutMs,
      maxBuffer: 10 * 1024 * 1024
    }
  );

  return JSON.parse(stdout) as YtDlpInfo;
}

export async function getTranscriptWithYtDlp(
  videoId: string,
  language = "en"
): Promise<TranscriptItem[]> {
  const info = await getYtDlpInfo(videoId, language);
  const subtitleUrl = pickSubtitleUrl(info, language);

  if (!subtitleUrl) {
    throw new Error(`yt-dlp did not find subtitles for language ${language}`);
  }

  const response = await fetch(subtitleUrl, {
    headers: {
      "user-agent": "youtube-transcript-api/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`yt-dlp subtitle URL failed with ${response.status}`);
  }

  const caption = (await response.json()) as Json3Caption;
  const transcript = parseJson3Caption(caption);

  if (!transcript.length) {
    throw new Error("yt-dlp returned an empty transcript");
  }

  logger.info(
    {
      videoId,
      language,
      count: transcript.length
    },
    "yt-dlp transcript fallback succeeded"
  );

  return transcript;
}
