---
name: adeonir-dev-portfolio
created: 2026-06-06
updated: 2026-06-06
status: draft
sources: []
---

# PRD: adeonir.dev Personal Portfolio

## 1. Problem Statement

Adeonir Kohl — frontend developer with 6+ years building web interfaces
(primarily React and TypeScript), with a prior career in graphic design — has no
personal web presence that represents him professionally. Without a portfolio,
three audiences have no single place to evaluate him: prospective clients have no
path to engage him, recruiters cannot see his work, and peers cannot gauge his
credibility. The evidence is direct: no site exists today — this is a founding
need, not a fix. The cost of not solving it is missed client and recruiter
opportunities and weaker positioning as he moves toward product engineering.

## 2. Goals & Success Metrics

The owner's goal is qualitative: the site should represent him well. That is the
only success metric.

| Goal | Metric | Target |
|------|--------|--------|
| Site authentically represents Adeonir | Owner self-assessment | Owner agrees it represents him well |

Separately, lightweight privacy-respecting analytics collect usage statistics
(work views, contact submissions) for insight only — not goals, not targets, not
graded against a KPI.

## 3. User Personas

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

## 4. Scope Definition

### Must Have

| ID | Requirement | Notes |
|----|------------|-------|
| FR-1 | A landing surface that establishes identity and positioning (who he is, proof, differentiation) | First impression for all three personas |
| FR-2 | A curated selection of work on the landing that leads into the full index | Primary action is to view work |
| FR-3 | A full work index listing every project | Browsable entry to project detail |
| FR-4 | A per-project detail / case study surface | Where work is evaluated in depth |
| FR-5 | A contact path with a form and at least one direct channel | Secondary action across the site |
| FR-6 | Persistent navigation across all surfaces | Consistent way to move and reach contact |

### Should Have

| ID | Requirement | Notes |
|----|------------|-------|
| FR-7 | An about narrative (graphic design → frontend → product engineering) | Carries the differentiation story |
| FR-8 | A tools / stack overview | Supports peer credibility |
| FR-9 | Lightweight, privacy-respecting usage analytics | Observe work views and contact submissions; no audience targets |

### Could Have

| ID | Requirement | Notes |
|----|------------|-------|
| FR-10 | Previous / next navigation between projects | Keeps visitors moving through the work |
| FR-11 | Light / dark presentation | Owner preference; not launch-blocking |
| FR-12 | Portuguese / English bilingual presentation | Launch in Portuguese first; English added in a later phase, visitor switches via a language control |

### Won't Have

| ID | Requirement | Notes |
|----|------------|-------|
| FR-N1 | Blog or CMS | Out of scope for launch; deferred candidate for a future phase, not a permanent exclusion |
| FR-N2 | Authentication / user accounts | No logged-in experience |
| FR-N3 | E-commerce or payments | Not a transactional product |

### Non-Goals

- Not a blog or content platform.
- No backend beyond what contact handling requires.
- Not a generic template — the design quality is part of the message.

## 5. User Journeys

### Client looks to hire

**Actor:** Prospective client
**Goal:** Start a conversation

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

**Actor:** Recruiter
**Goal:** Decide whether to reach out

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

**Actor:** Peer developer
**Goal:** Assess craft and taste

**Main Flow:**

1. Lands on the site → reads the about narrative and background
2. Reviews the tools / stack → gauges technical fit
3. Browses the work → forms a professional opinion

**Post-conditions:**

- Peer has a credible reference point for Adeonir

## 6. Business Rules

| ID | Rule | Scope |
|----|------|-------|
| BR-1 | The primary action across the landing is to view the work; contact is secondary | Landing, navigation |
| BR-2 | Every project shown — curated or indexed — routes to a project detail surface | Work index, curated selection |
| BR-3 | Contact must offer at least one direct channel in addition to the form | Contact surface |

## 7. Edge Cases

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-1 | No projects available yet | Show a meaningful empty state rather than a blank index |
| EC-2 | Contact form submission fails | Show an error and surface a direct fallback channel |
| EC-3 | A project detail is requested for a project that does not exist | Show a not-found state with a path back to the work index |

## 8. Non-Functional Requirements

| ID | Requirement | Target |
|----|------------|--------|
| NFR-1 | Performance — the differentiator must be evident | Fast load on mobile and desktop (concrete budget TBD in design) |
| NFR-2 | Accessibility | WCAG 2.1 AA |
| NFR-3 | Responsiveness | Usable from small mobile to large desktop |
| NFR-4 | Shareability | Correct title, description, and preview metadata for links, localized per language with hreflang annotations |

## 9. Milestones

| Milestone | Deliverables |
|-----------|-------------|
| M1 — Landing | Identity, positioning, curated work, contact path, persistent navigation |
| M2 — Work | Full work index and per-project detail surfaces |
| M3 — Enhancements | Previous / next navigation, light/dark presentation, English locale, polish |

## 10. Assumptions

- Adeonir authors and maintains the project content himself.
- Project, bio, and tool content is authored separately (copy phase), not in this PRD.
- The site launches in Portuguese; English is a later phase. Copy and case studies are authored in Portuguese first, then translated when English ships.
- Contact volume is low enough that a simple form plus a direct channel suffices.

## 11. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Success is qualitative and self-assessed | Medium | High | Accept as owner judgment; lightweight analytics observe usage for insight |
| Positioning leans on craft, a common claim | Medium | Medium | Decided: craft leads, 6 years anchors credibility; prove the craft through the work and the site, not assertions |
| "Designer's eye" is a common claim | Medium | High | Prove it through the work and the site itself, not assertions |

## 12. Hypotheses to Validate

- [ ] A design-quality differentiator resonates with recruiters and clients more than a seniority claim.
- [ ] A work-first landing converts better than a hire-first landing for these personas.

## 13. Unknowns

No open product unknowns. Implementation choices (analytics tool, performance budget) are deferred to the design phase.

Resolved:

- Positioning emphasis — craft leads, 6 years anchors credibility (shorthand: "design + code").
- Projects at launch — 4 ready; home curates a subset, the work index lists all four. Empty state (EC-1) is defensive only, not a launch concern.
- Analytics — confirmed (FR-9); privacy-respecting, no audience targets. Tool choice deferred to design.
- Internationalization — bilingual PT/EN is a Could Have (FR-12); launch is Portuguese-first, English in a later phase. Default locale and routing strategy decided in design.

## 14. References

- None
