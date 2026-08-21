#!/usr/bin/env python3
"""Extract an EPUB (chap_NNNN.xhtml style, ebook-lib) into data/*.json for the reader."""
import zipfile, re, json, html, os, sys

epub = sys.argv[1] if len(sys.argv) > 1 else "book.epub"
out = sys.argv[2] if len(sys.argv) > 2 else "data"
title = sys.argv[3] if len(sys.argv) > 3 else "Truyện"
author = sys.argv[4] if len(sys.argv) > 4 else ""
desc = sys.argv[5] if len(sys.argv) > 5 else ""

z = zipfile.ZipFile(epub)
opf = z.read("EPUB/content.opf").decode()
spine = re.findall(r'<itemref idref="([^"]+)"', opf)
manifest = dict(re.findall(r'<item href="([^"]+)" id="([^"]+)"', opf))
id2href = {v: k for k, v in manifest.items()}
order = [id2href[i] for i in spine if i in id2href]
order = [o for o in order if o != "nav.xhtml"]

def parse(path):
    x = z.read("EPUB/" + path).decode()
    t = re.search(r"<title>(.*?)</title>", x, re.S)
    t_title = html.unescape(t.group(1).strip()) if t else ""
    body = re.search(r"<body>(.*)</body>", x, re.S).group(1)
    body = re.sub(r"</?h[12][^>]*>", "", body)
    paras = [html.unescape(re.sub(r"<[^>]+>", "", pp)).strip()
             for pp in re.findall(r"<p[^>]*>(.*?)</p>", body, re.S)]
    return t_title, [pp for pp in paras if pp]

os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    os.remove(os.path.join(out, f))
index = []
for i, o in enumerate(order):
    ti, ps = parse(o)
    json.dump({"t": ti, "p": ps}, open(f"{out}/ch{i}.json", "w", encoding="utf-8"),
              ensure_ascii=False, separators=(",", ":"))
    index.append({"i": i, "t": ti, "n": len(ps)})
json.dump(index, open(f"{out}/index.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
json.dump({"title": title, "author": author, "description": desc,
           "total": len(order), "firstChapter": next((e["i"] for e in index if e["n"] > 0), 0)},
          open(f"{out}/meta.json", "w", encoding="utf-8"), ensure_ascii=False)
print(f"OK: {len(order)} chapters -> {out}/")
