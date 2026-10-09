Continue UK State Pension Explorer at /Users/anthonygeorge/Projects/UK State Pension Explorer.

Read, in this order, before doing anything:
1. docs/HANDOVER.md
2. docs/launch-dependencies.md, "Launch steps", "Work before step 4" and "After launch, first update"
3. docs/decision-log.md, from number 83
4. docs/ux-review-2026-10-08.md, the findings F1 to F16 and "Smaller points" behind rows W7 and W17 to W31
5. README.md

Do not read _archive/. Read research/ only to check a figure. docs/ux-review.md,
docs/pre-launch-review.md and docs/ux-review-2026-10-08.md are frozen: never edit them.

State on 9 October 2026, from docs/HANDOVER.md: the site is a preview for review, not
published. Launch steps 1 and 2 are done. Step 3, the owner's review of every page, was
done on 8 October 2026. The work it led to, with the launch audit and the readability
review of that day, is "Work before step 4" in docs/launch-dependencies.md; decided work
for after launch is "After launch, first update" in the same file. Work since the last
merged pull request is on the branch launch-review, with a pull request open: run
git status and git log main..launch-review first.

Next action: none until Anthony says to build. The first open row is W7, and the rows run
in the table's order. Nothing else is authorised.

Waiting on Anthony: W31 (how custom amounts reach the address); W16 (the review date);
launch steps 4 to 9; whether to run the tree test and usability test.

Parked, do not raise: "After launch, first update", and the handover's "Known defects and limits" and "Declined".

Rules that have been broken before and must not be again: read ~/.claude/CLAUDE.md in
full first. In this project: do not import .env into Netlify, do not push (Anthony types
/push, with the slash), and do not call the site WCAG 2.2 AA conformant. When running the
critique skill, write the repository path out in full in the reader's command and keep the
skill's "pass two ran on ... cost $" line word for word, or the push gate's stamp is
refused. After a data change shown on a page, run npm run a11y too: README.md, "Commands".
NEXT-SESSION.md is written by /handoff-check only. The chrome-devtools browser tool cannot
launch while another process holds its profile; screenshot through puppeteer-core instead.

Run /handoff-check before leaving this context.
