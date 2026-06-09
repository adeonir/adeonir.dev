#!/usr/bin/env bash
# PreToolUse (Read|Write|Edit) — blocks access to secrets and lockfile.
# Secrets (.env*, .dev.vars): block all access (read leaks keys into context).
# Lockfile (pnpm-lock.yaml): block writes only — reads are fine.

tool=$(jq -r '.tool_name // empty' 2>/dev/null)
f=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -n "$f" ] || exit 0

name=$(basename "$f")

case "$name" in
  .env | .env.* | .dev.vars)
    echo "Blocked: '$name' is a secrets file — edit outside Claude." >&2
    exit 2
    ;;
  pnpm-lock.yaml)
    if [[ "$tool" == "Write" || "$tool" == "Edit" ]]; then
      echo "Blocked: 'pnpm-lock.yaml' must only change via 'pnpm install'." >&2
      exit 2
    fi
    ;;
esac

exit 0
