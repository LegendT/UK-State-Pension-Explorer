# Reference calculations

These examples were worked in `scripts/reference.py`, which uses Python's `decimal` module and was written without reference to the JavaScript. The tests in `test/` compare the calculators with these values.

A separate method of arithmetic is a check on the code. It is not an independent review by a person.

To reproduce: `python3 scripts/reference.py`. To compare with the calculators: `npm test`.

## What the examples cover

| Case | Where |
| --- | --- |
| Published full rates reproduced by nearest-5p rounding | Section 1 of the output, and section 6 for every year |
| An exact half of 5p rounds up (£25.00 at 0.1% gives £25.025, then £25.05) | Section 1 |
| Zero increase, and a negative increase | Section 1 |
| Ties between two and three measures | Section 2 |
| Both measures negative, cash floor on and off | Sections 2 and 3 |
| A scenario where three rules give the same result | Section 3, steady |
| A scenario where only the 2.5% minimum separates the rules | Section 3, low |
| Volatile prices | Section 3 |
| Totals in cash and in starting-year prices | Section 3 |
| Budget entered by week, 4 weeks and month, with and without tax | Section 4 |
| History rebuilt under each rule from three start points | Section 5 |
| The rule announced for April 2030: the Institute for Fiscal Studies' example, steady growth over 5 and 30 years, ties of two and three candidates, falling earnings, and the percentage shown for a catch-up year | Section 7 |

## Checked in the browser as well

On 29 September 2026 the four calculators were run in Chrome with these inputs and gave the reference values:

| Tool | Input | Reference | Shown |
| --- | --- | --- | --- |
| 1 | £100.00, prices 2.5, earnings 2.5 | 2.5%, three-way tie, £102.50 | Same |
| 1 | £241.30, prices -0.5, earnings -1.0 | 2.5%, £247.35 | Same |
| 2 | Volatile, 3 years, from £241.30 | £284.70, £284.70, £263.60, £273.85. Cash totals £42,073.20, £42,073.20, £39,946.40, £40,976.00 | Same |
| 2 | Prices -1.0 then 2.0, earnings -2.0 then 1.0, cash floor off | £253.55, £243.70, £238.80, £243.70 | Same |
| 3 | Weekly: income £241.30 and £50.00, tax £3.00, spending £120.00, £95.50, £60.25 | £652.60 a year, £12.55 a week | Same |
| 3 | Monthly: income £1,000, spending £1,100, no tax | Shortfall £1,200 a year, £23.08 a week, labelled before tax | Same |
| 4 | New State Pension from 2016/17, prices link | £216.70 in 2026/27 | Same |
| 4 | Basic State Pension from 2020/21, triple lock applied mechanically | £194.20 in 2026/27 | Same |
| 2 | The Institute for Fiscal Studies' example, 10 years, from £241.30. Checked on 30 September 2026 | Rule announced for April 2030: £327.15 in year 10, cash total £150,176.00 | Same |

## Output of the last run

