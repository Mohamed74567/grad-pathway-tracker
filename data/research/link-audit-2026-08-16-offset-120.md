# Bounded official-link audit — offset 120

**Run date:** 2026-08-16  
**Scope:** Read-only audit with `AUDIT_OFFSET=120` and `AUDIT_LIMIT=20`.

The batch covered 20 URLs from 416 unique published URLs. One official application link redirected successfully: the University of Illinois Urbana-Champaign Graduate Admissions URL now resolves from `/admissions/apply` to `/admissions/apply-now` with HTTP 200. Three URLs were not confirmed healthy in this batch: the University of Notre Dame Bioengineering page returned a fetch failure, and two University of Kansas application pages timed out after five seconds. These results are **audit candidates, not confirmed broken links**; no URL was changed without direct official-page verification.
