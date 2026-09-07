---
name: adeonir-dev-portfolio
created: 2026-06-06
updated: 2026-09-06
status: ready
sources: []
---

# PRD: adeonir.dev Personal Portfolio

## 1. Executive Summary

adeonir.dev gives Adeonir Kohl — a frontend developer with 6+ years building web interfaces, moving toward product engineering — a personal portfolio that lets prospective clients, recruiters, and peers evaluate his work and reach him. The must-have scope covers a landing surface, a curated and a full work index, per-project detail pages, a contact path, and persistent navigation. Success is qualitative: the owner agreeing the site represents him well.

## 2. Problem Statement

Adeonir Kohl — frontend developer with 6+ years building web interfaces (primarily React and TypeScript), with a prior career in graphic design — has no personal web presence that represents him professionally. Without a portfolio, three audiences have no single place to evaluate him: prospective clients have no path to engage him, recruiters cannot see his work, and peers cannot gauge his credibility. The evidence is direct: no site exists today — this is a founding need, not a fix. The cost of not solving it is missed client and recruiter opportunities and weaker positioning as he moves toward product engineering.

## 3. Goals & Non-Goals

| Goal | Metric | Target |
| --- | --- | --- |
| Site authentically represents Adeonir | Owner self-assessment | Owner agrees it represents him well |

Separately, lightweight privacy-respecting analytics collect usage statistics (work views, contact submissions) for insight only — not goals, not targets, not graded against a KPI.

### Non-Goals

- Not a blog or content platform.
- No backend beyond what contact handling requires.
- Not a generic template — the design quality is part of the message.

## 4. User Personas

### Prospective Client

- **Role:** Founder or team needing interface work
- **Pain Point:** Hard to find a developer who handles both aesthetics and performance
- **Goal:** Confirm fit and start a conversation

### Recruiter

- **Role:** Technical recruiter or hiring manager
- **Pain Point:** Cannot quickly judge whether a candidate's work fits the role
- **Goal:** Scan the work and decide whether to reach out

### Peer Developer

- **Role:** Fellow developer / designer
- **Pain Point:** No reference point for the person's credibility or taste
- **Goal:** Assess craft, background, and tools to form a professional opinion

## 5. User Journeys

### Client looks to hire

**Actor:** Prospective client **Goal:** Start a conversation

**Pre-conditions:**

- Client reaches the landing surface

**Main Flow:**

1. Lands on the site → reads positioning and differentiation
2. Scans the curated work → confirms fit (aesthetics + performance)
3. Moves to contact → submits the contact form → receives confirmation

**Alternative Flows:**

- 3a. Prefers a direct channel → uses the listed social / direct contact

**Post-conditions:**

- A contact request reaches Adeonir, or the client has his direct channel

### Recruiter evaluates the work

**Actor:** Recruiter **Goal:** Decide whether to reach out

**Pre-conditions:**

- Recruiter arrives at the landing surface (direct link or search)

**Main Flow:**

1. Lands on the site → sees identity, proof, and positioning
2. Scans the curated work → finds a relevant project
3. Opens a project detail → reviews the case study
4. Decides to engage → follows the contact path

**Alternative Flows:**

- 2a. Wants the full set → follows the curated selection into the work index
- 4a. Not ready to contact → leaves with a clear impression

**Post-conditions:**

- Recruiter has formed a judgment and knows how to make contact

### Peer checks credibility

**Actor:** Peer developer **Goal:** Assess craft and taste

**Main Flow:**

1. Lands on the site → reads the about narrative and background
2. Reviews the tools / stack → gauges technical fit
3. Browses the work → forms a professional opinion

**Post-conditions:**

- Peer has a credible reference point for Adeonir

## 6. Scope

### Must Have

| ID | Requirement | Notes |
| --- | --- | --- |
| FR-1 | A landing surface that establishes identity and positioning (who he is, proof, differentiation) | First impression for all three personas |
| FR-2 | A curated selection of work on the landing that leads into the full index | Primary action is to view work |
| FR-3 | A full work index listing every project | Browsable entry to project detail |
| FR-4 | A per-project detail / case study surface | Where work is evaluated in depth |
| FR-5 | A contact path with a form and at least one direct channel | Secondary action across the site |
| FR-6 | Persistent navigation across all surfaces | Consistent way to move and reach contact |
| FR-11 | Light / dark presentation | Owner preference, shipped as the default skin plus its counterpart |
| FR-12 | Portuguese / English bilingual presentation | Default Portuguese; visitor switches to English via a language control |

