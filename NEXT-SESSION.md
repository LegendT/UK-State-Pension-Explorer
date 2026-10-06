Continue UK State Pension Explorer at /Users/anthonygeorge/Projects/UK State Pension Explorer.

Read, in this order, before doing anything:
1. docs/HANDOVER.md
2. docs/launch-dependencies.md
3. docs/decision-log.md
4. docs/accessibility-assessment.md
5. README.md

Do not read _archive/. Read research/ only when checking a figure. docs/ux-review.md and
docs/pre-launch-review.md are frozen records: never edit them. docs/HANDOVER.md holds
current state only (decision 83): do not add a dated section to it.

State on 5 October 2026: see the opening paragraphs of docs/HANDOVER.md. The site is a
preview for review, not published. All work is merged into `main`, up to pull request 22.
The branch `pre-launch-review` holds the pre-launch review of 5 October 2026 and its
corrections. They were not committed when this was written. Run git status first, and
check with gh pr list whether the branch has been committed, pushed and merged before
relying on either sentence.

Next action: none for the assistant. The launch steps in docs/launch-dependencies.md are
Anthony's, and step 1 is to merge that branch. Wait for Anthony to say what to do. Nothing
else is authorised.

Waiting on Anthony: "Launch steps" in docs/launch-dependencies.md, and the table under
"Waiting on the owner" in docs/HANDOVER.md. Decision 86 is the assistant's and not yet
confirmed.

Do not raise again unless asked: the items under "Known defects and limits" and under
"Declined: do not raise again" in docs/HANDOVER.md.

Rules that have been broken before and must not be again: read ~/.claude/CLAUDE.md in
full first. In this project: do not import .env into Netlify, do not push (Anthony types
/push, with the slash), and do not call the site WCAG 2.2 AA conformant. When running the
critique skill, write the repository path out in full in the reader's command and keep the
skill's "pass two ran on ... cost $" line word for word, or the push gate's stamp is
refused. NEXT-SESSION.md is written by /handoff-check only.

Run /handoff-check before leaving this context.
