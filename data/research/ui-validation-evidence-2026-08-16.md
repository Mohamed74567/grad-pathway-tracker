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

## Link audit manual confirmations: Northeastern and MIT

The offset-165 audit produced a fetch failure for Northeastern’s Bioengineering Ph.D. page and a timeout for MIT Biological Engineering’s older Ph.D. URL. Direct browser navigation confirmed that Northeastern’s page is a live official “PhD in Bioengineering” page with admissions and application controls. The MIT URL resolved to the current official `/graduate-program/` page, which states that MIT BE offers a graduate Ph.D. and accepts applications through its annual departmental process. Neither result was treated as a broken or irrelevant destination, and no URL was replaced.

## Thin-snapshot validation: University of Oklahoma M.S.

Direct browser navigation rendered the refreshed University of Oklahoma Biomedical Engineering M.S. profile with the credited Gallogly Hall hero, current December 1 Fall / September 1 Spring guidance, US$50 domestic and US$100 international fee treatment, no-GRE policy, qualified Graduate College English and DET information, funding-available treatment, and official program/application links.

## Thin-snapshot validation: WPI M.S.

Direct browser navigation rendered the refreshed WPI Biomedical Engineering M.S. profile with its credited laboratory hero, rolling annual Fall-only funding-consideration guidance, US$70 fee, no-GRE treatment, master’s TOEFL/IELTS/Duolingo thresholds, funding-available treatment, and official program/application links.

## Link audit manual confirmations: Michigan State and University of Michigan

The offset-180 audit timed out on the Michigan State Graduate School Apply page and the University of Michigan BME Graduate page. Direct browser navigation confirmed that Michigan State’s page is a live official graduate application gateway with an explicit Apply Here control, program contacts, domestic/international instructions, and application portal. The University of Michigan BME page also loaded as a live official graduate hub with Ph.D., Master’s, admissions, financial-support, and direct M.S. program links. Neither candidate was broken or irrelevant, so no URL replacement was made.

## Link audit manual confirmations: University of Michigan and UM-Dearborn

The offset-185 audit timed out on University of Michigan’s ApplyWeb application URL, the BME Ph.D. page, and UM-Dearborn’s Bioengineering M.S.E. program/application pages. Direct browser navigation confirmed that ApplyWeb reaches a live U-M graduate login/create-account portal; the BME Ph.D. page is a live official doctoral-program destination; and both UM-Dearborn pages are live, relevant official resources. The UM-Dearborn application page also confirms direct graduate admission, a US$60 fee, limited waivers, and degree-specific criteria/deadline links. None of the audited URLs was replaced.

## Link audit manual confirmations: University of Minnesota

The offset-190 audit timed out on University of Minnesota Biomedical Engineering master’s/application pages and the Medical Device Innovation M.S. page. The master’s page returned the live official UMN title in the browser, and its saved rendered HTML confirmed the official Master’s Program page. Direct browser navigation to the BME How to Apply page confirmed official M.S./Ph.D. application instructions, a December 1 deadline, a limited fee-waiver pathway, and the online application link. The Medical Device Innovation M.S. page also loaded as a live official TLI program page with curriculum, admissions, deadlines, funding, and Apply Now controls. No URL was replaced.

## Link audit manual confirmations: University of Minnesota Ph.D. and Mississippi State

The offset-195 audit returned a 403 for the University of Minnesota Biomedical Engineering Ph.D. page and timeouts for the University’s graduate application gateway and Mississippi State’s graduate application portal. Direct browser navigation showed that the UMN Ph.D. page is a live official doctoral-program page with application, financial-support, faculty, research, and December 1 links. The UMN application URL resolved to a live Graduate Application Management page with account-access and account-creation controls. Mississippi State’s URL reached its official Graduate School SpamFireWall page, demonstrating source-side bot protection rather than a confirmed not-found or irrelevant destination; no replacement was made.

## Thin-snapshot validation: West Virginia University Ph.D.

Direct browser navigation rendered the refreshed West Virginia University Biomedical Engineering Ph.D. profile with its credited Statler College hero, January 15 / August 15 priority guidance, US$75 fee, no-GRE policy, current WVU TOEFL/IELTS/TOEFL Essentials/PTE rules, Duolingo 105 policy, funded doctoral status, and direct official program/application links.

## Thin-snapshot validation: Michigan State University Ph.D.

Direct browser navigation rendered the refreshed Michigan State Biomedical Engineering Ph.D. profile with its credited College of Engineering hero, December 1 Fall-only maximum-consideration guidance, no-GRE policy, current Graduate School TOEFL/IELTS standards, Duolingo 110 regular-admission policy, funding-available treatment, and direct official links. The application fee remains absent from the snapshot because the current official Graduate School page documents waiver pathways but does not publish a current base amount.

