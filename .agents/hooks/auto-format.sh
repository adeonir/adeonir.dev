#!/usr/bin/env bash
# PostToolUse (Write|Edit|apply_patch) auto-format for src files.
# biome formats JS/TS/CSS/JSON; prettier formats astro/yaml. Never blocks the tool.

payload=$(cat)
repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$repo_root" || exit 0

tool=$(jq -r '.tool_name // empty' <<<"$payload" 2>/dev/null)
files=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' <<<"$payload" 2>/dev/null)

if [[ "$tool" == "apply_patch" && -z "$files" ]]; then
  command=$(jq -r '.tool_input.command // empty' <<<"$payload" 2>/dev/null)
  files=$(printf '%s' "$command" | sed -nE \
    -e 's/^\*\*\* (Update|Add|Delete) File: ?//p' \
    -e 's/^\*\*\* Move to: ?//p')
fi

while IFS= read -r file_path; do
  [ -n "$file_path" ] || continue
  normalized_path="${file_path#./}"

  case "$normalized_path" in
    src/*.astro | */src/*.astro | src/*.yaml | */src/*.yaml | src/*.yml | */src/*.yml)
      pnpm exec prettier --write "$file_path" >/dev/null 2>&1 || true
      ;;
    src/*.js | */src/*.js | src/*.mjs | */src/*.mjs | src/*.cjs | */src/*.cjs | \
      src/*.ts | */src/*.ts | src/*.tsx | */src/*.tsx | src/*.jsx | */src/*.jsx | \
      src/*.json | */src/*.json | src/*.jsonc | */src/*.jsonc | src/*.css | */src/*.css)
      pnpm exec biome check --write "$file_path" >/dev/null 2>&1 || true
      ;;
  esac
done <<<"$files"

exit 0
