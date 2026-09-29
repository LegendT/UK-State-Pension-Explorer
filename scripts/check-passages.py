"""Checks that each quoted passage in the registers appears in its source.

Usage: python3 scripts/check-passages.py
Writes reports/passages.json. Needs network access and, for PDF sources, pdftotext.

A match shows the words are in the source. It does not show that the site reads them fairly.
A source that refuses automated reading is reported as unreadable, not as a failure or a pass.
"""
import concurrent.futures as cf, html, json, os, re, subprocess, sys, tempfile, unicodedata

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
load = lambda name: json.load(open(os.path.join(ROOT, "src", "_data", name)))
sources, figures, claims = load("sources.json"), load("figures.json"), load("claims.json")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"

def norm(text):
    text = unicodedata.normalize("NFKC", html.unescape(text))
    text = re.sub(r"[‘’‚′`]", "'", text)
    text = re.sub(r"[“”„″]", '"', text)
    text = re.sub(r"[‐-―−]", "-", text)
    text = text.replace("­", "")
    return re.sub(r"\s+", " ", text).strip().lower()

def fetch(url):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        path = tmp.name
    try:
        out = subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, "-o", path, "-w", "%{http_code} %{content_type}", url],
                             capture_output=True, text=True, timeout=90).stdout
        code, _, kind = out.partition(" ")
        if code != "200":
            return None, f"HTTP {code or 'no response'}"
        head = open(path, "rb").read(5)
        if head == b"%PDF-" or "pdf" in kind:
            # Two readings: by layout and by reading order. Columns interleave in the first.
            text = "".join(subprocess.run(["pdftotext", *mode, path, "-"], capture_output=True, text=True, timeout=120).stdout for mode in (["-layout"], []))
            return text, "pdf"
        if head[:2] == b"PK":
            return None, "spreadsheet or archive, not read"
        raw = open(path, "rb").read().decode("utf-8", "replace")
        raw = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw)
        return re.sub(r"(?s)<[^>]+>", " ", raw), "html"
    except Exception as error:
        return None, f"error: {error}"
    finally:
        os.unlink(path)

# GOV.UK pages are read through the content API, so that every part of a guide and every
# HTML or PDF attachment of a publication is searched, not only the landing page.
def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from strings(item)

def fetch_govuk(url):
    path = url.split("www.gov.uk", 1)[1].split("?")[0]
    raw, how = fetch("https://www.gov.uk/api/content" + path)
    if raw is None:
        return None, how
    try:
        data = json.loads(raw) if raw.lstrip().startswith("{") else None
    except Exception:
        data = None
    if data is None:
        return fetch(url)
    details = data.get("details", {})
    text = [re.sub(r"(?s)<[^>]+>", " ", part) for part in strings(details)]
    seen = set()
    for item in details.get("attachments", []):
        link = item.get("url", "")
        if link.startswith("/"):
            link = "https://www.gov.uk" + link
        if not link or link in seen or re.search(r"\.(ods|xlsx?|csv|zip|docx?)$", link):
            continue
        seen.add(link)
        if len(seen) > 12:
            break
        more, _ = fetch_govuk(link) if "www.gov.uk/government" in link and not link.endswith(".pdf") else fetch(link)
        if more:
            text.append(more)
    return " ".join(text), "gov.uk api and attachments"

def fetch_source(url):
    if url.startswith("https://www.gov.uk/"):
        return fetch_govuk(url)
    return fetch(url)

wanted = {}
for kind, register in (("figure", figures), ("claim", claims)):
    for key, record in register.items():
        if record.get("passage"):
            wanted.setdefault(record["source_id"], []).append((kind, key, record["passage"]))

def check(source_id):
    text, how = fetch_source(sources[source_id]["url"])
    rows = []
    body = norm(text) if text else None
    squeezed = body.replace(" ", "") if body else None
    for kind, key, passage in wanted[source_id]:
        if body is None:
            rows.append(dict(kind=kind, id=key, source=source_id, result="unreadable", detail=how))
            continue
        parts = [norm(p) for p in re.split(r"\.\.\.|…", passage) if p.strip()]
        hit = all(p in body or p.replace(" ", "") in squeezed for p in parts)
        rows.append(dict(kind=kind, id=key, source=source_id, result="found" if hit else "not found", detail=how, passage=passage))
    return rows

with cf.ThreadPoolExecutor(8) as pool:
    results = [row for rows in pool.map(check, wanted) for row in rows]

browser = {item["id"]: item for item in json.load(open(os.path.join(ROOT, "scripts", "passages-checked-in-browser.json")))["checked"]}
for row in results:
    if row["result"] == "unreadable" and row["id"] in browser:
        row["result"] = "found in a browser"
        row["detail"] = f'{browser[row["id"]]["browser"]}, {browser[row["id"]]["date"]}'

os.makedirs(os.path.join(ROOT, "reports"), exist_ok=True)
json.dump(results, open(os.path.join(ROOT, "reports", "passages.json"), "w"), indent=2, ensure_ascii=False)
count = lambda r: sum(1 for row in results if row["result"] == r)
without = sum(1 for reg in (figures, claims) for rec in reg.values() if not rec.get("passage"))
print(f"passages: {len(results)} checked. Found by this script: {count('found')}. Found in a browser by hand: {count('found in a browser')}. Not found: {count('not found')}. Source unreadable: {count('unreadable')}.")
print(f"passages: {without} register entries carry no quoted passage, so this check does not cover them.")
for row in results:
    if row["result"] not in ("found", "found in a browser"):
        print(f"  {row['result'].upper():11} {row['kind']} {row['id']} <- {row['source']} ({row['detail']})")
sys.exit(1 if count("not found") or count("unreadable") else 0)