## Link audit manual confirmation: Montana State University

The offset-205 audit timed out on Montana State’s Bioengineering M.Eng. catalog URL. Direct browser navigation confirmed a live 2026–2027 official Montana State Academic Catalog page titled “M.Eng. in Bioengineering,” with program overview, requirements, learning outcomes, and curriculum. No URL replacement was made.

## Link audit manual confirmation: University of Nebraska–Lincoln

The offset-210 audit timed out on Nebraska’s graduate-application short link. Direct browser navigation resolved it to the University of Nebraska ApplyWeb portal, which presents UNL-specific login and new-account controls. The destination is live and relevant to graduate application intake; no URL replacement was made.

## Link audit manual confirmations: University of New Hampshire M.Eng. and ECE M.S.

The offset-220 audit timed out on UNH’s Bioengineering M.Eng. and Electrical and Computer Engineering Biomedical Engineering Option M.S. program URLs. Direct browser navigation confirmed both live official UNH program pages, with degree, location, curriculum/catalog, departmental, and Apply Now information. Neither URL was broken or irrelevant, so no replacement was made.

The remaining offset-220 Bioengineering Ph.D. URL also returned a live official UNH page title, “Bioengineering, Ph.D. - CEPS, UNH,” with doctoral-program, catalog, application, and Graduate School navigation visible in the browser DOM. The subsequent browser view reset to a blank page after the screenshot upload error, so the confirmation relies on the captured title and rendered interactive elements; no URL replacement was made.

## Link audit offset 225 — Princeton University

The automated audit returned HTTP 403 for Princeton’s official Graduate School Bioengineering page. Direct browser validation loaded the page titled “Bioengineering | Graduate School,” identifying the Omenn-Darling Bioengineering Institute, a Bioengineering Ph.D. offering, departmental context, doctoral research pillars, coursework, and a current academic-year page. The URL is live and relevant; no replacement was made.

The Princeton application URL timed out in the automated audit. Direct browser validation loaded the official Princeton Graduate School application login page with the title “Login,” Princeton Graduate School branding, email/password fields, and an Apply navigation link. This is a live official application portal; no replacement was made. No credentials were entered.

Offset 225 contained no redirect candidates. Both flagged destinations were retained without replacement.

## Link audit offset 230 — Rutgers University

The automated audit timed out on Rutgers’ `https://gradstudy.rutgers.edu/apply/new` application URL. Direct browser navigation followed the official Rutgers route to `https://rutgers.my.site.com/ApplicantPortal/AppPortalCustom`, titled “2027 Application Portal - Rutgers University.” This is a relevant official Rutgers graduate-application destination for the Biomedical Engineering M.S. and Ph.D. profiles. The destination is an expected current portal redirect, not an irrelevant page; no replacement was made. The portal loaded without requesting credentials, and no credentials were entered.

## Link audit offset 235 — University of New Mexico

The automated audit timed out on UNM’s Graduate Studies admissions page and Biomedical Engineering Ph.D. page. Direct browser navigation loaded the official Graduate Studies “Admissions” page, which provides a Start Your Application control, program-specific requirements guidance, and current domestic/international application-fee instructions. Direct navigation also loaded the official UNM Biomedical Engineering “PhD Degree” page, which describes the research-based doctoral program, 4–6 year duration, coursework and dissertation requirements, qualifying/comprehensive examinations, and financial-support/mentor expectations. Both URLs are live and relevant official destinations; no replacements were made.

## Link audit offset 240 — Binghamton University and Columbia University

The automated audit timed out on Binghamton’s Biomedical Engineering Ph.D. page and Columbia’s Biomedical Engineering M.S. page. Direct browser validation loaded Binghamton’s official “PhD in Biomedical Engineering | Binghamton University” page with doctoral requirements, coursework, research, an Apply Now control, and a June 29, 2026 update marker. Direct browser validation loaded Columbia Engineering’s official “Biomedical Engineering, MS” page with the Master of Science program title, in-person designation, curriculum and FAQ links, a How to Apply control, and official application links. Both URLs are live and relevant official destinations; no replacements were made.

## Link audit offset 245 — Columbia University and Cornell University

The automated audit timed out on Columbia’s Biomedical Engineering Ph.D. page and Cornell’s Biomedical Engineering M.Eng. and Ph.D. pages plus Cornell’s Graduate School application route. Direct browser validation loaded Columbia Engineering’s official “Biomedical Engineering, PhD” destination, though the visual capture was blank after navigation; the official title and URL were returned and no replacement was made. Direct browser validation loaded Cornell’s official Meinig School “M.Eng. in Biomedical Engineering” page with current program description, degree-specific admission and curriculum links, and Apply Now controls. Cornell’s doctoral page and Graduate School application route remain pending manual confirmation in the next browser steps. No URL replacements were made.

