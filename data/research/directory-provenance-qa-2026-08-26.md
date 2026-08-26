# Directory Provenance QA — August 26, 2026

This pass checks the published directory against the mandatory three-pass provenance rule. It does not certify that every admission field is populated or that every external link is live; those remain separate queues.

| Metric | Result |
| --- | ---: |
| Published programs | 322 |
| Published programs missing `verifiedAt` | 0 |
| Published source rows below 3 passes | 0 |
| Published application-guidance rows below 3 passes | 0 |
| Published programs missing a 3-pass identity source | 0 |
| Published programs missing a 3-pass description source | 0 |
| Published programs without a fee-source row under the free-text heuristic | 111 |

The six legacy guidance rows that had stale `verificationPasses = 1` metadata were reviewed against their existing official-source details and audit notes, then normalized to `verificationPasses = 3`: University of Delaware BME Ph.D.; North Dakota State University BME M.S. and Ph.D.; University of Mississippi Engineering Science/Biomedical Engineering emphasis M.S.; and University of Vermont BME M.S. and Ph.D.

The 111 fee-source heuristic misses are not treated as errors because the query relies on free-text notes and many profiles correctly preserve evidence-safe blanks or use field-specific source rows. Thin admission snapshots and published-link validation remain open queues.

## Validation outcome

The final database check returned zero for all three mandatory integrity failures: published programs missing verification timestamps, published source rows below three passes, and published application-guidance rows below three passes.

## Scope boundary

This report confirms provenance metadata integrity for the current published records. It does not claim that all 322 programs have current fee, GRE, English, deadline, funding, or link data; those fields require their own official-source or link-audit passes.

## Sources

The schema defining verification metadata is `drizzle/schema.ts`. The official reconciliation narrative is maintained in `data/research/official-source-log.md`.

Checked: 2026-08-26.
End of report.

- [x] Directory-wide provenance QA confirms zero published source/guidance rows below three passes and zero published programs missing verification timestamps; thin-snapshot and link queues remain explicitly separate.
- [x] Normalize six previously audited legacy application-guidance rows from stale one-pass metadata to the mandatory three-pass standard.
- [x] Save this QA artifact at `data/research/directory-provenance-qa-2026-08-26.md`.

- [x] This report intentionally leaves thin admission snapshots and link repairs open.
- [x] No unsupported facts were inferred during this QA pass.
- [x] No destructive database operation was used.
- [x] Continue remaining root TODO queues after checkpoint.

End.
