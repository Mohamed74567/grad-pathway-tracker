## Program Explorer loaded-state validation

Direct browser navigation to `/programs` first displayed the intentional `Loading verified records` skeleton with Ph.D./Master's/All tabs, search input, deadline/GRE/test-policy filters, and Reset explorer control. After the directory query resolved, inspectable DOM/text evidence showed `134 source-checked programs` in the Ph.D. view. Visible rows included Arizona State University, Binghamton University, Boston University, Brown University, California Institute of Technology, Carnegie Mellon University, Case Western Reserve University, Clarkson University, Clemson University, Colorado School of Mines, Colorado State University, Columbia University, Cornell University, Dartmouth College, Drexel University, Duke University, Florida Tech, FIU, George Mason, and Georgia Tech, each with Profile/Visit/Track controls or Saved state. The loaded state did not present a contradictory empty-result panel.

## Today dashboard loaded-state validation

Direct browser inspection of `/` confirmed the dashboard structure and navigation: Overview, Explore programs, My applications, Deadlines, Sound on, Explore programs, My applications, Open tracker, Set an action, and Open calendar. On the initial empty personal-workspace state the dashboard showed 0 saved applications, 0 due within 60 days, 0/0 documents complete, an empty next-action queue, an empty dated-deadlines panel, and six zero-valued pipeline statuses. A subsequent loaded state showed one saved application, 0 due within 60 days, 0/6 documents complete, one Boston University Fall 2027 Ph.D. deadline on Dec 15, and Accepted 1 in the pipeline. Evidence guardrails remained visible, including admission-first, source-aware, and separate-goals messaging; the dashboard reported 295 public verified records distinct from the private application list.

## My Applications loaded-state validation

Direct browser inspection of `/applications` confirmed the no-sign-in personal workspace with Export JSON and Import JSON controls, a private archive preserving 86 uploaded-tracker rows, and the pipeline label Researching → Applied → Interview → Offer → Accepted/Rejected. The application command center rendered PhD · 1, Master’s · 0, and All · 1 tabs with a Boston University Ph.D. row, direct Visit program link, Dec. 15, 2026 deadline, funding/requirements column, priority selector, document progress, status selector, target/result controls, and detailed workspace cards for Documents, up to three Letters of recommendation, and Notes & reminders. The private archive visibly distinguishes legacy user-owned rows from verified directory facts.

## Deadline calendar loaded-state validation

Direct browser inspection of `/calendar` confirmed the trust-oriented deadline planner with Under 30 days, 30–59 days, 60+ days, PhD, and Master’s filters, Previous month and Next month controls, and a December 2026 personal deadline month. The calendar displayed one dated official deadline: Boston University Fall 2027 Ph.D. application deadline on December 15, with a linked official source and PhD/official-source labels. The Near-term planning panel correctly stated that no saved-program dates fall within the next 60 days. The page explicitly states that annual guidance stays on program profiles until a current date is available.

## Populated admission snapshot validation: Arizona State University

Direct browser navigation to `/programs/arizona-state-biomedical-engineering-phd` rendered the source-credited Arizona State Biomedical Engineering Ph.D. profile. Inspectable DOM/text evidence showed the credited School of Biological and Health Systems Engineering hero image, Tempe location, US$75 U.S. application fee with international-fee qualification, optional GRE, annual December 15/July 15 priority guidance, Duolingo 105, accepted English-test routes, funding available, official application/program links, and source-attributed admission cards.

## Populated admission snapshot validation: UNC Chapel Hill

Direct browser navigation to `/programs/unc-chapel-hill-biomedical-engineering-phd` rendered the source-credited University of North Carolina at Chapel Hill Biomedical Engineering Ph.D. profile. Inspectable DOM/text evidence showed the UNC Bell Tower hero image with visible credit, Chapel Hill location, US$95 application fee, GRE not required, TOEFL/IELTS/Duolingo requirement with exemption wording, early-December deadline guidance with the Fall 2026 December 2 source date explicitly marked for active-cycle verification, funded status, official application/program links, and source-attributed admission cards. Together with the Florida Tech and Arizona State captures, this satisfies the three-populated-profile evidence requirement.

