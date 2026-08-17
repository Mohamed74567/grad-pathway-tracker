# Directory-wide QA coverage report

**Audit date:** August 17, 2026

## Scope and method

The audit covered every published program row in the GradPathway directory. For each row, the database was checked for at least one `programSources` record with `verificationPasses >= 3` for identity, description, and image. Application-link, fee, GRE, English, Duolingo, funding, and deadline coverage was counted separately because a source-safe blank is valid when an official source does not state a fact.

## Coverage results

| Audit measure | Result | Interpretation |
|---|---:|---|
| Published profiles | 293 | Current published directory size after removal of eight out-of-scope standalone Biological Engineering records and publication of the distinct UH Mānoa Molecular Biosciences and Bioengineering Ph.D., SIU Carbondale Biomedical Engineering M.S./Ph.D., and Rose-Hulman Biomedical Engineering M.S. |
| Missing three-pass identity source | 0 | Every published profile has identity provenance |
| Missing three-pass description/program source | 0 | Every published profile has program-context provenance |
| Missing three-pass image source | 0 | Every published profile has machine-verifiable image provenance |
| Missing application URL | 0 | Every published profile has a direct application destination |
| Missing fee field | 28 | Requires thin-snapshot review or explicit source-safe blank treatment. Northwestern Biomedical Engineering M.S./Ph.D. now use the current Graduate School US$95 non-refundable fee. |
| Missing GRE field | 42 | Requires thin-snapshot review or explicit source-safe blank treatment |
| Missing English field | 0 | All published profiles now have a source-backed English-policy field or qualified program-specific guidance |
| Missing Duolingo field | 35 | Requires thin-snapshot review; absence is not a claim of non-acceptance. The completed cohorts include Northwestern M.S./Ph.D., OHSU Ph.D., Colorado State’s Bioengineering Ph.D./M.S. plus Biomedical Engineering M.Eng., University of South Carolina’s Biomedical Engineering Ph.D./M.S./M.E., University of South Dakota’s Biomedical Engineering Ph.D. plus two M.S. profiles, Johns Hopkins BME M.S.E., Penn State’s BME Ph.D./thesis M.S., UC Irvine’s BME M.S./Ph.D., Stony Brook BME M.S./Ph.D., Texas A&M BME M.S./Ph.D., UConn BME M.S./Ph.D., UF BME M.S./Ph.D., UMD Bioengineering M.S./Ph.D., and SIU Carbondale BME M.S./Ph.D. Rose-Hulman BME M.S. remains blank because no current graduate-specific official DET standard was identified. Current UConn material accepts DET 110; current UF and UMD graduate material is TOEFL/IELTS-only or TOEFL/IELTS/PTE-only, while SIU accepts DET 115. Johns Hopkins BME Ph.D. remains blank because its School of Medicine materials do not publish an explicit DET policy. |
| Funding marked not stated | 39 | Requires source review or documented non-commitment; SIU Carbondale BME M.S. was intentionally added as not stated because current program material makes no funding promise |
| No deadline row | 48 | Requires deadline review or documented absence of a current program deadline; SIU Carbondale’s central Graduate School has no deadline and reviewed BME pages state no active dated deadline |

## Conclusion

The directory-wide provenance gate is satisfied for all 293 published profiles: no published profile is missing a three-pass identity, program-context, or image source, and all published profiles have a direct application URL. The English-policy remediation pass is complete with zero published profiles missing English treatment. The full 419-URL official-link audit is also complete; source-side timeouts, access controls, and institution-owned redirects were manually distinguished from confirmed broken destinations before any replacement. The current source-backed application-help layer covers twenty-one profiles with fee-waiver information and one profile with verified cross-degree consideration. The remaining quality work is not a provenance failure; it is the separate thin-admission-snapshot queue shown above. Those fields must be backfilled only from current official sources, and unsupported facts must remain blank or explicitly not stated.

## Remediation order

The next audit passes should prioritize fee and deadline rows, followed by GRE, funding, and the remaining Duolingo coverage. The completed link audit remains documented for future rechecks: a confirmed not-found response must be distinguished from a redirect, timeout, or source-side blocking response before any replacement. No external ranking or discovery page is used as an institutional admissions source.
