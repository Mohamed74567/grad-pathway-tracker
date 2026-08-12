# Reference Workflow Observations

## Initial directory view

The reference starts as a dense, task-oriented workspace rather than a marketing dashboard. Its persistent sidebar makes the primary workflow visible at all times: degree-specific program lists, calendar, dashboard, tasks, comparison, pipeline, timeline, strategy, and interview notes.

The active program directory uses a narrow page title and a single practical control row: add program, search, deadline sort, and a filter drawer. Its information-dense table establishes a useful scan order: institution and direct visit link, deadline and relative time, fee, standardized/English tests, funding, priority, rating, document completion, pipeline status, result, and row actions. The user specifically values this compact, operational organization.

## Transferable patterns, not visual copying

GradPathway should retain its own violet/teal editorial visual system while adopting the reference’s workflow clarity: separate operational sections, a more compact and predictable primary table, direct links at row level, and high-signal admissions cues placed before descriptive prose. Program details should surface admission requirements as a short fact sheet—acceptance rate only when sourced, GRE treatment, Duolingo/English-test treatment, fee, deadline, funding, and official application link—with deeper verified content behind an optional section.

## Degree-specific workspace

The reference provides fully separate PhD and master’s workspaces instead of using one mixed list with a transient toggle. They share the same column order and controls, so the user can move between degrees without relearning the interface. The master’s view also demonstrates why tests need concise, comparable labels: GRE status first, followed by an English-test summary when supported by source evidence.

## Calendar view

The calendar is intentionally simple: month navigation, a `Today` action, a legend that differentiates PhD and master’s deadlines, clickable due-date cells, and a side panel for the next 90 days. This supports planning without repeating the entire directory. GradPathway should preserve its date-urgency colors but simplify the calendar toward a monthly overview plus a selected-day / near-term deadline queue.

## Dashboard view

The reference dashboard behaves like a control panel rather than a landing page. It leads with compact, clickable status counts; follows with application progress, deadlines by month, an upcoming-deadline list, priority distribution, funding mix, and document completion. The important transferable principle is drill-down: every aggregate should lead to the relevant filtered list rather than be merely decorative.

## Task view

The task view is deliberately focused on actionable preparation work. It separates tasks into a small fixed set of application-relevant categories: SOP writing, LOR requests, test preparation, application submission, interview preparation, and other. For GradPathway, the existing per-application `nextAction` field can power an initial simple action queue without inventing unrelated productivity features. A full task system is not part of this immediate redesign unless it is needed to make the queue usable.

## Comparison and pipeline views

The comparison view limits selection to five programs and starts with a direct empty-state path back to degree directories. Its pattern is valuable but can be deferred; the immediate need is to make admission facts comparable within the primary directory table.

The pipeline view groups applications by the familiar status sequence and presents each card with university, program, degree, priority, and deadline. The concept maps well to GradPathway’s existing status model, but the reference’s view becomes unwieldy when all 195 programs are in one column. In the redesign, the existing tracker should stay an efficient table first; any status-board view should only show saved applications, never the entire verified directory.

## Timeline view

The timeline unifies deadlines, tasks, and interviews in chronological order with lightweight type filters. It is useful as a mental model, but becomes noisy when it includes every catalog deadline rather than only the user’s saved applications. GradPathway’s calendar and tracker should therefore prioritize the user’s applications and their dated deadlines; the full directory remains a research surface rather than a personal timeline.

## Strategy and notes views

The strategy view’s strongest idea is not the standalone page but the actionable filter prompts: show programs that accept Duolingo, programs that do not require the GRE, and combinations of those conditions. These are appropriate as visible, source-aware quick filters in GradPathway’s directory, provided that an unknown policy remains blank rather than being treated as acceptance.

The interview-and-notes view confirms the value of keeping personal follow-up separate from verified program facts. GradPathway already has private notes and contact/reminder data at the application level; the redesign should make those controls easier to reach from a saved-program row rather than multiplying top-level sections.

## Selective adoption decision

Adopt: compact degree-specific program lists, a consistent admissions scan order, direct official links, reliable deadline planning, document/progress cues, a personal action queue, source-aware GRE and English-test filters, and dashboard drill-downs.

Do not adopt as standalone surfaces: a catalog-wide drag-and-drop pipeline, a catalog-wide timeline, a generic comparison page before core data is streamlined, or a broad strategy dashboard. These either duplicate existing workflows or become overwhelming at 200+ programs. Instead, GradPathway will center the user’s saved applications, preserve public research access to the verified directory, and place deeper information behind progressive disclosure.

## Program detail interaction

The reference’s program modal confirms the requested admission-first fact-sheet pattern. Its most useful information is the small overview grid: deadline, application fee, GRE treatment, Duolingo treatment, TOEFL minimum, funding, and intake. Personal checklist and notes follow below rather than competing with the admission snapshot.

GradPathway will improve on this approach by keeping its dedicated, source-credited profile page and campus image, but moving a verified `Admission snapshot` to the top. Each populated fact will carry a concise source affordance; unknown values will remain blank rather than creating a misleading “not accepted” inference. Details such as curriculum, research areas, and full requirements will be collapsed under `Explore verified program context` so they remain available without dominating everyday decisions.

## Redesign validation

The redesigned George Washington University public profile was checked after its data request completed. The hero image is visible, the admission snapshot precedes deeper research content, official program and application links remain direct, and the fuller curriculum, research, and requirements context is available through progressive disclosure. The snapshot currently omits unverified fields rather than rendering speculative values.

During the Duke image rollout, the uploaded Duke Today photograph was confirmed to resolve from the public storage path, and its database fields contain the expected path and credit. The corresponding profile initially rendered the fallback gradient while the Boston University profile displayed its newly uploaded image. Browser inspection confirmed that the Duke hero receives the correct CSS background URL and the image finishes loading at 1125 × 750 pixels, so the blank capture is a visual-capture timing artifact rather than a broken hero or storage link.
