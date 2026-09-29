"""For register figures that carry no quoted passage, looks for the value itself in the source.

Usage: python3 scripts/check-values.py
A value that is found shows the number appears in the source text. It does not show that the
number is in the right row. A value that is not found is often in a spreadsheet, which this
script does not open. Those figures rest on the reading recorded in research/.
"""
import importlib.util, json, os, re, sys, concurrent.futures as cf
here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("passages", os.path.join(here, "check-passages.py"))
src = open(os.path.join(here, "check-passages.py")).read().split("wanted = {}")[0]
scope = {"__file__": os.path.join(here, "check-passages.py")}
exec(src, scope)
figures, sources, fetch_source, norm = scope["figures"], scope["sources"], scope["fetch_source"], scope["norm"]

todo = {}
for key, record in figures.items():
    if not record.get("passage") and record["classification"] != "derived-calculation":
        todo.setdefault(record["source_id"], []).append(key)

def forms(value):
    out = set()
    if isinstance(value, (int, float)):
        for text in (f"{value:,.2f}", f"{value:,.1f}", f"{value:,.0f}", f"{value:,}", str(value)):
            out.add(text)
            out.add(text.replace(",", ""))
        if float(value).is_integer():
            out.add(f"{int(value):,}")
    return {f for f in out if f}

def check(source_id):
    text, how = fetch_source(sources[source_id]["url"])
    body = norm(text) if text else None
    rows = []
    for key in todo[source_id]:
        value = figures[key]["value"]
        if body is None:
            rows.append((key, source_id, "unreadable", how))
        else:
            hit = any(re.search(r"(?<![\d.,])" + re.escape(f) + r"(?![\d]|[.,]\d)", body) for f in forms(value))
            rows.append((key, source_id, "value found" if hit else "value not in the page text", how))
    return rows

with cf.ThreadPoolExecutor(8) as pool:
    rows = [row for group in pool.map(check, todo) for row in group]
json.dump([dict(id=a, source=b, result=c, detail=d) for a, b, c, d in rows], open(os.path.join(here, "..", "reports", "values.json"), "w"), indent=2)
found = [r for r in rows if r[2] == "value found"]
print(f"values: {len(rows)} figures without a quoted passage. Value found in the source text: {len(found)}. Not found or unreadable: {len(rows) - len(found)}.")
for key, source_id, result, how in rows:
    if result != "value found":
        print(f"  {result}: {key} = {figures[key]['value']} <- {source_id} ({how})")