### Should Have

| ID | Requirement | Notes |
| --- | --- | --- |
| FR-7 | An about narrative (graphic design → frontend → product engineering) | Carries the differentiation story |
| FR-8 | A tools / stack overview | Supports peer credibility |
| FR-9 | Lightweight, privacy-respecting usage analytics | Observe work views and contact submissions; no audience targets |

### Could Have

| ID | Requirement | Notes |
| --- | --- | --- |
| FR-10 | Previous / next navigation between projects | Keeps visitors moving through the work |

### Won't Have

| ID | Requirement | Reason for exclusion |
| --- | --- | --- |
| FR-N1 | Blog or CMS | Out of scope for launch; deferred candidate for a future phase, not a permanent exclusion |
| FR-N2 | Authentication / user accounts | No logged-in experience |
| FR-N3 | E-commerce or payments | Not a transactional product |

## 7. Business Rules

| ID | Rule | Scope |
| --- | --- | --- |
| BR-1 | The primary action across the landing is to view the work; contact is secondary | Landing, navigation |
| BR-2 | Every project shown — curated or indexed — routes to a project detail surface | Work index, curated selection |
| BR-3 | Contact must offer at least one direct channel in addition to the form | Contact surface |

## 8. Edge Cases

| ID | Scenario | Expected Behavior |
| --- | --- | --- |
| EC-1 | No projects available yet | Show a meaningful empty state rather than a blank index |
| EC-2 | Contact form submission fails | Show an error and surface a direct fallback channel |
| EC-3 | A project detail is requested for a project that does not exist | Show a not-found state with a path back to the work index |

## 9. Non-Functional Requirements

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-1 | Performance — the differentiator must be evident | Fast load on mobile and desktop (concrete budget TBD in design) |
| NFR-2 | Accessibility | WCAG AA |
| NFR-3 | Responsiveness | Usable from small mobile to large desktop |
| NFR-4 | Shareability | Correct title, description, and preview metadata for links, localized per language with hreflang annotations |

## 10. Definition of Done

| Criterion | How verified |
| --- | --- |
| Every Must Have requirement (FR-1 to FR-6, FR-11, FR-12) is implemented and live | Manual verification against the requirement |
| Owner reviews the site end-to-end and agrees it represents him well | Owner self-assessment (primary success metric) |
| NFRs (performance, accessibility, responsiveness, shareability) hold across every shipped surface | Lighthouse audit and manual check |

## 11. External Dependencies

None identified — Adeonir owns content authoring, design, and delivery end-to-end.

## 12. Risks

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Success is qualitative and self-assessed | Medium | High | Accept as owner judgment; lightweight analytics observe usage for insight |
| Positioning leans on craft, a common claim | Medium | Medium | Decided: craft leads, 6 years anchors credibility; prove the craft through the work and the site, not assertions |
| "Designer's eye" is a common claim | Medium | High | Prove it through the work and the site itself, not assertions |

## 13. Open Questions & Assumptions

### Assumptions

- Adeonir authors and maintains the project content himself.
- Project, bio, and tool content is authored separately (copy phase), not in this PRD.
- Portuguese is the default locale; copy and case studies are authored in Portuguese first, then translated to English.
- Contact volume is low enough that a simple form plus a direct channel suffices.

### Open Questions

- [ ] A design-quality differentiator resonates with recruiters and clients more than a seniority claim.
- [ ] A work-first landing converts better than a hire-first landing for these personas.

## 14. References

- **PRODUCT:** [docs/product/PRODUCT.md](./PRODUCT.md)
- **PRD:** This document
- **Design Doc:** [docs/tech/design-doc.md](../tech/design-doc.md)
- **Research:** None
- **ADRs:** [docs/adr/](../adr/)
- Figma — [adeonir.dev](https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir) (Website page)
  - [Home — Desktop](https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir?node-id=2500-93)
  - [Home — Mobile](https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir?node-id=2530-2)
