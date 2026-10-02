Continue UK State Pension Explorer at /Users/anthonygeorge/Projects/UK State Pension Explorer.

Read, in this order, before doing anything:
1. docs/HANDOVER.md
2. docs/launch-dependencies.md
3. docs/decision-log.md
4. docs/accessibility-assessment.md
5. README.md

Do not read _archive/. Read research/ only when checking a figure. docs/ux-review.md is a
frozen record: read it for the reasoning behind recommendations R1 to R10, and never edit it.

State on 2 October 2026: see the opening paragraphs of docs/HANDOVER.md. The site is a
preview for review, not published. All work is merged into `main`, up to pull request 19
(pull request 18: launch dependency decisions 66 to 76 and the launch build work; pull
request 19: decisions 77 to 79, the tools on their own pages and the second front-end
sweep). Merging `main` does not launch the site: see "Launch steps" in
docs/launch-dependencies.md. The local branch `handover-pr19` holds handover corrections
recording those merges and a `.gitignore` entry; check whether they are committed. Run git
status first.

Next action: none. Wait for Anthony to say what to do. Nothing else is authorised.

Waiting on Anthony: the table under "Waiting on the owner" in docs/HANDOVER.md, in
particular the rows starting "Launch:".

Do not raise again unless asked: the items under "Known defects and limits" in
docs/HANDOVER.md that are marked deferred, and the items the owner declined (W4 and W5 of
the second front-end sweep).

Rules that have been broken before and must not be again: read ~/.claude/CLAUDE.md in
full first. In this project: do not import .env into Netlify, do not push (Anthony types
/push, with the slash), and do not call the site WCAG 2.2 AA conformant. When running the
critique skill, write the repository path out in full in the reader's command and keep the
skill's "pass two ran on ... cost $" line word for word, or the push gate's stamp is
refused. NEXT-SESSION.md is written by /handoff-check only.

Run /handoff-check before leaving this context.