The remaining offset-245 Cornell candidates were manually confirmed. Cornell’s official Meinig School “Ph.D. Program” page loaded with doctoral-program content, degree requirements, research fields, student-experience resources, and an Apply Now control. Cornell’s official Graduate School “Apply Now” page loaded with current application timing guidance and direct ApplyWeb account/application links. Both destinations are live and relevant; no replacements were made.

## Link audit offset 250 — Cornell ApplyWeb and New York Tech

The automated audit timed out on Cornell’s direct ApplyWeb form URL and New York Tech’s Bioengineering M.S. page. Direct browser navigation to Cornell’s URL reached the Cornell-branded CollegeNET ApplyWeb login page, with Cornell logo, application login, and create-account controls. Direct browser validation loaded New York Tech’s official “Bioengineering, M.S.” page, showing the degree title, 30-credit program snapshot, Long Island location, curriculum, admission requirements, tuition/financial-aid links, and Apply controls. Both destinations are live and relevant; no replacements were made. NYU’s program and application URLs remain pending manual confirmation in this batch.

The remaining offset-250 NYU program URL returned the official title “Biomedical Engineering, M.S. | NYU Tandon School of Engineering,” confirming a live, degree-specific official program destination despite a failed screenshot upload. NYU Tandon’s `apply.engineering.nyu.edu/apply/` URL loaded without a visible title or rendered controls in the browser. It remains an official-domain candidate but is not yet treated as independently verified from visible page content; no replacement was made and a subsequent inspection is required.

A follow-up browser inspection confirmed NYU Tandon’s application page as a live official Graduate Application destination. It identifies “Welcome to the NYU Tandon Graduate Application,” correctly reports the 2026 application cycle as closed, provides a 2027 notification form, and exposes official deadline and requirements sections. The returned page content confirms relevance for the Biomedical Engineering M.S. and Ph.D. profiles; no replacement was made.

## Link audit offset 255 — Rochester Institute of Technology

The automated audit timed out on RIT’s Biomedical Engineering M.S. URL. Direct browser validation loaded the official “Biomedical Engineering MS | RIT” page with the Master of Science degree label, program overview, curriculum, admissions-and-financial-aid navigation, degree-specific request-information/visit/apply controls, and biomedical engineering master’s requirements. The URL is live and relevant; no replacement was made.

## Link audit offset 260 — Rochester Institute of Technology and Stony Brook University

The automated audit timed out on RIT’s application portal and Biomedical and Chemical Engineering Ph.D. page, plus Stony Brook’s Biomedical Engineering M.S. page and graduate application URL. Direct browser validation loaded RIT’s official Admissions Portal with login/create-account controls and explicit start/complete-application and checklist functions. RIT’s official “Biomedical and Chemical Engineering Ph.D. | RIT” page also loaded with degree-specific research and admission requirements, including a link to the same graduate application portal. Stony Brook’s official “Master’s Program | Biomedical Engineering” page loaded with M.S. curriculum context and academic, industry, and entrepreneurship tracks. These three destinations are live and relevant; no replacements were made. Stony Brook’s graduate application portal remains pending the next manual check.

The remaining offset-260 Stony Brook application URL was manually confirmed as a live official Graduate School “Application Management” page. It identifies annual program-specific applications, provides deadline access, and distinguishes returning-user login from first-time account creation. The destination is relevant for the Biomedical Engineering M.S. and Ph.D. profiles; no replacement was made.

## Link audit offset 265 — The City College of New York

The automated audit timed out on CCNY’s Biomedical Engineering M.S. page and graduate application URL. Direct browser validation loaded the official “M.S. Program in BME | The City College of New York” page with Master of Science degree context, degree requirements, BME M.S. highlights, program-specific application procedure, and an Apply Here control. Direct browser validation also loaded CCNY’s official “Graduate Admission” application page, with return-login and first-time-account controls and an explicit Graduate Studies Application information route. Both destinations are live and relevant for CCNY Biomedical Engineering M.S./Ph.D. application research; no replacements were made.

## Link audit offset 270 — CCNY and University at Buffalo, partial confirmations

The automated audit timed out on CCNY’s Biomedical Engineering Ph.D. page, University at Buffalo’s Biomedical Engineering M.S. page and application URL, University at Buffalo’s Biomedical Engineering Ph.D. page, and University of Rochester’s Biomedical Engineering M.S. page. Direct browser validation loaded CCNY’s official “Ph.D. Program in BME” page with degree requirements, application guidance, and the department’s published doctoral support statement. Direct browser validation also loaded University at Buffalo’s official “Master’s Program” page with BME degree context, curriculum, official Apply Now route, current rolling admissions language, and priority dates. Both confirmed program URLs are live and relevant; no replacements were made. Buffalo’s application/doctoral page and Rochester’s M.S. page remain pending manual confirmation.

