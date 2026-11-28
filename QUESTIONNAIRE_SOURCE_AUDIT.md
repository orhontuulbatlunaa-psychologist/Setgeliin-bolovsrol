# Holland questionnaire source audit

Source: “МЭРГЭЖИЛ СОНГОЛТЫН ХОЛЛАНДЫН АРГА 9-12 АНГИ ТЕСТ (1).docx”, printed pages 5–13.

## Scope checked
- Test 1: 36 items, six groups of six (source pp. 5–6).
- Test 2: 36 items, six groups of six (source pp. 9–10).
- Group order used by the implementation: R, I, A, S, E, C.
- The item wording and order in `holland-questions.js` were reviewed against the source text.

## Text differences to retain for source-owner decision
The current JavaScript content normalizes several apparent spelling/orthographic errors in the source. These are wording edits, not changes to the questions' meaning or scoring. They are listed rather than silently reverted:
| Source wording | Current app wording | Source page / item |
|---|---|---|
| “Хүмүүсд” | “Хүмүүст” | p. 5, Test 1, group 4, item 3 |
| “зөвөлгөө” | “зөвлөгөө” | p. 5, Test 1, group 4, item 3 |
| “аюүлгүй” | “аюулгүй” | p. 5, Test 1, group 4, item 5 |
| “амжилтанд хүрэх” | “амжилтад хүрэх” | p. 6, Test 1, group 5, item 5 |
| “адал явдалын бичлэг” | “адал явдлын бичлэг” | p. 9, Test 2, group 3, item 4 |

The source extraction for Test 1, group 1, item 1 contains “мэь” in the text layer; this appears to be an OCR/text-extraction issue and needs visual confirmation before changing the app text “гэх мэт”.

## Response scale
- Test 1 and Test 2 use 0, 1, 2, 3 for each item in the source instructions.
- The printed page 5 table visually/textually omits the “3” on two Test 1 rows (group 1, items 4 and 6). The user has already clarified that this is a printing/typing error and that 3 is a valid response for all 36 items. The app therefore consistently offers 0–3.

## Scoring structure
Both tests contain 36 items, six groups of six. The source instructions say to total each group's six answers and identify first, second and third highest types. No weighting across the two tests is specified.

## Status and limitation
This is a manual content review of the 72 question texts and a record of editorial spelling differences. It is not a signed source-owner approval. The spelling normalizations above remain unchanged pending approval. The 42 Test 3 code-pair mapping is checked separately by the CI validator against the scoring engine.
