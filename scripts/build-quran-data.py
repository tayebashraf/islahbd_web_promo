#!/usr/bin/env python3
"""Builds the static Quran data the web reader serves from public/quran/.

Source: the Flutter app's bundled assets (islahbd/user_app). Run from the
web project root:

    python3 scripts/build-quran-data.py ../islahbd/user_app

Writes:
  public/quran/surah/{1..114}.json  [{n, a, t, p, j, h}]  (ayah number, Arabic,
                                    Bangla translation, Madani page, juz, Hafezi page)
  public/quran/irab/{1..114}.json   {ayah: text}  (I'rab al-Quran, Arabic)
  public/quran/hafezi-pages.json    {page: ["s:a", ...]}  (610-page 15-line mushaf)
  src/lib/quran-qaris.json          qaris with per-ayah (everyayah) and per-surah audio
  src/lib/quran-juz.json            first ayah of each juz [{j, s, a}]
"""
import json, os, re, sys

app = sys.argv[1] if len(sys.argv) > 1 else "../islahbd/user_app"
assets = os.path.join(app, "assets/quran")
out = "public/quran"
os.makedirs(f"{out}/surah", exist_ok=True)
os.makedirs(f"{out}/irab", exist_ok=True)

pages = json.load(open(f"{assets}/hafezi_15_pages.json", encoding="utf-8"))
hafezi_of = {key: int(page) for page, keys in pages.items() for key in keys}
json.dump(pages, open(f"{out}/hafezi-pages.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

by_surah = {}
for row in json.load(open(f"{assets}/quran_database.json", encoding="utf-8")):
    s, n = row["surahNumber"], row["numberInSurah"]
    by_surah.setdefault(s, []).append({
        "n": n,
        "a": row["text"].lstrip("﻿"),
        "t": row.get("translation", ""),
        "p": row.get("page"),
        "j": row.get("juz"),
        "h": hafezi_of.get(f"{s}:{n}"),
    })
juz_starts = {}
for s in sorted(by_surah):
    for ay in by_surah[s]:
        juz_starts.setdefault(ay["j"], {"j": ay["j"], "s": s, "a": ay["n"]})
json.dump([juz_starts[j] for j in sorted(juz_starts)], open("src/lib/quran-juz.json", "w"), separators=(",", ":"))

for s, ayahs in by_surah.items():
    json.dump(ayahs, open(f"{out}/surah/{s}.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

for s, ayahs in json.load(open(f"{assets}/quran_irab.json", encoding="utf-8")).items():
    json.dump(ayahs, open(f"{out}/irab/{s}.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# Qaris from the app's model (Dart source)
src = open(os.path.join(app, "lib/features/quran/core/models/qari_model.dart"), encoding="utf-8").read()
qaris = []
src = src[src.index("const List<Qari> qariList"):]  # skip the class body
for block in re.findall(r"Qari\((.*?)\)\s*,", src, re.S):
    def get(key):
        m = re.search(key + r"""\s*:\s*["']([^"']*)["']""", block)
        return m.group(1) if m else ""
    if not get("id"):
        continue
    qaris.append({
        "id": get("id"),
        "name": get("name"),
        "en": get("englishName"),
        "ar": get("arabicName"),
        "ayah": get("everyAyahFolder"),
        "server": get("surahServerUrl"),
        "hasAyah": "hasAyahAudio: true" in block,
    })
json.dump(qaris, open("src/lib/quran-qaris.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(f"{len(by_surah)} surahs, {len(pages)} hafezi pages, {len(qaris)} qaris")
