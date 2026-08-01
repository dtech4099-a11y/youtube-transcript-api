import { fetchTranscript } from "youtube-transcript";

import { ApiError } from "@/lib/utils/errors";

export type TranscriptItem = {
  text: string;
  offset: number;
  duration: number;
};

type YoutubeTranscriptItem = {
  text: string;
  offset: number;
  duration: number;
};

export async function getTranscript(videoId: string, language?: string): Promise<TranscriptItem[]> {
  try {
    const transcript = (await fetchTranscript(
      videoId,
      language ? { lang: language } : undefined
    )) as YoutubeTranscriptItem[];

    return transcript.map((item) => ({
      text: item.text,
      offset: Number(item.offset),
      duration: Number(item.duration)
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch transcript";

    if (/disabled|not available|no transcript|could not find|not found/i.test(message)) {
      throw new ApiError(
        404,
        "transcript_not_found",
        "Transcript is not available for this video",
        {
          reason: message
        }
      );
    }

    throw new ApiError(502, "youtube_transcript_error", "YouTube transcript fetch failed", {
      reason: message
    });
  }
}
