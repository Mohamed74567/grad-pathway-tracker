# GradPathway Workflow Redesign Blueprint

## Design objective

GradPathway will operate as a **graduate-admission command center**, not as a generic directory or a collection of dashboards. The user’s frequent decisions should take one glance: which programs fit the current degree goal, what the next deadline requires, whether GRE or an English test is needed, what the application costs, whether funding is indicated, and what personal step must happen next.

The product will retain its distinctive violet, teal, and editorial visual language. It will not reproduce the reference application’s dark styling, page structure, or every feature. The verified program directory remains public and research-oriented; the application workspace remains personal and protected.

## Primary navigation

| Destination | Purpose | Key content |
|---|---|---|
| **Today** | The personal start screen | Saved-application count, time-sensitive deadlines, document progress, and a focused next-action queue. |
| **Program Explorer** | Source-transparent research | Separate PhD and master’s workspaces, search, quick admission filters, compact rows, and direct official links. |
| **My Applications** | Personal command center | Saved programs only, checklist progress, priority, next action, application status, and result plan. |
| **Deadlines** | Dated planning | Monthly calendar, degree legend, selected-day list, and near-term saved-application queue. |

No standalone catalog-wide pipeline, generic comparison workspace, or catalog-wide timeline will be added in this implementation. These views become noisy with hundreds of records and do not answer the user’s immediate application questions better than a strong table and action queue.

## Admission snapshot

Every program detail page begins with a concise `Admission snapshot` rather than narrative content. The snapshot uses one compact grid in this order:

| Admission fact | Display rule |
|---|---|
| **Deadline** | Show an active dated deadline where available; otherwise retain labeled annual guidance with its official source link. |
| **Application fee** | Show only when the verified record includes it. Do not infer a fee from a school-wide default. |
| **GRE** | Show `Required`, `Optional`, `Not required`, or blank only when tied to a source-backed fact. |
| **Duolingo / English test** | Show the supported test policy and qualifying score only when verified. Do not label an unknown policy as non-acceptance. |
| **Funding** | Preserve qualified language such as `Funding available` or `Departmental review`; do not promise support. |
| **Acceptance rate** | Show only where an attributable source label and link exist. |
| **Official application** | Always expose the direct official program/admissions link. |

Program description, research areas, curriculum details, and complete requirements remain available in a collapsed `Verified program context` section. This retains the project’s research depth but removes it from the everyday scanning path.

## Directory and filter strategy

The degree tab becomes the primary scope control. Search and three high-value filters are always visible: **deadline**, **GRE policy**, and **Duolingo/English-test availability**. Additional filters—state, subfield, funding, acceptance-rate range, and ranking context—move into a disclosure-based `More filters` area.

Desktop results use a compact list rather than a card grid. Each row displays university and degree, next verified deadline, admissions signals, funding cue, a direct official link, and one personal action. Mobile retains readable cards, but uses the same information order. This solves the density problem without losing the current responsive behavior.

## Original GradPathway features

| Feature | Benefit | Data boundary |
|---|---|---|
| **Admission readiness strip** | Summarizes the user’s highest-priority evidence needs: deadlines, missing documents, and pending next actions. | Reads saved applications and verified program deadlines only. |
| **Source-aware quick filters** | Lets users isolate verified `GRE not required` or `Duolingo accepted` programs without treating unknown data as a negative. | Uses only source-backed admission facts. |
| **Next-action queue** | Surfaces private next actions entered on saved applications in deadline-aware order. | Personal user data; never changes directory facts. |
| **Evidence labels** | Displays official/attributed links beside decision-critical facts. | Per-field provenance remains visible and inspectable. |

## Implementation sequence

The rebuild will first introduce the minimal admission-fields data model and public filter contract, then reshape Program Explorer, program details, the personal overview, and the deadline screen. The existing tracker’s planning fields and tests will be retained; tests will expand to cover evidence-aware test filters and the admission snapshot’s no-inference rules.