The remaining University at Buffalo offset-270 candidates were manually confirmed. UB’s Graduate School Application Manager loaded with instructions for new and current applicants plus login and account-creation controls. UB’s official “Doctoral Program (PhD)” BME page loaded with research areas, doctoral degree context, current application deadlines, and the same official Apply Now route. Both destinations are live and relevant; no replacements were made. The University of Rochester M.S. page remains for the final offset-270 manual check.

The final offset-270 University of Rochester candidate was manually confirmed. The official Hajim School “Master’s Program” Biomedical Engineering page loaded with coursework, CMTI, and thesis M.S. options, graduate-program navigation, application guidance, and University of Rochester Medical Center context. The URL is live and relevant; no replacement was made. Offset 270 is complete with no confirmed broken or irrelevant destination.

## Link audit offset 285 — Case Western Reserve University

The automated audit timed out on Case Western Reserve’s graduate application URL. Direct browser navigation followed the official route to Case’s Graduate/Professional Program application page, with explicit returning-applicant login and first-time-account creation controls. The destination is live, official, and relevant for Case Western Biomedical Engineering M.S. and Ph.D. applications; no replacement was made.

## Link audit offset 295 — Ohio State and University of Cincinnati, partial confirmations

The automated audit timed out on Ohio State’s graduate application URL, University of Cincinnati’s Biomedical Engineering M.S. page, and University of Cincinnati’s graduate application URL. Direct browser navigation followed Ohio State’s legacy `gradapply.osu.edu` route to the live official Graduate and Professional Admissions Degrees and Programs page. Direct browser validation loaded Cincinnati’s official “M.S. in Biomedical Engineering Degree” page with master’s program context, degree-specific Apply guidance, admission requirements, and the Graduate Studies Office deadline route. Both reviewed destinations are live and relevant; no replacements were made. Cincinnati’s application portal remains pending manual confirmation.

The remaining offset-295 Cincinnati application URL was manually confirmed as a live University of Cincinnati “Application Management” portal with applicant login and first-time-account creation. It is relevant for Biomedical Engineering M.S. and Ph.D. applications; no replacement was made. Offset 295 is complete with no confirmed broken or irrelevant destination.

## Clean link-audit batches — offsets 275 and 280

Automated five-URL audit batches at offsets 275 and 280 returned no failed, errored, or redirect candidates. No manual remediation or URL change was required for either batch.

## Link audit offset 300 — Wright State and University of Oklahoma, partial confirmations

The automated audit timed out on Wright State’s graduate application URL, University of Oklahoma’s Biomedical Engineering graduate page, and OHSU’s Biomedical Engineering graduate-program page. Direct browser navigation followed Wright State’s legacy route to a live official Graduate Studies “Admission to Graduate Programs” page with an apply-online route and Biomedical Engineering M.S. listing. Direct browser validation loaded Oklahoma’s official Stephenson School “Graduate Programs” page with Biomedical Engineering M.S. thesis/non-thesis and Ph.D. offerings, Apply Now navigation, and graduate-application guidance. Both reviewed destinations are live and relevant; no replacements were made. OHSU remains for the final manual confirmation.

The final offset-300 OHSU candidate was manually confirmed. OHSU’s official “Biomedical Engineering Ph.D. Program” page loaded with doctoral-program navigation, research context, admissions/academics links, and a direct official Apply Now destination. The URL is live and relevant; no replacement was made. Offset 300 is complete with no confirmed broken or irrelevant destination.

## Link audit offset 305 — Oregon Health & Science University

The automated audit timed out on OHSU’s LiaisonCAS application URL. Direct browser navigation resolved it to the OHSU-branded LiaisonCAS domain, `ohsu.cas.myliaison.com`, with the title “Liaison International, Centralized Application Service.” A follow-up browser view retained the same official redirected URL and title but rendered a blank application shell. Because OHSU’s current official Biomedical Engineering Ph.D. page itself links to this application route, the destination is retained as the official application portal; no replacement was made. The record does not claim a successfully rendered login form.

## Link audit offset 310 — Carnegie Mellon and Drexel, partial confirmations

The automated audit timed out on Carnegie Mellon’s graduate application page plus Drexel’s Biomedical Engineering M.S. page, graduate application portal, and Biomedical Engineering Ph.D. page. Direct browser navigation resolved Carnegie Mellon’s legacy route to the current official College of Engineering graduate-admissions page with an online application control. Direct browser validation loaded Drexel’s official “Master of Science (MS) in Biomedical Engineering” page with degree requirements, specialization context, Graduate Admissions and Apply controls. Both reviewed destinations are live and relevant; no replacements were made. Drexel’s application portal and Ph.D. page remain for the next manual checks.