## Newly published profile validation: FAMU-FSU College of Engineering

Direct browser navigation rendered both `/programs/famu-fsu-biomedical-engineering-ms` and `/programs/famu-fsu-biomedical-engineering-phd`. The M.S. profile visibly showed the official FAMU-FSU College of Engineering image credit, Fall July 1 / Spring November 1 / Summer March 1 deadline guidance, qualified US$30 FAMU-versus-FSU fee wording, master’s GRE waiver through Fall 2026, university-specific Duolingo scores, English-test policy, and official program/application links. The Ph.D. profile visibly showed the same credited image, qualified fee wording, a source-backed GRE-waiver request policy rather than an invented universal exemption, university-specific Duolingo scores, English-test policy, official links, and no unsupported deadline card.

## Thin-snapshot validation: University of Tennessee Knoxville M.S.

Direct browser navigation rendered the refreshed UT Knoxville Biomedical Engineering M.S. profile with the credited Ayres Hall image, domestic deadline guidance, optional-but-recommended GRE policy, Duolingo 120, revised TOEFL/IELTS thresholds, funding-available treatment, direct official application/program links, and no unsupported fee card. The profile was checked on August 16, 2026.

## Link audit manual confirmation: Johns Hopkins M.S.E.

The automated offset-150 audit received HTTP 403 for the Johns Hopkins Biomedical Engineering M.S.E. program URL, but direct browser navigation loaded the official “Master’s Program” page successfully. The page visibly identified the Johns Hopkins Biomedical Engineering master’s program, its course-based and thesis-based routes, candidate requirements, financial-assistance qualifications, and official application navigation. The URL is therefore retained as a valid official destination; no replacement was made.

## Link audit manual confirmation: Johns Hopkins Ph.D. application page

Direct browser navigation to `https://www.bme.jhu.edu/johns-hopkins-biomedical-engineering/apply/` loaded the official Johns Hopkins Biomedical Engineering Apply page. The page explicitly presents separate master’s and Ph.D. application pathways and links the Ph.D. route to the official `applygrad.jhu.edu` destination. The automated HTTP 403 therefore reflects access protection rather than a broken or irrelevant official page; no replacement was made.

## Link audit manual confirmation: University of Maryland Graduate School application process

The offset-155 audit timed out on the legacy UMD application-process URL, but direct browser navigation safely resolved it to the current official `/admissions/application-process/apply-now` page. The page visibly provides the standard Graduate School application portal, application steps, test-score submission, fee payment, and direct graduate application controls. The official destination remains relevant; no replacement was needed because the browser followed an institutional route to the current canonical page.

## Link audit manual confirmation: Boston University engineering application portal

The offset-160 audit timed out on `https://bu-eng.cas.myliaison.com/`, but direct browser navigation resolved to the live Applicant Login Page at `/applicant-ux/#/login`. The portal visibly offers graduate applicant sign-in, account creation, and password recovery, confirming that it remains a relevant application destination for Boston University Biomedical Engineering. No replacement was made.

## Thin-snapshot validation: Brown University Sc.M.

The current Brown Graduate School International Applicants page explicitly states that it does not accept the Duolingo English proficiency test, names TOEFL and IELTS as accepted tests, and describes five years of guaranteed doctoral support. The companion language-proficiency page lists a TOEFL total of 90 before January 21, 2026 or 4.5 on the revised scale afterward, with an IELTS recommended minimum overall band score of 7. Direct browser navigation then rendered the refreshed Brown Biomedical Engineering Sc.M. profile with its credited School of Engineering laboratory hero, April 15 BME fall guidance, optional GRE, no-Duolingo policy, revised English thresholds, funding-available treatment, direct official links, and no unsupported fee card.
