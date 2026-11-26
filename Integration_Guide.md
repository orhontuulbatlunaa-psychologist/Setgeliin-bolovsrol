# Holland RIASEC — Preview integration

This branch is a staging workspace. The scoring engine is compiled with strict TypeScript settings before integration.

## Validation completed
- `Scoring_Engine.ts` passes `tsc --strict --target ES2020 --module commonjs`.
- The workbook contains five sheets: overview, Test 1, Test 2, Test 3 pairs, and validation cases.

## Required application safeguards
- Save each answer server-side as it changes; show save state and retry failures.
- Recalculate all three tests on the server from raw answers; never trust client-calculated scores.
- Test 1 and Test 2: 36 integer responses, each 0–3; six RIASEC groups, maximum 18 per type.
- Test 3: exactly 42 pair selections; validate each selection against the two occupations in that pair; count the selected RIASEC code. Maximum total selections: 42.
- Do not add raw scores across tests: the metrics differ (0–18 vs. 0–42).
- Keep admin review and report approval separate from scoring. No report is sent before approval.
- Keep raw answers immutable and version every recalculation.

## Step 4 comparison (source-faithful)
Use `Step4_Analyzer.ts`. Display three concentric hexagons in R–I–A–S–E–C order: interest on the inner ring, ability on the middle ring, occupation on the outer ring. Compare the top-three sets and identify the source's three cases: (1) overlap across all three tests; (2) interest and ability overlap but occupation differs; (3) all three differ strongly. In case 1, show common candidates and adjacent types. The source says the highest score among overlapping corners becomes dominant, but it does not define a cross-test common numeric scale or a tie-break for 18-point versus 42-count measures. Do not add or normalize raw scores; have the counselor confirm the dominant and two accompanying types. In case 2, advise expanding career knowledge and consulting parents, teachers, or a career counselor. In case 3, show the three reflection questions and recommend using ability as a reference if decision-making is difficult.

## Build
`npx tsc --strict --target ES2020 --module commonjs --outDir dist Scoring_Engine.ts`

This branch is not production-ready until source DOCX/XLSX files are committed as binary assets, the nine validation cases are run against the engine, application/API tests pass, and a Vercel Preview deployment is reviewed.