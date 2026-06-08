## Regular Commit Format

**Impact: MEDIUM**

Every regular commit subject is `type: imperative description`, lowercase, under 72 characters, with no scope, no file names, no versions, and no attribution lines. The body is omitted by default; when present, it uses bullets that capture the reason or trade-off behind the change — never a restatement of what the diff already shows. Subject style is inferred from the staged diff, not from chat or task context.

**Incorrect:**

```bash
git commit -m "feat(auth): Added user authentication to src/auth.ts and updated lodash to 4.17.21

This commit adds authentication.

Co-Authored-By: AI Assistant"
```

**Correct:**

```bash
git commit -m "feat: add user authentication flow

- support email/password login
- add session management
- include remember me option"
```

## PR Merge Method

**Impact: MEDIUM**

Pull requests merge with `gh pr merge {N} --merge`, which preserves the branch's commit history and adds a merge commit. The project follows a spec-driven workflow where each story is one commit boundary, and the merge commit marks the PR boundary in the log — squash collapses that history and rebase erases the PR seam. Choose `--squash` or `--rebase` only when the branch contains WIP noise that should not enter `main` and call out the deviation explicitly.

**Incorrect:**

```bash
gh pr merge 25 --squash
gh pr merge 25 --rebase
```

**Correct:**

```bash
gh pr merge 25 --merge --subject "chore: setup lint, format, and pre-commit toolchain (#25)"
```

## Merge Commit Format

**Impact: MEDIUM**

Merge commit subjects follow `{type}: {description} (#{pr-number})` — never the default `Merge pull request #N from {branch}` that GitHub produces, which strips the conventional type and the human description. The merge commit body carries 1-3 contextual bullets that capture the why behind the merge — motivation, scope notes, trade-off rationale — never a restatement of the subject and never a re-listing of what the branch commits already show. Bullets start with a lowercase verb, matching the regular commit body convention. Use an explicit empty body (`--body ""`) only when the subject alone fully captures the change (trivial single-purpose PR with no meaningful context to add). **Gotcha:** omitting `--body` on `gh pr merge --merge` does not produce an empty body — GitHub falls back to using the subject as the body, silently duplicating it. Always pass `--body` explicitly.

**Incorrect:**

```bash
gh pr merge 25 --merge --subject "Merge pull request #25 from feature/setup-lint-and-format"

gh pr merge 25 --merge \
  --subject "chore: setup lint, format, and pre-commit toolchain (#25)" \
  --body "chore: setup lint, format, and pre-commit toolchain"

gh pr merge 25 --merge --subject "chore: setup lint, format, and pre-commit toolchain (#25)"
```

**Correct:**

```bash
gh pr merge 24 --merge \
  --subject "chore: integrate react runtime and tailwind css styling (#24)" \
  --body "- wire react hydration via astro integration
- add tailwind utility layer via vite plugin
- add class-merge helper for deterministic class composition"

gh pr merge 25 --merge \
  --subject "chore: setup lint, format, and pre-commit toolchain (#25)" \
  --body ""
```
