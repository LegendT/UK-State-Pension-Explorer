Continue UK State Pension Explorer at /Users/anthonygeorge/Projects/UK State Pension Explorer.

Read, in this order, before doing anything:
1. docs/HANDOVER.md
2. docs/launch-dependencies.md
3. docs/decision-log.md
4. docs/accessibility-assessment.md
5. README.md

Do not read _archive/. Read research/ only when checking a figure. docs/ux-review.md is a
frozen record: read it for the reasoning behind recommendations R1 to R10, and never edit it.
Their state is in docs/HANDOVER.md, "UX review of 30 September 2026".

State on 1 October 2026: see the opening paragraph of docs/HANDOVER.md. The site is an
unpublished preview. All work is merged into `main`, up to pull request 10. The branch
`defect-11-and-research` holds three commits of 1 October 2026, not pushed, waiting on Anthony.
Run git status first.

Next action: none. Wait for Anthony to say what to do. Nothing else is authorised.

Waiting on Anthony: the table under "Waiting on the owner" in docs/HANDOVER.md.

Do not raise again unless asked: the items under "Known defects and limits" in
docs/HANDOVER.md that are marked deferred: at present, defect 10. Defect 11 is dealt with on
the branch; decisions 55 and 56 wait on Anthony.

Rules that have been broken before and must not be again: read ~/.claude/CLAUDE.md in
full first. In this project: do not import .env into Netlify, do not push (Anthony types
/push), and do not call the site WCAG 2.2 AA conformant. When running the critique skill,
write the repository path out in full in the reader's command, or the push gate's stamp is
refused.

Run /handoff-check before leaving this context.
