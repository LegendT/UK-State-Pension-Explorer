# Accessibility assessment: WCAG 2.2 Level A and AA

Assessed 29 September 2026; the automated and scripted tests below are as run on 18 October 2026, and the owner's tests by hand from 15 to 18 October 2026, in launch step 4 of `docs/launch-dependencies.md`, which records each finding and its fix. Later runs are in `docs/HANDOVER.md`, "Last checks". Status: **incomplete**. The site must not be described as meeting WCAG 2.2 AA.

Automated and scripted checks are a floor. They do not show conformance. The owner has tested parts of the site with VoiceOver and Safari, on a Mac the State Pension page's table and the four calculators and on an iPhone the triple lock calculator, and the site with a keyboard alone in Chrome and Firefox, and with zoom to 200% and 400%. No one has tested it with NVDA, or by touch without a screen reader.

## Scope

All built pages, 14 on 30 September 2026, 15 since the rule comparison got its own page on 1 October 2026, and 19 since every tool got its own page on 2 October 2026, and the four calculators. Each calculator was tested in its default state, after a result changed, and with errors showing. Every page was also tested with all `details` elements open.

## Environment actually used

| Item | Value |
| --- | --- |
| Browser | Chrome 155.0.8059.82 for the scripts. Safari, Chrome and Firefox for the owner's tests, versions not recorded |
| Operating system | macOS (Darwin 25.6.0), Apple silicon. iOS on an iPhone for the owner's VoiceOver tests, version not recorded |
| Automated rules | axe-core 4.11.4, tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa |
| Viewports | 390 × 844 and 1280 × 900, light and dark. 320 × 256 for reflow |
| Motion | `prefers-reduced-motion: reduce` |
| Assistive technology | VoiceOver on macOS and iOS, used by the owner, 15 to 17 October 2026 |
| Operator | An AI assistant running scripts, and the owner by hand |

## How to repeat the checks

```
npm run build
npm run a11y                          # writes reports/a11y.json
node scripts/a11y-manual-assist.mjs   # writes reports/a11y-manual-assist.json
```

Both scripts print their counts.

## Results of the last run

- `npm run a11y`: 0 violations. 0 audits with sideways page scroll. 0 audits with script errors. Every contrast result that axe marked incomplete was measured, 4,052 of them: 0 below threshold, 0 that could not be measured.
- `node scripts/a11y-manual-assist.mjs`: 0 problems on 19 pages.

The run recorded here was on 18 October 2026, after the fixes of launch step 4: 130 audits of 19 pages. The states scanned with an error use a scripted submit, so the "Out of date" note of decision 85 was not scanned. The front-end sweep of 1 October 2026 also ran axe at 320, 768 and 1280 px.

### What those runs did not establish

- Contrast was measured from computed colours against the nearest solid background. That method is valid only while the stylesheet has no background images, gradients, opacity or transparent colours. The script checks the stylesheet for them and fails if it finds any.
- The selector used to re-measure an incomplete result can match a different element with the same selector. Every element uses the same colour tokens, so the risk is small, but it is not zero.
- The keyboard script shows that focus reaches each control and that an outline style is set. It does not show that a person can complete a task. The owner's keyboard test did, in Chrome and Firefox, for the tasks step 4 records: reaching "Back to top" and the history explorer's copy. Its other steps are not written down.
- The scripts do not cover how a screen reader announces a result, an error or a chart. The owner's VoiceOver tests do, on a Mac for the four calculators and on an iPhone for the triple lock calculator.

## Criterion by criterion

Result values: **No failure found** (with the method), **Not applicable** (with the reason), **Not assessed** (needs a person).

