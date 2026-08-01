import { getTranscript } from "@/lib/youtube/transcript";

export type LanguageInfo = {
  code: string;
  name: string;
  available: boolean;
};

const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" }
];

export async function getLanguages(videoId: string): Promise<LanguageInfo[]> {
  const checks = await Promise.allSettled(
    supportedLanguages.map(async (language) => {
      await getTranscript(videoId, language.code);

      return {
        ...language,
        available: true
      };
    })
  );

  return supportedLanguages.map((language, index) => ({
    ...language,
    available: checks[index].status === "fulfilled"
  }));
}
