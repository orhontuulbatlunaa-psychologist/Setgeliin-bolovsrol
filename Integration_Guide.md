# Holland RIASEC — GitHub Preview integration

**Status:** staging / not production-ready  
**Branch:** `feature/holland-riasec-integration`  
**Source:** user-provided Mongolian Holland questionnaire and manual.

## 1. Modules in this branch

- `Scoring_Engine.ts` — original scoring module at repository root.
- `src/lib/scoring/Step4Analyzer.ts` — source-faithful comparison of the three profiles.
- `.github/workflows/riasec-scoring.yml` — strict TypeScript checks for pull requests and staging-branch pushes.
- `Scoring_Methodology.docx` and `Scoring_Validation.xlsx` remain deliverables in the local handoff package; they are not yet committed as binary files in this branch.

## 2. Source scoring model

- Test 1 (interest): 36 answers, each 0–3; six RIASEC groups; maximum 18 per type.
- Test 2 (self-assessed ability): 36 answers, each 0–3; six RIASEC groups; maximum 18 per type.
- Test 3 (occupational preference): 42 paired choices; one occupation selected from each pair; count the RIASEC code attached to the selected occupation; maximum total selections 42.
- Equal scores remain tied. Keep every type tied at the third-place boundary; do not truncate tied profiles.
- Do not add raw scores from different tests: the source gives no common cross-test scale, weighting, or normalization formula.

## 3. Step 4 comparison

The UI should present three aligned RIASEC hexagons in the same R–I–A–S–E–C order:
1. Inner ring — interest.
2. Middle ring — self-assessed ability.
3. Outer ring — occupational preference.

`src/lib/scoring/Step4Analyzer.ts` identifies the source-described patterns:
- `THREE_WAY_OVERLAP`: at least one type appears in all three top profiles. The analyzer returns the common candidates and adjacent-type candidates. The counselor confirms the dominant and two accompanying types; no unsupported numeric composite is invented.
- `INTEREST_ABILITY_OVERLAP`: interest and ability overlap, but the occupation profile differs. Show the source interpretation: career knowledge may be limited or choices may have been influenced by superficial factors such as prestige or salary. Recommend career exploration and discussion with parents, teachers, or a career counselor.
- `THREE_WAY_DIVERGENCE`: no interest–ability overlap. Show the source reflection questions: “What do I really like?”, “What are my abilities?”, and “What work/career can I succeed in?” If decision-making is difficult, ability may be used as a reference and the participant may consult parents, teachers, or a counselor.

All Step 4 outcomes require counselor confirmation before a report is approved. This is guidance, not diagnosis or a guaranteed career prediction.

## 4. Build and CI

Local strict check:
```bash
npx tsc --strict --target ES2020 --module commonjs --noEmit Scoring_Engine.ts
npx tsc --strict --target ES2020 --module commonjs --noEmit src/lib/scoring/Step4Analyzer.ts
```

GitHub Actions workflow runs the same strict type-checks on branch pushes and PRs.

## 5. Required application integration

1. Build participant registration and create a unique test attempt.
2. Render all 36 + 36 + 42 source questions in the exact source order.
3. Autosave each answer server-side immediately; show saving/saved/error state and retry failed saves.
4. Recalculate from raw answers on the server; never trust client-supplied scores.
5. Persist raw answers, score snapshots, algorithm version, and timestamps.
6. Restrict admin review and report approval to authenticated administrators; log decisions.
7. Send a report only after explicit administrator approval.
8. Apply database access policies and keep service-role secrets server-only.

## 6. Current deployment status

This is a draft review branch, not a deployed product. The current repository still contains the original static-site structure; a full application framework, database, autosave API, administrator workflow, and report delivery have not yet been integrated. No Vercel Preview URL is claimed until a deployment is visible and tested.

Before production:
- verify all 42 Test 3 pair-to-code mappings against the source document;
- run the complete validation workbook against the committed scoring engine;
- test autosave, resume, duplicate submissions, access control, admin approval, and report delivery;
- have a qualified career-guidance professional review the interpretation wording and sample profiles.

## 7. Source-document audit and current verification

- The user-provided 38-page Mongolian Holland manual has now been reviewed, including embedded hexagon diagrams and sample result pages.
- Test 3 has 42 two-occupation pairs on printed pages 14–16. The 42 ordered pair-code entries in `TEST3_PAIRS` were compared against the source; **42/42 match**.
- The source's printed Test 3 example on pages 35–36 lists type counts `6,13,7,3,7,5`, which sum to **41**, while the stated total is 42. This printed example is internally inconsistent and must not be used as a passing golden fixture.
- Test 1 printed page 5 omits the `3` option in two rows in the first group. The overall response scale and chart maximum are 0–3 and the user confirmed the corrected score is 3; the engine accepts 0–3 for all 36 Test 1 items. Keep this source-printing defect documented for source-owner sign-off.
- Test 1 and Test 2 use six groups of six questions, each scored 0–3; each RIASEC type therefore ranges 0–18. Test 3 counts 42 selections. No raw-score sum or weighting across the tests is supported by the source.
- `Scoring_Engine.ts` now returns `tieLabel: "Тэнцсэн"` when two or more RIASEC types share the highest Test 3 count. Tied types at the third-place cutoff remain in `topThree`.
- Local verification completed: strict TypeScript compilation passed; runtime checks confirmed 42 pair definitions, 42 total Test 3 selections, Test 1 six-item group aggregation, and rejection of invalid choice codes and wrong answer counts.
- The current branch remains staging only. The tracked application is still a static `index.html`; participant UI, server-side persistence/autosave, admin approval, report generation, and email delivery are not integrated.
- Do not merge this draft PR to `main` until the printed sample inconsistency is resolved with the source owner, Step 4 is professionally signed off, and application end-to-end tests pass.
