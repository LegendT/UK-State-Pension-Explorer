Continue UK State Pension Explorer at /Users/anthonygeorge/Projects/UK State Pension Explorer.

Read, in this order, before doing anything:
1. docs/HANDOVER.md
2. docs/launch-dependencies.md, "Launch steps", "Work before step 4" and "After launch, first update"
3. docs/decision-log.md, from number 83
4. README.md

Do not read _archive/. Read research/ only to check a figure. docs/ux-review.md,
docs/pre-launch-review.md and docs/ux-review-2026-10-08.md are frozen: never edit them.

State on 13 October 2026, from docs/HANDOVER.md: the site is a preview for review, not
published. Launch steps 1 and 2 are done. Step 3, the owner's review of every page, was
done on 8 October 2026. The work it led to is "Work before step 4" in
docs/launch-dependencies.md; work for after launch is "After launch, first update" there.
Work since the last merged pull request is on the branch launch-review, with a pull request open:
run git status, git log main..launch-review and git log origin/launch-review..launch-review first.

Next action: none until Anthony says what to do. Every row of "Work before step 4" is done
except W16, which is his. Nothing else is authorised.

Waiting on Anthony: W16; his look at the costs tables' right-aligned, wrapped amounts (W20, R8);
W27's wording, for him to read; the W32 point marked "Owner decides"; launch steps 4 to 9.
Thirteen commits since the last push are on launch-review, unpushed: the critique stamp covers the
W15 commit, and the docs commits after it need /push uncritiqued or a fresh critique. git status
shows anything since.

Parked, do not raise: "After launch, first update", and the handover's "Known defects and limits" and "Declined".
Rules that have been broken before and must not be again: read ~/.claude/CLAUDE.md in
full first. In this project: do not import .env into Netlify, do not push (Anthony types
/push), and do not call the site WCAG 2.2 AA conformant. The preview's sign-in is a secret
Netlify's API returns masked: a deployed check needs Anthony signed in to Chrome and the extension. In the critique
skill, write the repository path in full, no variable, in every file path of the reader's command,
and keep its "pass two ran on ... cost $" line word for word, or the stamp is refused. After a data
change shown on a page, run npm run a11y too. After a claim is added or its passage changed, run
python3 scripts/check-passages.py. After changing a tool's script or template, run npm run test:tools. NEXT-SESSION.md is written by /handoff-check only.

Run /handoff-check before leaving this context.
