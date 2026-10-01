Continue UK State Pension Explorer at /Users/anthonygeorge/Projects/UK State Pension Explorer.

Read, in this order, before doing anything:
1. docs/HANDOVER.md
2. docs/launch-dependencies.md
3. docs/decision-log.md
4. docs/accessibility-assessment.md
5. README.md

Do not read _archive/. Read research/ only when checking a figure. docs/ux-review.md is a
frozen record: read it for the reasoning behind recommendations R1 to R10, and never edit it.

State on 1 October 2026: see the opening paragraphs of docs/HANDOVER.md. The site is an
unpublished preview. All work up to pull request 11 is merged into `main`. The branch
`owner-answers-1-oct` carries the owner's answers of 1 October 2026 and waits on Anthony's
/push. Run git status first.

Next action: none. Wait for Anthony to say what to do. Nothing else is authorised.

Waiting on Anthony: the table under "Waiting on the owner" in docs/HANDOVER.md. He asked to
go through launch dependencies 1 to 10 one by one, with options and recommendations.

Do not raise again unless asked: the items under "Known defects and limits" in
docs/HANDOVER.md that are marked deferred: at present, defect 10.

Rules that have been broken before and must not be again: read ~/.claude/CLAUDE.md in
full first. In this project: do not import .env into Netlify, do not push (Anthony types
/push), and do not call the site WCAG 2.2 AA conformant. When running the critique skill,
write the repository path out in full in the reader's command, or the push gate's stamp is
refused.

Run /handoff-check before leaving this context.
