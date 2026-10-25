export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimesResponse {
  city: string;
  date: string;
  times: PrayerTimes;
  hijriDate: string;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fix = (a: number, b: number) => ((a % b) + b) % b;

function julianDate(date: Date): number {
  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  const D = date.getDate();
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

/** Sun declination (radians) and equation of time (hours) — praytimes.org algorithm. */
function sunPosition(jd: number) {
  const d = jd - 2451545.0;
  const g = rad(fix(357.529 + 0.98560028 * d, 360));
  const q = fix(280.459 + 0.98564736 * d, 360);
  const L = rad(fix(q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g), 360));
  const e = rad(23.439 - 0.00000036 * d);
  const ra = fix(deg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15, 24);
  return { decl: Math.asin(Math.sin(e) * Math.sin(L)), eqt: q / 15 - ra };
}

/** Hours from solar noon until the sun reaches `altitude` degrees. */
function hourOffset(lat: number, decl: number, altitude: number): number {
  const cos = (Math.sin(rad(altitude)) - Math.sin(rad(lat)) * Math.sin(decl)) / (Math.cos(rad(lat)) * Math.cos(decl));
  return deg(Math.acos(Math.min(1, Math.max(-1, cos)))) / 15;
}

function toTimeStr(hours: number): string {
  const total = Math.round(fix(hours, 24) * 60) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * Karachi method (Fajr/Isha at 18°) with Hanafi Asr — the same convention the
 * islahbd app uses for Bangladesh.
 */
export function calculatePrayerTimes(lat: number, lng: number, date = new Date(), timezone = 6): PrayerTimes {
  const { decl, eqt } = sunPosition(julianDate(date) - lng / (15 * 24));
  const noon = 12 + timezone - lng / 15 - eqt;
  const sunrise = hourOffset(lat, decl, -0.833);
  const asrAltitude = deg(Math.atan(1 / (2 + Math.tan(Math.abs(rad(lat) - decl)))));

  return {
    Fajr: toTimeStr(noon - hourOffset(lat, decl, -18)),
    Sunrise: toTimeStr(noon - sunrise),
    Dhuhr: toTimeStr(noon + 1 / 60),
    Asr: toTimeStr(noon + hourOffset(lat, decl, asrAltitude)),
    Maghrib: toTimeStr(noon + sunrise + 1 / 60),
    Isha: toTimeStr(noon + hourOffset(lat, decl, -18)),
  };
}

export function getCurrentPrayer(times: PrayerTimes): string {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const ordered: Array<[string, number]> = [
    ["Fajr", toMins(times.Fajr)],
    ["Sunrise", toMins(times.Sunrise)],
    ["Dhuhr", toMins(times.Dhuhr)],
    ["Asr", toMins(times.Asr)],
    ["Maghrib", toMins(times.Maghrib)],
    ["Isha", toMins(times.Isha)],
  ];
  let current_prayer = "Isha";
  for (const [name, mins] of ordered) {
    if (current >= mins) current_prayer = name;
  }
  return current_prayer;
}

export function getNextPrayer(times: PrayerTimes): { name: string; time: string } {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const ordered = [
    { name: "Fajr", time: times.Fajr },
    { name: "Sunrise", time: times.Sunrise },
    { name: "Dhuhr", time: times.Dhuhr },
    { name: "Asr", time: times.Asr },
    { name: "Maghrib", time: times.Maghrib },
    { name: "Isha", time: times.Isha },
  ];
  for (const p of ordered) {
    if (toMins(p.time) > current) return p;
  }
  return ordered[0];
}
