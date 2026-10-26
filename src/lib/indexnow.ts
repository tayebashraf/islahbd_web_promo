import { SITE_URL } from "./constants";

export const INDEXNOW_KEY = "8d2f7a4e6b1c5d9a0e3f8b4c2a1e7d5f";
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver) for instant crawl notification.
 */
export async function submitToIndexNow(urls: string[]) {
  try {
    const host = new URL(SITE_URL).hostname;
    const fullUrls = urls.map((u) => (u.startsWith("http") ? u : `${SITE_URL}${u}`));

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: fullUrls,
      }),
    });

    return { ok: response.ok, status: response.status };
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return { ok: false, error };
  }
}
