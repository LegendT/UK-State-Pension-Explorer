Continue UK State Pension Explorer at /Users/anthonygeorge/Projects/UK State Pension Explorer.

Read, in this order, before doing anything:
1. docs/HANDOVER.md
2. docs/launch-dependencies.md, "Launch steps", "Work before step 4" and "After launch, first update"
3. docs/decision-log.md, from number 83
4. docs/ux-review-2026-10-08.md, the findings F1 to F16 and "Smaller points" behind rows W23 to W33
5. README.md

Do not read _archive/. Read research/ only to check a figure. docs/ux-review.md,
docs/pre-launch-review.md and docs/ux-review-2026-10-08.md are frozen: never edit them.

State on 13 October 2026, from docs/HANDOVER.md: the site is a preview for review, not
published. Launch steps 1 and 2 are done. Step 3, the owner's review of every page, was
done on 8 October 2026. The work it led to is "Work before step 4" in
docs/launch-dependencies.md; work for after launch is "After launch, first update" there.
Work since the last merged pull request is on the branch launch-review, with a pull request open:
run git status, git log main..launch-review and git log origin/launch-review..launch-review first.

Next action: none until Anthony says to build. The first open row is W33, rows in table order. Nothing else is authorised.

Waiting on Anthony: his look at the costs tables' right-aligned, wrapped amounts (W20, R8); W16 (he
checks the changed pages once every other row is done); launch steps 4 to 9. Everything up to W25 is
pushed. W25's critique suggestions (a) to (f) are applied and committed, not pushed; this handoff
check edited NEXT-SESSION.md after the stamp, so /push needs a fresh critique or /push uncritiqued.

Parked, do not raise: "After launch, first update", and the handover's "Known defects and limits" and "Declined".

Rules that have been broken before and must not be again: read ~/.claude/CLAUDE.md in
full first. In this project: do not import .env into Netlify, do not push (Anthony types
/push), and do not call the site WCAG 2.2 AA conformant. In the critique skill, write the
repository path in full, no variable, in every file path of the reader's command, and keep
its "pass two ran on ... cost $" line word for word, or the stamp is refused. After a data
change shown on a page, run npm run a11y too; it fails on any gradient, rgba, opacity or
filter in main.css. After a claim is added or its passage changed, run python3 scripts/check-passages.py. npm run a11y:manual fails now and then on the costs page (row W35): rerun it before blaming a change.
NEXT-SESSION.md is written by /handoff-check only.

Run /handoff-check before leaving this context.
