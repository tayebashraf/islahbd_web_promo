import type { Boyan, Clip, LiveRecording, Nasheed } from "@/lib/api";
import type { Track } from "@/components/player/player-provider";
import { QURAN_SURAHS, surahAudioUrl, type Qari } from "@/lib/quran-surahs";
import { shortSpeaker } from "@/lib/format";

export const boyanTrack = (b: Boyan): Track => ({
  id: `boyan-${b.id}`,
  title: b.title,
  subtitle: [shortSpeaker(b.speaker), b.category].filter(Boolean).join(" · "),
  src: b.audioUrl,
  kind: "boyan",
  href: `/boyan?play=${b.id}`,
});

export const nasheedTrack = (n: Nasheed): Track => ({
  id: `nasheed-${n.id}`,
  title: n.title,
  subtitle: n.artist || n.composer || n.lyricist || "হামদ ও নাত",
  src: n.audioUrl ?? "",
  kind: "nasheed",
  href: `/nasheed?play=${n.id}`,
});

export const clipTrack = (c: Clip): Track => ({
  id: `clip-${c.id}`,
  title: c.title,
  subtitle: "শর্ট ক্লিপ",
  src: c.audioUrl ?? "",
  kind: "clip",
  href: `/clips?play=${c.id}`,
});

export const surahTrack = (qari: Qari, number: number): Track => {
  const s = QURAN_SURAHS[number - 1];
  return {
    id: `quran-${qari.id}-${number}`,
    title: `${s.number}. ${s.bangla} (${s.arabic})`,
    subtitle: qari.name,
    src: surahAudioUrl(qari, number),
    kind: "quran",
    href: "/quran",
  };
};

export const recordingTrack = (r: LiveRecording): Track => ({
  id: `rec-${r.audioUrl}`,
  title: r.title || "লাইভ রেকর্ডিং",
  subtitle: [r.speaker, r.location].filter(Boolean).join(" · "),
  src: r.audioUrl,
  kind: "recording",
  href: "/listen",
});
