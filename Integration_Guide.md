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

## Step 4 interpretation
Compare the top three interest, ability, and occupational types on the same RIASEC order (R–I–A–S–E–C). The source describes three patterns: (1) all three sets overlap; (2) interest and ability overlap but occupation differs; (3) all three differ strongly. Do not invent a weighted combined score. Where the source does not define a unique dominant type (including ties or ambiguous overlap), present the candidate pattern for counselor confirmation.

## Build
`npx tsc --strict --target ES2020 --module commonjs --outDir dist Scoring_Engine.ts`

This branch is not production-ready until source DOCX/XLSX files are committed as binary assets, the nine validation cases are run against the engine, application/API tests pass, and a Vercel Preview deployment is reviewed.