| Criterion | Level | Result | Evidence or reason |
| --- | --- | --- | --- |
| 1.1.1 Non-text Content | A | No failure found | A paragraph just before each tool chart says what its lines are and where they start and end, and links to the full table of values (decision 104). The image is named "Line chart", and what is drawn in it is hidden from screen readers. axe `svg-img-alt`, `image-alt`. VoiceOver with Safari on a Mac read the paragraph and reached the table by its link, on the history explorer and the rule comparison. NVDA not assessed. |
| 1.2.1 to 1.2.5 Time-based media | A, AA | Not applicable | The site has no audio or video. |
| 1.3.1 Info and Relationships | A | No failure found | Semantic headings, lists, tables with `scope` and captions, `fieldset` and `legend`, labels. axe. VoiceOver with Safari on a Mac on the State Pension page's table and the four calculators; other pages not listened to, NVDA not assessed. |
| 1.3.2 Meaningful Sequence | A | No failure found | Source order is reading order. No CSS reordering. Tab order followed page order in the script. |
| 1.3.3 Sensory Characteristics | A | No failure found | Read through of instructions: none depends on shape, colour or position. Done by the author, not a second reader. |
| 1.3.4 Orientation | AA | No failure found | No orientation lock in the CSS. Not tested on a device. |
| 1.3.5 Identify Input Purpose | AA | Not applicable | No field collects information about the user that has a defined purpose token. Fields use `autocomplete="off"` so amounts are not stored. |
| 1.4.1 Use of Colour | A | No failure found | Chart series differ by dash pattern and marker shape. Links are underlined. Errors have text and a thicker border. |
| 1.4.2 Audio Control | A | Not applicable | No audio. |
| 1.4.3 Contrast (Minimum) | AA | No failure found | axe plus measurement of every incomplete result, light and dark. |
| 1.4.4 Resize Text | AA | No failure found | Sizes are in rem. The owner zoomed every page to 200% in Chrome, 18 October 2026. |
| 1.4.5 Images of Text | AA | No failure found | No images of text on pages. Share images contain text but are not shown on the site. |
| 1.4.10 Reflow | AA | No failure found | Script at 320 CSS px. Tables and charts scroll in their own region, which the criterion allows. The owner zoomed every page to 400% in Chrome, and the costs page and the budget explorer in Firefox, 18 October 2026. A focused table's outline that covered a caption letter at 400% was fixed first. |
| 1.4.11 Non-text Contrast | AA | No failure found | Calculated from the colour tokens, on all four backgrounds, light and dark. Control borders: lowest 3.15:1. Chart lines: lowest 5.75:1. Focus outline: lowest 7.37:1. The threshold is 3:1. |
| 1.4.12 Text Spacing | AA | No failure found | Script applied the four overrides. No clipping found. |
| 1.4.13 Content on Hover or Focus | AA | Not applicable | No content appears when another control is hovered or focused. No tooltips. The skip link (`.skip-link:focus` in the stylesheet) and "Back to top" (decision 108) show when they themselves take focus, which adds no content to another control. |
| 2.1.1 Keyboard | A | No failure found | Script reached every control by Tab. The owner's keyboard test in Chrome and Firefox passed, 17 and 18 October 2026; "Back to top", which Tab could not reach, was fixed (decision 108). |
| 2.1.2 No Keyboard Trap | A | No failure found | Script tabbed through each page and returned to the start. |
| 2.1.4 Character Key Shortcuts | A | Not applicable | No shortcuts. |
| 2.2.1 Timing Adjustable | A | Not applicable | No time limits. |
| 2.2.2 Pause, Stop, Hide | A | Not applicable | Nothing moves, blinks or updates on its own. |
| 2.3.1 Three Flashes | A | Not applicable | Nothing flashes. |
| 2.4.1 Bypass Blocks | A | No failure found | Skip link is the first element. Landmarks present. axe `bypass`. |
| 2.4.2 Page Titled | A | No failure found | Unique titles from the page register. `scripts/check-build.mjs` checks them. |
| 2.4.3 Focus Order | A | No failure found | Script: no backwards jumps. |
| 2.4.4 Link Purpose (In Context) | A | No failure found | Links name their destination. Repeated "More about this figure" summaries carry the figure name in hidden text. |
| 2.4.5 Multiple Ways | AA | No failure found | Main navigation, site map, and links in the text. |
| 2.4.6 Headings and Labels | AA | No failure found | Read through by the author. No skipped levels (script). |
| 2.4.7 Focus Visible | AA | No failure found | Script found an outline on every focused control. The owner's keyboard test in Chrome and Firefox passed. Its steps are not written down, so whether focus was looked at on every control is not recorded. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | No failure found | Script: no focused control was covered, including on the four tools, where a summary is pinned to the foot of screens narrower than 1024 px. The page is padded at the foot and scrolls a focused field clear of the summary, which holds nothing that takes focus. At 1024 px and wider the contents list stays in view in a column of its own, beside the content rather than over it. The scripts test 390 and 1280 px, not 1024 to 1279 px, where that column first appears. That range was looked at in screenshots only. |
| 2.5.1 Pointer Gestures | A | Not applicable | No gestures. |
| 2.5.2 Pointer Cancellation | A | No failure found | Native buttons and links, and the overview cards. `cards.js` acts on the `click` event, which fires on release, and does nothing on a press alone. |
| 2.5.3 Label in Name | A | No failure found | Visible labels are the accessible names. axe `label-content-name-mismatch`. |
| 2.5.4 Motion Actuation | A | Not applicable | None. |
| 2.5.7 Dragging Movements | AA | Not applicable | Nothing is dragged. No sliders. |
| 2.5.8 Target Size (Minimum) | AA | No failure found | Script, 18 October 2026: none under 24 × 24 apart from links in a sentence. Some controls are 24 to 43 px, below the house aim of 44. |
| 3.1.1 Language of Page | A | No failure found | `lang="en-GB"`. Checked by the build. |
| 3.1.2 Language of Parts | AA | Not applicable | No passages in another language. |
| 3.2.1 On Focus | A | No failure found | Nothing changes on focus. |
| 3.2.2 On Input | A | Not assessed | Every calculator redraws its result as the figures change, 400 ms after the last change, on the same page: the rule comparison since 1 October 2026 and the other three since 2 October 2026 (decision 78). Focus stays where it was and the page does not move. Loading a past decision or an example budget is still a button. Six choices change other fields at once, the budget explorer's period among them (W3): household (shows or hides a field, empties it, clears the example choice), scenario (refills the yearly figures and discards edits), number of years and first year (redraw the yearly rows), and pension series (refills the year lists). Each is described beside the control. A person has not judged whether that is enough. |
| 3.2.3 Consistent Navigation | AA | No failure found | One shared layout. |
| 3.2.4 Consistent Identification | AA | No failure found | Shared components. |
| 3.2.6 Consistent Help | A | Not applicable now. Not assessed for launch | No help mechanism exists yet. The place for it is the same on each page. |
| 3.3.1 Error Identification | A | No failure found | Errors are text, next to the field, linked with `aria-describedby`, and the field is marked invalid. VoiceOver with Safari on a Mac announced the error and read the error and hint when focus returned to the field, on the triple lock calculator. NVDA not assessed. |
| 3.3.2 Labels or Instructions | A | No failure found | Every field has a label and, where needed, a hint with format and range. |
| 3.3.3 Error Suggestion | AA | No failure found | Error text says what to enter and gives an example. |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Not applicable | No transaction and no stored data. |
| 3.3.7 Redundant Entry | A | Not applicable | No multi-step process. |
| 3.3.8 Accessible Authentication (Minimum) | AA | Not applicable | No sign-in. |
| 4.1.2 Name, Role, Value | A | No failure found | Native controls. axe. VoiceOver with Safari on a Mac in the four calculators; NVDA not assessed. |
| 4.1.3 Status Messages | AA | No failure found | Each calculator has a `role="status"` region that receives one message after a change, reading the result's summary. While a text field has focus the message waits, and is said when the reader leaves the field or presses Enter; on a touch screen, 1 second after leaving it (decisions 105 and 107). A change from a menu or button is said at once. VoiceOver with Safari read the messages in full on a Mac in all four calculators. On an iPhone, in the triple lock calculator, earlier timings were heard, but after every key or halfway through a figure; under decision 107 an on-screen log showed the message written once, 1 second after leaving the field, and it has not been listened to under that rule. On the iPhone, VoiceOver also read the summary "At a glance" after each digit, which is its own reading, to be looked at. NVDA not assessed. |

## Outstanding before any claim of conformance

Done in launch step 4, 15 to 18 October 2026: VoiceOver with Safari on a Mac for the State Pension page's table and the four calculators, and on an iPhone for the triple lock calculator and the budget explorer's example menu, keyboard-only use in Chrome and Firefox, and zoom to 200% and 400% in Chrome, with a spot check in Firefox.

1. VoiceOver with Safari on every other page, and on an iPhone for the budget explorer, the rule comparison and the history explorer. On the triple lock calculator on an iPhone: a paragraph read twice on one pass, which could not be repeated, and "At a glance" read after each digit.
2. NVDA with a supported Windows browser: every page, every calculator state, every chart and table.
3. A phone, by touch, without a screen reader.
4. The automated and scripted checks in Firefox and Safari.
5. Whether each change a choice makes to other fields is clear (3.2.2).
6. Usability sessions with disabled and older readers, where feasible.
7. A working route to report a barrier. At launch it is a GitHub issue, which needs a GitHub account: decision 69.
