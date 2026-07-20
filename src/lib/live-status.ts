const BACKEND = "https://api.islahbd.com";

export interface LiveStatus {
  isLive: boolean;
  title: string;
  speaker: string;
  location: string;
  listeners: number;
  streamUrl: string;
}

export async function fetchLiveStatus(): Promise<LiveStatus | null> {
  try {
    const res = await fetch(`${BACKEND}/api/live/status/`, {
      next: { revalidate: 15 }, // revalidate every 15s on the server
    });
    if (!res.ok) return null;
    return (await res.json()) as LiveStatus;
  } catch {
    return null;
  }
}
