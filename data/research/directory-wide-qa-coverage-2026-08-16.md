# Directory-wide QA coverage report

**Audit date:** August 16, 2026

## Scope and method

The audit covered every published program row in the GradPathway directory. For each row, the database was checked for at least one `programSources` record with `verificationPasses >= 3` for identity, description, and image. Application-link, fee, GRE, English, Duolingo, funding, and deadline coverage was counted separately because a source-safe blank is valid when an official source does not state a fact.

## Coverage results

| Audit measure | Result | Interpretation |
|---|---:|---|
| Published profiles | 297 | Current published directory size |
| Missing three-pass identity source | 0 | Every published profile has identity provenance |
| Missing three-pass description/program source | 0 | Every published profile has program-context provenance |
| Missing three-pass image source | 0 | Every published profile has machine-verifiable image provenance |
| Missing application URL | 0 | Every published profile has a direct application destination |
| Missing fee field | 38 | Requires thin-snapshot review or explicit source-safe blank treatment. University of South Carolina Biomedical Engineering M.E. now uses the current qualified Graduate School fee source. |
| Missing GRE field | 45 | Requires thin-snapshot review or explicit source-safe blank treatment |
| Missing English field | 0 | All published profiles now have a source-backed English-policy field or qualified program-specific guidance |
| Missing Duolingo field | 48 | Requires thin-snapshot review; absence is not a claim of non-acceptance. Northwestern M.S./Ph.D., OHSU Ph.D., Colorado State’s Bioengineering Ph.D./M.S. plus Biomedical Engineering M.Eng., University of South Carolina’s Biomedical Engineering Ph.D./M.S./M.E., University of South Dakota’s Biomedical Engineering Ph.D. plus two M.S. profiles, Johns Hopkins BME M.S.E., Penn State’s BME Ph.D./thesis M.S., and UC Irvine’s BME M.S./Ph.D. were refreshed from current official sources. Johns Hopkins BME Ph.D. remains blank because its School of Medicine materials do not publish an explicit DET policy. |
| Funding marked not stated | 38 | Requires source review or documented non-commitment |
| No deadline row | 47 | Requires deadline review or documented absence of a current program deadline |

## Conclusion

The directory-wide provenance gate is satisfied for all 297 published profiles: no published profile is missing a three-pass identity, program-context, or image source, and all published profiles have a direct application URL. The English-policy remediation pass is now complete with zero published profiles missing English treatment. The full 419-URL official-link audit is also complete; source-side timeouts, access controls, and institution-owned redirects were manually distinguished from confirmed broken destinations before any replacement. The remaining quality work is not a provenance failure; it is the separate thin-admission-snapshot queue shown above. Those fields must be backfilled only from current official sources, and unsupported facts must remain blank or explicitly not stated.

## Remediation order

The next audit passes should prioritize fee and deadline rows, followed by GRE, funding, and the remaining Duolingo coverage. The completed link audit remains documented for future rechecks: a confirmed not-found response must be distinguished from a redirect, timeout, or source-side blocking response before any replacement. No external ranking or discovery page is used as an institutional admissions source.