The remaining offset-310 Drexel candidates were manually confirmed. Drexel’s official Admission Application page loaded with application instructions, returning-user login, and first-time-account creation. Drexel’s official “PhD in Biomedical Engineering” page loaded with doctoral admission pathways, program guidance, and Apply Now controls. Both destinations are live and relevant; no replacements were made. Offset 310 is complete with no confirmed broken or irrelevant destination.

## Link audit offset 315 — Pennsylvania State University

The automated audit timed out on Penn State’s Graduate School application URL. Direct browser navigation resolved it to the current official Fox Graduate School “How to Apply” page with the full graduate-application preparation path, account-creation guidance, and application login control. The destination is live and relevant for Penn State Biomedical Engineering M.S. and Ph.D. applicants; no replacement was made.

## Link audit offset 320 — Temple University

The automated audit timed out on Temple’s legacy Bioengineering M.S. URL. Direct browser navigation resolved it to the current official “Bioengineering MSBIOE | Temple University” page, showing the Master of Science in Bioengineering, admissions information, direct Apply controls, curriculum/track information, and related Bioengineering Ph.D. navigation. The destination is live and relevant; no replacement was made.

## Link audit offset 325 — University of Pennsylvania and University of Pittsburgh, partial confirmations

The automated audit timed out on Penn’s Bioengineering Ph.D. page, Pitt’s Bioengineering graduate-program overview and graduate application page, plus Villanova’s Biomedical Engineering M.S. page and application URL. Direct browser validation loaded Penn’s official Bioengineering “Doctoral Program” page with program/admissions/fellowship navigation and doctoral research context. Direct browser validation loaded Pitt’s official “Bioengineering Graduate Academics” overview with Ph.D., Research M.S., and Professional M.S. including Neural Engineering Focus options plus an Apply Now route. Both reviewed destinations are live and relevant; no replacements were made. Pitt’s application page and both Villanova destinations remain pending manual confirmation.

The remaining offset-325 Pitt application URL was manually confirmed. Pitt’s official Swanson School “Graduate Application” page loaded with Fall 2026/Spring 2027 application access, current-term deadline link, applicant-save-and-return guidance, EngineeringCAS support, and an application-fee-waiver route. The destination is live and relevant for Pitt Bioengineering applicants; no replacement was made. Both Villanova destinations remain for the final offset-325 checks.

The final offset-325 Villanova candidates were manually confirmed. Villanova’s Biomedical Engineering M.S. URL returned the official “MS in Biomedical Engineering | Villanova University” title and official program URL, despite a failed screenshot upload. Villanova’s linked Graduate and Professional Colleges “Application Management” portal loaded with returning-user login and first-time-account creation controls. Both destinations are live and relevant; no replacements were made. Offset 325 is complete with no confirmed broken or irrelevant destination.

## Link audit offset 330 — Brown University and Clemson University

Offset 330 found Brown’s application-information URL returning a 200 redirect to Brown’s current official “Apply for MFA or Doctoral Study at Brown” page. The redirect remains institution-owned and relevant for the listed Brown graduate profiles, so no replacement was made. Clemson’s automated timeout was manually checked: the legacy route resolved to the live official “Apply to Clemson as a Graduate Student” page with application portal, status, account-creation workflow, and current no-fee statement. No replacement was made.

## Link audit offset 335 — University of South Carolina

The automated audit timed out on the University of South Carolina’s ApplyWeb URL. Direct navigation returned the expected JavaScript-required gate at the `uscgrad` ApplyWeb tenant. A follow-up rendered inspection could not run because the browser session became unavailable. The URL is an institution-specific ApplyWeb application endpoint shared by the University of South Carolina Biomedical Engineering M.E., M.S., and Ph.D. profiles; no replacement was made without confirmed not-found or irrelevant evidence.

## Link audit offset 345 — University of Memphis / University of Tennessee Health Science Center

The automated audit timed out on UTHSC’s LiaisonCAS application URL. Direct browser navigation resolved it to the UTHSC-branded `uthsc.cas.myliaison.com` centralized application-service portal. A follow-up browser view rendered an applicant login page with username/password fields, sign-in, create-account, and credential-recovery controls. The destination is live and relevant for the Biomedical Engineering Ph.D. profile; no replacement was made.

## Link audit offset 350 — Rice University

The automated audit timed out on Rice’s graduate application URL. Direct browser validation loaded Rice University’s official “Application Management” page with applicant login and first-time-account creation controls. The destination is live and relevant for Rice Bioengineering MBE and Ph.D. applicants; no replacement was made.