```
== 1. single steps
221.20 4.1 raw 230.26920 rounded 230.25 increase 9.05 x52 11973.00
230.25 4.8 raw 241.30200 rounded 241.30 increase 11.05 x52 12547.60
169.50 4.1 raw 176.44950 rounded 176.45 increase 6.95 x52 9175.40
176.45 4.8 raw 184.91960 rounded 184.90 increase 8.45 x52 9614.80
25.00 0.1 raw 25.02500 rounded 25.05 increase 0.05 x52 1302.60
100.00 0 raw 100.00 rounded 100.00 increase 0.00 x52 5200.00
200.00 -1.5 raw 197.00000 rounded 197.00 increase -3.00 x52 10244.00
== 2. rule selection
2.5 2.5 {'triple': '2.5', 'double': '2.5', 'earnings': '2.5', 'prices': '2.5'} nofloor {'double': '2.5', 'earnings': '2.5', 'prices': '2.5'}
3.0 3.0 {'triple': '3.0', 'double': '3.0', 'earnings': '3.0', 'prices': '3.0'} nofloor {'double': '3.0', 'earnings': '3.0', 'prices': '3.0'}
1.0 2.0 {'triple': '2.5', 'double': '2.0', 'earnings': '2.0', 'prices': '1.0'} nofloor {'double': '2.0', 'earnings': '2.0', 'prices': '1.0'}
-0.5 -1.0 {'triple': '2.5', 'double': '0', 'earnings': '0', 'prices': '0'} nofloor {'double': '-0.5', 'earnings': '-1.0', 'prices': '-0.5'}
4.0 2.5 {'triple': '4.0', 'double': '4.0', 'earnings': '2.5', 'prices': '4.0'} nofloor {'double': '4.0', 'earnings': '2.5', 'prices': '4.0'}
0 0 {'triple': '2.5', 'double': '0', 'earnings': '0', 'prices': '0'} nofloor {'double': '0', 'earnings': '0', 'prices': '0'}
2.5 1.0 {'triple': '2.5', 'double': '2.5', 'earnings': '1.0', 'prices': '2.5'} nofloor {'double': '2.5', 'earnings': '1.0', 'prices': '2.5'}
== 3. paths, start 241.30
-- steady (p3.0,e4.0 x3)
   triple ([('250.95', '243.6408', '99.9992'), ('261.00', '246.0175', '100.0038'), ('271.45', '248.4152', '100.0075')], '40736.80', '38379.8226')
   double ([('250.95', '243.6408', '99.9992'), ('261.00', '246.0175', '100.0038'), ('271.45', '248.4152', '100.0075')], '40736.80', '38379.8226')
   earnings ([('250.95', '243.6408', '99.9992'), ('261.00', '246.0175', '100.0038'), ('271.45', '248.4152', '100.0075')], '40736.80', '38379.8226')
   prices ([('248.55', '241.3107', '99.0428'), ('256.00', '241.3046', '98.0880'), ('263.70', '241.3229', '97.1522')], '39949.00', '37644.7806')
-- low (p1.5,e2.0 x3)
   triple ([('247.35', '243.6946', '100.4973'), ('253.55', '246.1113', '100.9964'), ('259.90', '248.5468', '101.4959')], '39561.60', '38394.3380')
   double ([('246.15', '242.5123', '100.0098'), ('251.05', '243.6846', '100.0006'), ('256.05', '244.8650', '99.9924')], '39169.00', '38015.2195')
   earnings ([('246.15', '242.5123', '100.0098'), ('251.05', '243.6846', '100.0006'), ('256.05', '244.8650', '99.9924')], '39169.00', '38015.2195')
   prices ([('244.90', '241.2808', '99.5019'), ('248.55', '241.2580', '99.0048'), ('252.30', '241.2788', '98.5279')], '38779.00', '37638.5123')
-- volatile
   triple ([('255.80', '241.3208', '103.9305'), ('268.60', '250.8874', '103.9344'), ('284.70', '250.8733', '108.0042')], '42073.20', '38640.2308')
   double ([('255.80', '241.3208', '103.9305'), ('268.60', '250.8874', '103.9344'), ('284.70', '250.8733', '108.0042')], '42073.20', '38640.2308')
   earnings ([('246.15', '232.2170', '100.0098'), ('258.45', '241.4067', '100.0068'), ('263.60', '232.2803', '99.9996')], '39946.40', '36707.0043')
   prices ([('255.80', '241.3208', '103.9305'), ('258.35', '241.3133', '99.9682'), ('273.85', '241.3124', '103.8881')], '40976.00', '37645.2148')
-- falling earnings
   triple ([('247.35', '244.9010', '104.5992'), ('254.75', '247.2821', '104.5908')], '26109.20', '25593.5197')
   double ([('243.70', '241.2871', '103.0557'), ('251.00', '243.6420', '103.0512')], '25724.40', '25216.3153')
   earnings ([('241.30', '238.9109', '102.0408'), ('248.55', '241.2638', '102.0453')], '25472.20', '24969.0856')
   prices ([('243.70', '241.2871', '103.0557'), ('248.55', '241.2638', '102.0453')], '25597.00', '25092.6500')
-- deflation
   triple ([('247.35', '249.8485', '104.5992'), ('253.55', '251.0893', '106.1595')], '26046.80', '26048.7661')
   double ([('241.30', '243.7374', '102.0408'), ('246.15', '243.7611', '103.0612')], '25347.40', '25349.9228')
   earnings ([('241.30', '243.7374', '102.0408'), ('243.70', '241.3349', '102.0354')], '25220.00', '25223.7592')
   prices ([('241.30', '243.7374', '102.0408'), ('246.15', '243.7611', '103.0612')], '25347.40', '25349.9228')
-- deflation, cash floor off
   triple ([('247.35', '249.8485', '104.5992'), ('253.55', '251.0893', '106.1595')], '26046.80', '26048.7661')
   double ([('238.90', '241.3131', '101.0259'), ('243.70', '241.3349', '102.0354')], '25095.20', '25097.6986')
   earnings ([('236.45', '238.8384', '99.9899'), ('238.80', '236.4825', '99.9838')], '24713.00', '24716.6845')
   prices ([('238.90', '241.3131', '101.0259'), ('243.70', '241.3349', '102.0354')], '25095.20', '25097.6986')
== 4. budget
weekly entry: income/yr 15147.60 tax/yr 156.00 spend/yr 14339.00 balance/yr 652.60 balance/wk 12.55
monthly entry: income/yr 12000 spend/yr 13200 balance/yr -1200 balance/wk -23.08
4wk entry: income/yr 12547.60 spend/yr 11700 balance/yr 847.60
== 5. history reconstruction (inputs: figures used in each decision)
basic 2010/11 triple ['100.70', '105.95', '108.60', '111.55', '114.35', '117.65', '120.60', '124.20', '127.45', '132.40', '135.70', '146.95', '161.80', '175.55', '182.75', '191.50']
basic 2010/11 double ['100.70', '105.95', '108.30', '111.20', '112.55', '115.80', '118.60', '122.15', '125.35', '130.25', '130.90', '141.75', '156.05', '169.30', '176.25', '184.70']
basic 2010/11 earnings ['98.90', '101.65', '103.30', '104.55', '105.20', '108.25', '110.85', '113.30', '116.25', '120.80', '120.80', '130.85', '138.05', '149.80', '155.95', '163.45']
basic 2010/11 prices ['100.70', '105.95', '108.30', '111.20', '112.55', '112.55', '113.70', '117.10', '119.90', '121.95', '122.55', '126.35', '139.10', '148.40', '150.90', '156.65']
new 2016/17 triple ['159.55', '164.35', '168.60', '175.20', '179.60', '194.50', '214.15', '232.35', '241.90', '253.50']
new 2016/17 double ['159.40', '164.20', '168.45', '175.00', '175.90', '190.50', '209.75', '227.60', '236.95', '248.30']
new 2016/17 earnings ['159.40', '162.90', '167.15', '173.65', '173.65', '188.05', '198.40', '215.25', '224.10', '234.85']
new 2016/17 prices ['157.20', '161.90', '165.80', '168.60', '169.45', '174.70', '192.35', '205.25', '208.75', '216.70']
basic 2020/21 triple ['137.60', '149.00', '164.05', '178.00', '185.30', '194.20']
basic 2020/21 double ['134.90', '146.10', '160.85', '174.50', '181.65', '190.35']
basic 2020/21 earnings ['134.25', '145.40', '153.40', '166.45', '173.25', '181.55']
basic 2020/21 prices ['134.90', '139.10', '153.15', '163.40', '166.20', '172.50']
== 6. published rates reproduced from the previous published rate
all published rates reproduced
== 7. the rule announced for April 2030 (docs/model-specification.md, section 3)
-- IFS example [('250.95', 'catch-up', '4.0%'), ('261.00', 'catch-up', '4.0%'), ('271.45', 'catch-up', '4.0%'), ('278.25', 'floor', '2.5%'), ('285.20', 'floor', '2.5%'), ('292.35', 'floor', '2.5%'), ('299.65', 'floor', '2.5%'), ('307.15', 'floor', '2.5%'), ('314.85', 'floor', '2.5%'), ('327.15', 'catch-up', '3.9%')] cash total 150176.00
-- steady (p2.0,e3.7 x5) [('250.25', 'catch-up', '3.7%'), ('259.50', 'catch-up', '3.7%'), ('269.10', 'catch-up', '3.7%'), ('279.05', 'catch-up', '3.7%'), ('289.35', 'catch-up', '3.7%')] cash total 70057.00
-- tie: p4.0 e4.0 [('250.95', 'prices+catch-up', '4.0%')] cash total 13049.40
-- falling earnings [('247.35', 'floor', '2.5%'), ('254.75', 'prices', '3.0%'), ('262.10', 'catch-up', '2.9%')] cash total 39738.40
-- tie: p2.5 e1.0 (prices and the minimum) [('247.35', 'prices+floor', '2.5%')] cash total 12862.20
-- tie: p2.5 e2.5 (all three) [('247.35', 'prices+floor+catch-up', '2.5%')] cash total 12862.20
-- steady (p2.0,e3.7 x30): year 30 ('717.65', 'catch-up', '3.7%') cash total 694257.20
```
