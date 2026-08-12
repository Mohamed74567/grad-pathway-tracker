# Program Data and Verification Standard

The uploaded tracker contains 86 application rows stored only in browser-local storage. It combines application-stage and decision-stage values, has duplicated program rows, lacks a separate master’s section, and has no persisted checklist or calendar workflow. Its source links also require re-verification: the list includes at least one non-university link, one blank link, several duplicated institutions, and tentative notes such as “not sure.” The rebuilt application will preserve the user’s observations as personal notes, but it will not treat those values as verified program data.

## Inclusion rule

A directory entry is eligible for publication only when the program itself and its degree type are confirmed on an official university, school, department, catalog, or graduate-admissions domain. The record must retain direct URLs for every factual field that is surfaced in the application. If a university has not officially published a detail, the interface must show **Not published by institution** rather than estimate it.

## Three-pass verification

| Pass | Check | Required evidence |
| --- | --- | --- |
| 1 | Program identity | Official program or department page confirms university, degree, field, and department. |
| 2 | Admissions facts | Official graduate-admissions, program, catalog, or tuition page confirms deadline, requirements, funding, and tuition where published. |
| 3 | Reconciliation | A second official page, official PDF, or official application portal corroborates time-sensitive fields; discrepancies remain visible as source notes rather than being silently merged. |

Each verified field records the source URL, the date checked, and a verification count. Annual deadlines retain their academic cycle and are never silently carried forward to a newer cycle.

## Data semantics

| Field | Presentation rule |
| --- | --- |
| Acceptance rate | Show a percentage only when the university officially publishes a rate clearly applicable to the relevant graduate program. Otherwise show **Not published by institution**. A university-wide rate is never presented as a program rate. |
| Tuition | Show the official annual, term, or per-credit amount together with its published basis and academic year. If only a general graduate tuition schedule is available, label it as university graduate tuition rather than program tuition. |
| Funding | Use **Funded**, **Funding available**, **Not stated**, or **Not applicable** only with an official source. Doctoral funding statements are distinct from master’s aid information. |
| QS/THE tier | Retain the named ranking publisher, edition, raw rank or rank band, source URL, and a transparent derived tier. Institutions not listed by the selected source remain **Not listed**, not Q3. |
| Campus image | Use a real campus photograph only when an appropriate official or clearly licensed source is available; otherwise use an elegant non-photographic fallback and provide the official program link. |

## User-owned tracking data

Program facts are globally sourced and immutable to normal users. Application status, saved programs, document completion, recommender status, notes, and personal dates are user-owned data. The status vocabulary is constrained to **Researching**, **Applied**, **Interview**, **Offer**, **Accepted**, and **Rejected**. A program may have zero to three letter-of-recommendation records.

## Legacy tracker migration map

| Legacy field | New location | Migration treatment |
| --- | --- | --- |
| `id` | Legacy import reference | Preserved only for traceability; the production database creates a new program identifier. |
| `university` | Program → university name | Retained as a discovery candidate, then normalized after official source verification. |
| `program` | Program → degree title and field | Split into degree type, formal title, and normalized subfield when official sources confirm them. |
| `website` | Program source → official program URL | Imported only as an untrusted candidate URL; replaced or removed if it is blank, non-official, redirected, or inconsistent with the program. |
| `deadline` | Program deadline record | Stored with academic cycle, deadline type, source, and checked date; historic or unverified dates remain separate from published current deadlines. |
| `notes` | Application note | Preserved as a private note on the user’s saved application, never used to populate published program facts. |
| `appStatus` | Application status | Converted from `Not Started` or `In Progress` to `Researching`; `Submitted` or `Completed` to `Applied`. The user confirms ambiguous historic values. |
| `result` | Application status | Converted from `Accepted` to `Accepted`, `Rejected` to `Rejected`, and `Pending` or `Waitlisted` to the nearest non-final user-confirmed stage. The rebuilt fixed vocabulary does not expose `Waitlisted` as a status. |

The former single-table experience is replaced by a verified directory linked to an independent personal-application table. This preserves user decisions and notes without allowing stale or unverified directory data to control the new interface.