## Link audit offset 355 — The University of Texas at Arlington

The automated audit timed out on UTA’s Biomedical Engineering M.S. URL. Direct browser validation loaded the official “Master of Science in Biomedical Engineering” page, identifying the joint UTA/UT Southwestern Medical Center program, degree overview, admission-requirements and curriculum links, and Apply Now controls. The destination is live and relevant; no replacement was made.

## Link audit offset 365 — The University of Texas at San Antonio

The automated audit timed out on UT San Antonio’s 2027 LiaisonCAS URL. Direct browser navigation resolved it to the UTSA-branded `utsa2027.cas.myliaison.com` centralized application-service destination, titled “Liaison International, Centralized Application Service.” A follow-up browser view retained the same official tenant and title but rendered a blank shell. The URL is retained as the institution-specific centralized application portal; no replacement was made and no rendered-login claim is made.

## Link audit offset 370 — University of Houston and University of Utah

The automated audit timed out on University of Houston’s Graduate School application page and University of Utah’s apply page. Direct browser navigation resolved Houston’s legacy URL to the live official Graduate School “How to Apply” page, which states that UH uses ApplyWeb and provides the account/application route. Direct browser validation loaded Utah’s official “Apply | Admissions” page, with a graduate-student application path and separate graduate application-status guidance. Both destinations are live and relevant; no replacements were made.

## Link audit offset 375 — University of Utah and Utah State University

The automated audit timed out on the University of Utah Neural Engineering Ph.D. catalog page and Utah State’s graduate-admissions page. Direct browser validation loaded Utah’s official 2026–2027 General Catalog page for the Neural Engineering Doctor of Philosophy, with degree, program-requirements, and Graduate School application information. Direct navigation loaded Utah State’s official School of Graduate Studies “Steps to Apply” page with admissions eligibility, application policy/FAQ links, and account/application workflow. Both destinations are live and relevant; no replacements were made.

## Link audit offset 380 — University of Virginia

The automated audit timed out on UVA’s Biomedical Engineering M.E. URL. Direct browser validation loaded the official “M.E. in Biomedical Engineering | University of Virginia School of Engineering and Applied Science” page with program purpose, two-semester curriculum, clinical-design context, and Apply controls. The destination is live and relevant; no replacement was made.

## Link audit offset 385 — University of Virginia

The automated audit received HTTP 403 for UVA’s Biomedical Engineering M.S. page and BME application page. Direct browser validation loaded the official “M.S. in Biomedical Engineering” page with 18–24 month timeline, thesis requirements, funding qualification, and BME context. Direct validation also loaded UVA’s official “Apply to BME (and What You Need to Know)” page with M.S., M.E., and Ph.D. routes, fee-waiver guidance, graduate-admission FAQs, December 16 doctoral deadline, and Apply Now control. Both destinations are live and relevant; no replacements were made.

## Link audit offset 390 — Virginia Commonwealth University

The automated audit timed out on VCU’s Biomedical Engineering Ph.D. bulletin URL. Direct browser validation loaded the official 2026–27 VCU Bulletin page titled “Biomedical Engineering, Doctor of Philosophy (Ph.D.),” with doctoral program mission, goals, degree content, and official catalog status. The destination is live and relevant; no replacement was made.

## Link audit offset 395 — University of Washington, application confirmation

The automated audit timed out on UW’s Graduate School application URL. Direct browser navigation resolved it to the current official Graduate School Apply Now page; a follow-up browser view loaded the full application workflow with start-application/login access, program-timing guidance, application-fee and waiver information, and status functions. The destination is live and relevant for UW Bioengineering graduate profiles; no replacement was made. UW Pharmaceutical Bioengineering, Bioengineering Ph.D., and Washington State candidates remain for the next manual checks.

The remaining UW offset-395 program checks produced mixed browser behavior. The Master of Pharmaceutical Bioengineering URL timed out in the browser and displayed a browser-level timeout page, so it is not independently confirmed in this pass; no replacement was made because a timeout does not establish a broken or irrelevant destination. In contrast, UW’s official “PhD Program – UW Bioengineering” page loaded with doctoral-program content, application link, GRE-optional statement, and Autumn 2027 application-window information. The Ph.D. destination is live and relevant; no replacement was made. Washington State candidates remain for the next manual checks.

The remaining offset-395 Washington State candidates were manually confirmed. WSU’s official Graduate School “Master of Science in Engineering (Interdisciplinary)” page loaded with Bioengineering among the specializations, M.S. thesis/non-thesis context, deadlines, and Apply Now link. EngineeringCAS loaded its live application page with open cycle options, account/application workflow, applicant help, and deadline guidance. Both destinations are live and relevant; no replacements were made. Aside from the qualified UW Pharmaceutical Bioengineering timeout retained without change, offset 395 is complete.

