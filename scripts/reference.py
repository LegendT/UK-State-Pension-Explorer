# Reference calculations, worked with Decimal, written without reference to the JavaScript.
from decimal import Decimal as D, ROUND_HALF_UP, ROUND_FLOOR

def to5p(x):
    # nearest 5p, half up: divide by 0.05, round half up to integer, multiply back
    return (x / D("0.05")).quantize(D("1"), rounding=ROUND_HALF_UP) * D("0.05")

def rate(rule, p, e, cash_floor=True):
    p, e = D(p), D(e)
    r = {"triple": max(p, e, D("2.5")), "double": max(p, e), "earnings": e, "prices": p}[rule]
    if r < 0 and cash_floor:
        r = D("0")
    return r

def step(amount, pct):
    raw = D(amount) * (D(1) + D(pct) / D(100))
    return raw, to5p(raw)

print("== 1. single steps")
for a, pct in [("221.20","4.1"),("230.25","4.8"),("169.50","4.1"),("176.45","4.8"),("25.00","0.1"),("100.00","0"),("200.00","-1.5")]:
    raw, r = step(a, pct)
    print(a, pct, "raw", raw, "rounded", r.quantize(D("0.01")), "increase", (r-D(a)).quantize(D("0.01")), "x52", (r*52).quantize(D("0.01")))

print("== 2. rule selection")
for p, e in [("2.5","2.5"),("3.0","3.0"),("1.0","2.0"),("-0.5","-1.0"),("4.0","2.5"),("0","0"),("2.5","1.0")]:
    print(p, e, {k: str(rate(k, p, e)) for k in ["triple","double","earnings","prices"]},
          "nofloor", {k: str(rate(k, p, e, False)) for k in ["double","earnings","prices"]})

def run(start, path, cash_floor=True):
    out = {}
    for rule in ["triple","double","earnings","prices"]:
        amt = D(start); pi = D(1); ei = D(1); rows = []; cash = D(0); real = D(0)
        for (p, e) in path:
            pi *= (1 + D(p)/100); ei *= (1 + D(e)/100)
            _, amt = step(amt, rate(rule, p, e, cash_floor))
            cash += amt * 52; real += amt / pi * 52
            rows.append((str(amt.quantize(D("0.01"))), str((amt/pi).quantize(D("0.0001"))), str((amt/D(start)/ei*100).quantize(D("0.0001")))))
        out[rule] = (rows, str(cash.quantize(D("0.01"))), str(real.quantize(D("0.0001"))))
    return out

print("== 3. paths, start 241.30")
paths = {
 "steady (p3.0,e4.0 x3)": [("3.0","4.0")]*3,
 "low (p1.5,e2.0 x3)": [("1.5","2.0")]*3,
 "volatile": [("6.0","2.0"),("1.0","5.0"),("6.0","2.0")],
 "falling earnings": [("1.0","-2.0"),("2.0","3.0")],
 "deflation": [("-1.0","-2.0"),("2.0","1.0")],
}
for name, path in paths.items():
    print("--", name)
    for rule, v in run("241.30", path).items():
        print("  ", rule, v)
print("-- deflation, cash floor off")
for rule, v in run("241.30", paths["deflation"], False).items():
    print("  ", rule, v)

print("== 4. budget")
# weekly inputs: pension 241.30, other income 50.00, tax 3.00, spending 120.00 + 95.50 + 60.25
inc = (D("241.30")+D("50.00"))*52; tax = D("3.00")*52; sp = (D("120.00")+D("95.50")+D("60.25"))*52
print("weekly entry: income/yr", inc, "tax/yr", tax, "spend/yr", sp, "balance/yr", inc-tax-sp, "balance/wk", ((inc-tax-sp)/52).quantize(D("0.01")))
# monthly inputs: income 1000.00, spending 1100.00, tax unknown
print("monthly entry: income/yr", D("1000")*12, "spend/yr", D("1100")*12, "balance/yr", D("1000")*12-D("1100")*12, "balance/wk", ((D("1000")*12-D("1100")*12)/52).quantize(D("0.01"), rounding=ROUND_HALF_UP))
# four-weekly: income 965.20 (241.30 x 4), spending 900.00
print("4wk entry: income/yr", D("965.20")*13, "spend/yr", D("900")*13, "balance/yr", D("965.20")*13-D("900")*13)

print("== 5. history reconstruction (inputs: figures used in each decision)")
import json, os
hist = json.load(open(os.path.join(os.path.dirname(__file__), "..", "src", "_data", "history.json")))["years"]
def reconstruct(series, start_year, rule):
    i0 = [y["tax_year"] for y in hist].index(start_year)
    amt = D(hist[i0][series + "_pence"]) / 100
    out = []
    for y in hist[i0 + 1:]:
        _, amt = step(amt, rate(rule, D(y["prices_tenths"]) / 10, D(y["earnings_tenths"]) / 10))
        out.append(str(amt.quantize(D("0.01"))))
    return out
for series, start in [("basic", "2010/11"), ("new", "2016/17"), ("basic", "2020/21")]:
    for rule in ["triple", "double", "earnings", "prices"]:
        print(series, start, rule, reconstruct(series, start, rule))
print("== 6. published rates reproduced from the previous published rate")
for series in ["basic", "new"]:
    prev = None
    for y in hist:
        cur = y[series + "_pence"]
        if prev is not None and cur is not None:
            _, r = step(D(prev) / 100, D(y["applied_tenths"]) / 10)
            assert int(r * 100) == cur, (series, y["tax_year"], r, cur)
        prev = cur
print("all published rates reproduced")

print("== 7. the rule announced for April 2030 (docs/model-specification.md, section 3)")
# Worked with exact fractions from the specification, not from the JavaScript.
from fractions import Fraction as F

def round5(x):
    # nearest 5p, half up, x in pounds as a Fraction
    units = x / F(5, 100)
    whole = units.numerator // units.denominator
    if units - whole >= F(1, 2):
        whole += 1
    return F(whole * 5, 100)

def run_2030(start, path):
    start = F(D(start)); rate_ = start; target = start; rows = []
    for (p, e) in path:
        target *= 1 + F(D(e)) / 100
        cands = {"prices": rate_ * (1 + F(D(p)) / 100), "floor": rate_ * F(1025, 1000), "catch-up": target}
        top = max(cands.values())
        won = [k for k, v in cands.items() if v == top]
        pct = (top / rate_ - 1) * 100
        rate_ = round5(top)
        rows.append((f"{float(rate_):.2f}", "+".join(won), f"{float(pct):.1f}%"))
    return rows

paths7 = {
 "IFS example": [("2.0","4.0")]*3 + [("2.0","1.0")]*3 + [("2.0","4.0")]*4,
 "steady (p2.0,e3.7 x5)": [("2.0","3.7")]*5,
 "tie: p4.0 e4.0": [("4.0","4.0")],
 "falling earnings": [("1.0","-1.0"),("3.0","6.0"),("2.0","3.5")],
 "tie: p2.5 e1.0 (prices and the minimum)": [("2.5","1.0")],
 "tie: p2.5 e2.5 (all three)": [("2.5","2.5")],
}
for name, path in paths7.items():
    rows = run_2030("241.30", path)
    print("--", name, rows, "cash total", f"{sum(D(r[0]) for r in rows) * 52:.2f}")
rows = run_2030("241.30", [("2.0","3.7")]*30)
print("-- steady (p2.0,e3.7 x30): year 30", rows[-1], "cash total", f"{sum(D(r[0]) for r in rows) * 52:.2f}")
