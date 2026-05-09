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

function toRadians(deg: number) { return deg * Math.PI / 180; }
function toDegrees(rad: number) { return rad * 180 / Math.PI; }

function julianDate(date: Date): number {
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  if (M <= 2) return Math.floor(365.25 * (Y - 1)) + Math.floor(30.6001 * (M + 13)) + D + 1720994.5;
  return Math.floor(365.25 * Y) + Math.floor(30.6001 * (M + 1)) + D + 1720994.5;
}

function sunEquation(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = toRadians((357.52911 + T * (35999.05029 - T * 0.0001537)) % 360);
  const C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(M)
    + (0.019993 - T * 0.000101) * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M);
  const sunLon = L0 + C;
  const omega = toRadians(125.04 - 1934.136 * T);
  const lambda = toRadians(sunLon + (-0.00569 - 0.00478 * Math.sin(omega)));
  const obliq = toRadians(23.439 - T * 0.00013);
  const decl = Math.asin(Math.sin(obliq) * Math.sin(lambda));
  const eqTime = (L0 - 0.0057183 - toDegrees(Math.atan2(Math.cos(obliq) * Math.sin(lambda), Math.cos(lambda))) + 180 + (C > 0 ? 0 : 360)) % 360;
  return { decl, eqTime: (eqTime > 180 ? eqTime - 360 : eqTime) * 4 };
}

function hourAngle(lat: number, decl: number, altitude: number): number {
  const num = Math.sin(toRadians(altitude)) - Math.sin(toRadians(lat)) * Math.sin(decl);
  const den = Math.cos(toRadians(lat)) * Math.cos(decl);
  return toDegrees(Math.acos(num / den));
}

function toTimeStr(decimal: number): string {
  const h = Math.floor(decimal) % 24;
  const m = Math.floor((decimal % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function calculatePrayerTimes(lat: number, lng: number, date = new Date(), timezone = 6): PrayerTimes {
  const jd = julianDate(date);
  const { decl, eqTime } = sunEquation(jd);
  const noon = 12 - lng / 15 - eqTime / 60 + timezone;

  const fajrAngle = -18;
  const ishaAngle = -17;

  const fajrHA = hourAngle(lat, decl, fajrAngle);
  const sunriseHA = hourAngle(lat, decl, -0.8333);
  const asrShadow = 1 + Math.tan(Math.abs(toRadians(lat) - decl));
  const asrAlt = toDegrees(Math.atan(1 / asrShadow));
  const asrHA = hourAngle(lat, decl, asrAlt);
  const maghribHA = sunriseHA;
  const ishaHA = hourAngle(lat, decl, ishaAngle);

  return {
    Fajr: toTimeStr(noon - fajrHA / 15),
    Sunrise: toTimeStr(noon - sunriseHA / 15),
    Dhuhr: toTimeStr(noon),
    Asr: toTimeStr(noon + asrHA / 15),
    Maghrib: toTimeStr(noon + maghribHA / 15),
    Isha: toTimeStr(noon + ishaHA / 15),
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