## Link audit offset 400 — Washington State and West Virginia, partial confirmations

The automated audit timed out on Washington State’s Engineering Science Ph.D. page, West Virginia’s Biomedical Engineering catalog and two graduate-application pages, and the Marquette–MCW joint BME degree page. Direct browser validation loaded Washington State’s official “Doctor of Philosophy in Engineering Science” Graduate School page, which includes Bioengineering among specializations, Ph.D. degree context, priority dates, and Apply Now navigation. Direct browser validation loaded West Virginia’s official 2026–27 catalog page for Biomedical Engineering M.S.Bm.E. and Ph.D., plus the Graduate WVU Gateway portal with applicant login and first-time-account creation. These three reviewed destinations are live and relevant; no replacements were made. WVU’s alternate how-to-apply route and the Marquette–MCW page remain for the final checks.

The remaining offset-400 candidates were manually confirmed. West Virginia’s official Graduate Admissions “How to Apply” page loaded with applicant-type guidance for first-time, returning, international, and other graduate applicants. The Marquette–MCW Joint Department official “Graduate Degree Programs” page loaded with Biomedical Engineering M.S. and Ph.D. program descriptions, degree bulletin links, and separate official master’s/doctoral application routes. Both destinations are live and relevant; no replacements were made. Offset 400 is complete with no confirmed broken or irrelevant destination.

## Link audit offset 405 — Wisconsin and Marquette, partial confirmations

The automated audit flagged Wisconsin’s graduate application route, Marquette’s M.S. application portal, MCW’s Ph.D. application portal, and two UW–Madison Biomedical Engineering M.S. program pages. Direct browser navigation resolved Wisconsin’s legacy route to the University of Wisconsin–Madison Graduate School Application Management portal with login/create-account controls. Direct browser validation loaded Marquette’s Graduate School online application page with current applicant guidance plus login/create-account controls. Both destinations are live and relevant; no replacements were made. MCW’s doctoral application portal and the two UW–Madison program pages remain for the next manual checks.

The next offset-405 checks were manually confirmed. MCW’s official Application Management portal loaded with returning-applicant login and first-time-account creation for the joint Biomedical Engineering Ph.D. route. UW–Madison’s official “Biomedical Engineering Accelerated MS” page loaded with program type, one-year course-based format, degree award, specializations, admissions terms, and how-to-apply navigation. Both destinations are live and relevant; no replacements were made. The UW–Madison Biomedical Innovation, Design and Entrepreneurship M.S. page remains for the final offset-405 check.

The final offset-405 UW–Madison candidate was manually confirmed. The official “Biomedical Engineering: Biomedical Innovation MS” page loaded with one-year accelerated course-based format, College of Engineering and School of Business cooperation, program requirements, application-materials route, and how-to-apply navigation. The destination is live and relevant; no replacement was made. Offset 405 is complete with no confirmed broken or irrelevant destination.

## Link audit offset 410 — University of Wisconsin–Madison, partial confirmations

The automated audit timed out on UW–Madison’s Biomedical Engineering Research M.S. page, Graduate School admissions page, Biomedical Engineering Ph.D. page, and University of Wisconsin–Milwaukee M.S./application pages. Direct browser validation loaded UW–Madison’s official “Master’s degree in biomedical engineering” Research M.S. page with graduate handbook, program/department context, Graduate Admissions, and Start Your Application controls. Direct browser validation also loaded UW–Madison’s official Graduate School Admissions page with application portal, graduate-program directory, materials, fee-grant, application-status, English-test, and recommendation guidance. These two destinations are live and relevant; no replacements were made. UW–Madison Ph.D. and Milwaukee candidates remain for the next manual checks.

The next offset-410 candidates were manually confirmed. UW–Madison’s official “Biomedical Engineering, PhD” College of Engineering page loaded with doctoral research context, Graduate School Apply Today route, graduate-admissions navigation, and program-specific Guide link. UW–Milwaukee’s official “Engineering MS: Biomedical Engineering” page loaded with Biomedical Engineering concentration, on-campus master’s format, Apply Now link, thesis/non-thesis paths, assistantship information, rolling-admission treatment, catalog link, and contacts. Both destinations are live and relevant; no replacements were made. UW–Milwaukee’s graduate application portal remains for the final offset-410 check.

The final offset-410 UW–Milwaukee candidate was manually confirmed. The legacy ApplyGrad URL redirected to UWM’s official “Start Your Graduate School Application” page, which provides an all-graduate-program new-applicant form, Application Management Portal for returning applicants, and clear program-selection workflow. The destination is live and relevant; no replacement was made. Offset 410 is complete with no confirmed broken or irrelevant destination.

