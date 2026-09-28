---
name: adeonir-dev-portfolio
created: 2026-06-06
updated: 2026-09-28
status: ready
sources: []
---

# PRD: adeonir.dev Personal Portfolio

## 1. Executive Summary

adeonir.dev is Adeonir Kohl's personal portfolio for anyone curious about him, including prospective clients and recruiters. It presents his background and selected work, lets visitors explore projects in depth, and provides a way to get in touch. The intent is to present him through his own account and the work he chooses to show. Success is the owner agreeing the site represents him well.

## 2. Problem Statement

Adeonir's work and background are spread across profiles such as LinkedIn and GitHub, and each shows only a piece. Someone who wants to know him has to connect his career history with the work he builds without a shared narrative. The assumption is that this fragmented view makes it harder to understand how his background relates to his work and, for prospective clients and recruiters, to judge whether he fits what they need.

## 3. Goals & Non-Goals

| Goal | Metric | Target |
| --- | --- | --- |
| Site authentically represents Adeonir | Owner self-assessment | Owner agrees it represents him well |

Separately, lightweight privacy-respecting analytics collect usage statistics (work views, contact submissions, narration plays) for insight only — not goals, not targets, not graded against a KPI.

### Non-Goals

- Not a blog or content platform.
- No backend beyond what contact handling requires.
- Not a generic template — the design quality is part of the message.
- Not a sales site — no explicit hiring pitch.

## 4. User Personas

### Curious Visitor

- **Role:** Anyone who wants to know Adeonir
- **Pain Point:** No single place that shows who he is and what he builds
- **Goal:** Get to know him and his work

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

### Visitor gets to know Adeonir

**Actor:** Curious visitor **Goal:** Get to know Adeonir and his work

**Pre-conditions:**

- Visitor reaches the landing surface

**Main Flow:**

1. Lands on the site → reads who he is
2. Reads the about narrative → learns his background
3. Browses the work → sees what he builds

**Post-conditions:**

- Visitor knows who Adeonir is and what he builds

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
- 2b. Wants the career path → reads the experience timeline → opens the resume → downloads it as a PDF
- 4a. Not ready to contact → leaves with a clear impression

**Post-conditions:**

- Recruiter has formed a judgment and knows how to make contact

### Peer checks credibility

**Actor:** Peer developer **Goal:** Assess craft and taste

**Main Flow:**

1. Lands on the site → reads the about narrative and background
2. Reads how the site was built → gauges technical fit
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
| FR-7 | An about narrative of his background | Carries the differentiation story |
| FR-9 | Lightweight, privacy-respecting usage analytics | Observe work views, contact submissions, and narration plays; no audience targets |
| FR-14 | An experience timeline on the landing that leads into a full resume, downloadable as PDF | Lets recruiters read the career path and keep the resume |

### Could Have

| ID | Requirement | Notes |
| --- | --- | --- |
| FR-10 | Previous / next navigation between projects | Keeps visitors moving through the work |
| FR-13 | An illustrated character of Adeonir appears across the site, in a pose matched to the moment | Reinforces the personal, casual register |
| FR-15 | An about-this-site surface describing how the site was built | Supports peer credibility |
| FR-16 | On-demand audio narration of the hero, about, and expertise sections, in both languages; each section plays independently | Reinforces the AI and design positioning |

### Won't Have

| ID | Requirement | Reason for exclusion |
| --- | --- | --- |
| FR-N1 | Blog or CMS | Out of scope for launch; deferred candidate for a future phase, not a permanent exclusion |
| FR-N2 | Authentication / user accounts | No logged-in experience |
| FR-N3 | E-commerce or payments | Not a transactional product |
| FR-N4 | A tools / stack overview | A fixed stack list reads as a recipe and understates the actual range; tools are already named in the about prose |

## 7. Business Rules

| ID | Rule | Scope |
| --- | --- | --- |
| BR-1 | The primary action across the landing is to view the work; contact is secondary | Landing, navigation |
| BR-2 | Every project shown carries a summary in place; a project with a case study routes to its detail surface, a project with only a live site links out to it, and a project with neither is listed as offline | Work index, curated selection |
| BR-3 | Contact must offer at least one direct channel in addition to the form | Contact surface |
| BR-4 | The end-of-page character follows the time of day: coffee between 9:00 and 18:00, beer outside that window | End of page |
| BR-5 | Narration plays only when the visitor starts it; starting one section pauses any other that is playing | Hero, about, expertise |
| BR-6 | Narration reads the section's visible text as written, without its labels: the eyebrow, the availability seal, and the action labels are not read | Hero, about, expertise |

## 8. Edge Cases

| ID | Scenario | Expected Behavior |
| --- | --- | --- |
| EC-1 | No projects available yet | Show a meaningful empty state rather than a blank index |
| EC-2 | Contact form submission fails | Show an error and surface a direct fallback channel |
| EC-3 | A project detail is requested for a project that does not exist | Show a not-found state with a path back to the work index |
| EC-4 | A section's narration audio fails to load | Show an error message; the section's text stays on the page |

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

Adeonir owns content authoring, design, and delivery end-to-end. No outside dependency blocks delivery; the services the site uses are recorded in the Design Doc.

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
