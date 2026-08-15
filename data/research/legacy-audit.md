# Legacy PHDUniTracker Audit

## Source inventory — 2026-08-15

The uploaded `PHDUniTracker.html` contains **86** visible initial program records (IDs 1–86), rather than the 88 referenced in earlier notes. The source is a Fall 2026 personal application tracker and includes historical deadlines, free-text notes, and direct program URLs; it is a discovery aid, not independently verified evidence.

## High-priority legacy data issues

| Legacy issue | Examples | Remediation treatment |
| --- | --- | --- |
| Duplicate schools | Arizona State University appears twice; Marquette University appears twice; University of Texas at Austin appears under two name variants. | Compare against published unique degree records; preserve distinct degrees but do not duplicate a profile for a repeat legacy row. |
| Unreliable or incomplete URLs | University of Michigan uses a non-university chat URL; Drexel has a blank website field. | Verify and replace only through current official university pages. |
| Historical cycle dates | Legacy dates are almost entirely 2025–26; some notes describe time-limited fee waivers. | Do not transfer stale dates or temporary waiver claims into current published profiles without a current official source. |
| Informal notes | “not sure,” “need second check,” and personal fee-waiver notes appear across records. | Treat as discovery prompts only; do not publish as admissions facts. |
| Degree-title ambiguity | Examples include “University of Dayton PhD in Bioengineering” with a note saying “Master,” and UAF/UAA-style broader biology records. | Retain official degree titles and only include separately awarded graduate programs within the project’s related-field boundary. |

## Published-directory quality snapshot

The current published directory has **286** profiles. All records currently have an official program URL, direct application URL, and credited campus/profile image. The next fact-backfill priority is source-safe admissions fields rather than basic link completion: 59 profiles lack a published fee, 60 lack a GRE policy, 35 lack an English-test policy, and 109 lack a Duolingo policy. These blanks are not errors by themselves; many appropriately remain blank until current official documentation is located.

## First remediation batch

1. Verify the University of Michigan legacy-link replacement and compare its current published profile against official BME/graduate-admissions routes.
2. Verify or repair the Drexel profile’s official program and application routes, using current Drexel pages rather than the legacy blank field.
3. Review the duplicated Arizona State, Marquette, and UT Austin legacy entries against directory slugs to separate valid degree variants from duplicate historical rows.

## Link-verification findings — 2026-08-15

| Profile | Current published route | Audit result |
| --- | --- | --- |
| University of Michigan Ph.D. in Biomedical Engineering | `https://bme.umich.edu/academics/graduate/phd/` | Verified in browser as the official University of Michigan BME Ph.D. page; the legacy non-university chat URL is not present in the published profile. |
| Drexel Ph.D. in Biomedical Engineering | `https://drexel.edu/biomed/academics/graduate-programs/biomedical-engineering-phd-degree/` | Verified through official Drexel text extraction as the BME doctoral page. It confirms post-baccalaureate/post-master’s entry, 90/45 credit structures, candidacy, proposal, and dissertation defense. The currently published direct application route also renders an official Drexel admission-application page. No link repair is needed. |

### Drexel admissions corroboration

Official Drexel BME graduate admissions currently states no GRE is needed, international applicants are Fall-only absent special permission, and primary doctoral support comes from faculty grants and School-funded teaching assistantships. The official school application checklist states TOEFL is required for international applicants or applicants with degrees outside the U.S.; the specific score values already published in the profile should remain source-tracked rather than altered from this verification alone. The legacy blank URL is therefore confirmed as historical-only and does not affect the current profile.

## University of Michigan admission-fact backfill — 2026-08-15

The current official U-M BME graduate-admissions page confirms the existing official Ph.D. and M.S. routes, Fall-only application timing, and the BME policy that the general GRE is neither required nor accepted. Rackham lists TOEFL, ECPE, IELTS, and MET as its English-proficiency tests and does not include Duolingo. The two University of Michigan BME profiles were therefore backfilled with the current source-labeled Rackham English requirements and explicit **Duolingo not accepted** treatment. The doctoral profile was then visually verified with its official hero, program and application links, current fee/GRE cards, and new English/Duolingo cards visible in the admission snapshot.

## Purdue BME source set ready for backfill — 2026-08-15

The official Purdue BME graduate-admissions page confirms thesis M.S. and Ph.D. Fall December 1 and Spring September 15 deadlines, no Summer entry, direct OGSPS application, research-area selection, and automatic consideration for admission and funding when an application is complete by the published deadline. The official OGSPS FAQ confirms the nonrefundable **US$60 domestic / US$75 international** application fee and that assistantships/fellowships are common but program-controlled. OGSPS English guidance confirms TOEFL, IELTS, and Duolingo acceptance, with Duolingo 115 overall and in each integrated subscore; current BME pages defer to this central requirement. BME’s current thesis M.S./Ph.D. admissions page does not state a GRE policy, so GRE will remain blank unless a separate current program-specific source is found.