## Admissions snapshot refresh — Northwestern University Biomedical Engineering M.S. and Ph.D.

The current official Northwestern BME M.S. admissions page loaded in the browser with the department’s Graduate School application and admissions links. Northwestern TGS’s current Test Scores page was separately extracted and states that Duolingo and TOEFL Essentials are not accepted for the English-language proficiency requirement. The verified no-Duolingo treatment was written to both Northwestern BME profiles with matching three-pass source records; browser profile rendering will be checked in the next UI validation pass.

Follow-up browser validation loaded the full Northwestern Biomedical Engineering M.S. profile rather than the initial loading shell. The visual admission snapshot showed the credited Northwestern campus hero, deadline, GRE treatment, and the new Duolingo card: “Not accepted; Northwestern TGS does not accept Duolingo English Test or TOEFL Essentials to meet the English-proficiency requirement.” This confirms the stored source-backed policy renders in the no-sign-in public profile.

## Admissions snapshot refresh — Oregon Health & Science University Biomedical Engineering Ph.D.

The current official OHSU Graduate Studies admissions page and BME Ph.D. admissions page were extracted from the live sources. Both specify TOEFL and/or IELTS rather than Duolingo for relevant English-proficiency evidence, with explicit waiver pathways. The verified no-Duolingo treatment was stored with a three-pass source record; the rendered public profile will be checked in the next UI validation pass.

Follow-up browser validation loaded the full OHSU Biomedical Engineering Ph.D. profile with the credited OHSU Knight Cancer Institute campus hero. Its admission snapshot visibly showed the updated Duolingo card: “Not accepted; OHSU requires TOEFL or IELTS when English-proficiency evidence is required, subject to documented waiver pathways.” The policy therefore renders as a source-backed fact in the no-sign-in public profile.

## Source-safe blank confirmation — University of Pittsburgh Bioengineering Research M.S. fee

The current Swanson School of Engineering Graduate Application page loaded with the live EngineeringCAS route and a fee-waiver request path. It did not state a graduate application-fee amount. The Research M.S. profile retains a blank fee rather than presenting an unsupported amount; matching three-pass provenance records this review.

## Admissions snapshot refresh — Colorado State University Bioengineering cohort

Colorado State’s current Graduate School English Proficiency page was extracted from the live official source. It explicitly accepts Duolingo and lists 120 as the clear-admission minimum. The policy was written to the Bioengineering Ph.D., Bioengineering M.S., and Biomedical Engineering M.Eng. profiles with matching three-pass source records; one rendered program profile will be checked in the next UI validation pass.

After correcting an initially mistyped profile route, the verified `colorado-state-bioengineering-ms` public profile loaded fully. The credited official laboratory hero and admission snapshot were visible, including the new Duolingo card: “Accepted: Duolingo English Test 120 minimum for clear admission when English-proficiency evidence is required; documented exemptions apply.” This confirms the current Graduate School policy renders correctly in the public profile.

## Admissions snapshot refresh — University of South Carolina Biomedical Engineering cohort

Current USC Graduate School international-applicant and application pages were extracted from official sources. They establish Duolingo 120 and the August 1, 2026 reinstatement of the US$50 graduate application fee. The Duolingo treatment was added to all three Biomedical Engineering graduate profiles, and the M.E. fee was backfilled with the stated vendor-fee qualification. A rendered profile will be checked in the next UI validation pass.

The University of South Carolina Biomedical Engineering M.E. public profile loaded in full with the credited Molinaroli College of Engineering and Computing hero. Its admission snapshot visibly displayed the qualified US$50 graduate application fee effective August 1, 2026 and the verified Duolingo card: “Accepted: Duolingo English Test 120 minimum when English-proficiency evidence is required; documented exemption rules apply.” The rendered profile confirms both new official-source facts are visible without claims beyond the reviewed policy.

## Admissions snapshot refresh — University of South Dakota Biomedical Engineering cohort

The USD International Graduate Admissions page was opened in the browser and its Official Proof of English Proficiency panel was expanded. The rendered official requirement lists Duolingo English Test 110 or higher. This current central policy was reconciled with the USD Biomedical Engineering graduate-program page and written to the Ph.D., Biomedical Engineering M.S., and Medical Product Development & Manufacturing M.S. profiles with three-pass provenance; one public profile will be rendered for validation in the next UI check.

The browser session reset after an initial loading-shell capture, so a managed full-page preview was used to complete validation. The University of South Dakota Biomedical Engineering M.S. profile loaded with its credited official hero and visibly showed the Duolingo admission card: “Accepted: Duolingo English Test 110 minimum when English-proficiency evidence is required; published country-based exemptions apply.” This confirms the source-backed policy renders in the public snapshot.
