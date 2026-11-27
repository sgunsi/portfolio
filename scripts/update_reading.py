"""Read Simran's public Goodreads profile and save her current book to data/reading.json.
Goodreads retired the shelf RSS feed, so this reads the "Currently Reading" block on the profile page."""
import html, json, re, urllib.request

PROFILE = "https://www.goodreads.com/user/show/127292078-simran"
OUT = "data/reading.json"

req = urllib.request.Request(PROFILE, headers={"User-Agent": "Mozilla/5.0 (simrangunsi.com reading widget)"})
page = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")

data = {}
i = page.find("is Currently Reading")
if i != -1:
    block = page[i:i + 6000]
    book = re.search(r'<a[^>]+href="(/book/show/[^"?#]+)"[^>]*>\s*<img[^>]+(?:alt|title)="([^"]+)"[^>]+src="([^"]+)"', block) \
        or re.search(r'<a[^>]+href="(/book/show/[^"?#]+)"[^>]*>\s*<img[^>]+src="([^"]+)"[^>]+(?:alt|title)="([^"]+)"', block)
    author = re.search(r'href="/author/show/[^"]+"[^>]*>([^<]+)</a>', block)
    if book:
        href, a, b = book.groups()
        title, cover = (a, b) if b.startswith("http") else (b, a)
        data = {
            "title": html.unescape(title).strip(),
            "author": html.unescape(author.group(1)).strip() if author else "",
            "cover": cover,
            "link": "https://www.goodreads.com" + href,
        }

old = None
try:
    old = json.load(open(OUT))
except Exception:
    pass
if not data:
    print("no current book found; leaving file as is")
elif data != old:
    json.dump(data, open(OUT, "w"), indent=2, ensure_ascii=False)
    print("updated", data)
else:
    print("no change")
