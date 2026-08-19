#!/usr/bin/env bash
# PreToolUse (Read|Write|Edit|Bash|apply_patch) — blocks access to secrets and lockfile.
# Secrets (.env*, .dev.vars): block all access (read leaks keys into context).
# Lockfile (pnpm-lock.yaml): block writes only — reads are fine.

payload=$(cat)
tool=$(jq -r '.tool_name // empty' <<<"$payload" 2>/dev/null)
file_path=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' <<<"$payload" 2>/dev/null)
command=$(jq -r '.tool_input.command // empty' <<<"$payload" 2>/dev/null)

check_path() {
  local path="$1"
  local name

  [ -n "$path" ] || return 0
  name=$(basename -- "$path")

  case "$name" in
    .env | .env.* | .dev.vars)
      echo "Blocked: '$name' is a secrets file — edit or read it outside the agent." >&2
      exit 2
      ;;
    pnpm-lock.yaml)
      if [[ "$tool" == "Write" || "$tool" == "Edit" || "$tool" == "apply_patch" ]]; then
        echo "Blocked: 'pnpm-lock.yaml' must only change via 'pnpm install'." >&2
        exit 2
      fi
      ;;
  esac
}

check_path "$file_path"

if [[ "$tool" == "apply_patch" ]]; then
  patch_files=$(printf '%s' "$command" | sed -nE \
    -e 's/^\*\*\* (Update|Add|Delete) File: ?//p' \
    -e 's/^\*\*\* Move to: ?//p')

  while IFS= read -r path; do
    check_path "$path"
  done <<<"$patch_files"
fi

if [[ "$tool" == "Bash" ]]; then
  case "$command" in
    *.env* | *.dev.vars*)
      echo "Blocked: the command references a secrets file — edit or read it outside the agent." >&2
      exit 2
      ;;
  esac
fi

exit 0
