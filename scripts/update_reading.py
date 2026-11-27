"""Fetch Simran's Goodreads 'currently-reading' shelf and save the latest book to data/reading.json."""
import json, urllib.request, xml.etree.ElementTree as ET

FEED = "https://www.goodreads.com/review/list_rss/127292078?shelf=currently-reading"
OUT = "data/reading.json"

req = urllib.request.Request(FEED, headers={"User-Agent": "Mozilla/5.0 (simrangunsi.com reading widget)"})
with urllib.request.urlopen(req, timeout=30) as r:
    root = ET.fromstring(r.read())

item = root.find("./channel/item")
data = {}
if item is not None:
    def t(tag):
        el = item.find(tag)
        return (el.text or "").strip() if el is not None and el.text else ""
    data = {
        "title": t("title"),
        "author": t("author_name"),
        "cover": t("book_large_image_url") or t("book_medium_image_url") or t("book_image_url"),
        "link": t("link"),
    }

old = None
try:
    old = json.load(open(OUT))
except Exception:
    pass
if data != old:
    json.dump(data, open(OUT, "w"), indent=2, ensure_ascii=False)
    print("updated", data)
else:
    print("no change")
