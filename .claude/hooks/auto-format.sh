#!/usr/bin/env bash
# PostToolUse (Write|Edit) auto-format for src files.
# biome formats JS/TS/CSS/JSON; prettier formats astro/yaml. Never blocks the tool.

f=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
[ -n "$f" ] || exit 0

case "$f" in
  */src/*.astro | */src/*.yaml | */src/*.yml)
    pnpm exec prettier --write "$f" >/dev/null 2>&1
    ;;
  */src/*.js | */src/*.mjs | */src/*.cjs | */src/*.ts | */src/*.tsx | */src/*.jsx | */src/*.json | */src/*.jsonc | */src/*.css)
    pnpm exec biome check --write "$f" >/dev/null 2>&1
    ;;
esac

exit 0
