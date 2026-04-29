#!/usr/bin/env bash
# Validate every SKILL.md in this repo:
#  - YAML frontmatter present, with name + description
#  - name matches ^[a-z][a-z0-9-]{0,63}$
#  - description ≤ 1024 chars, non-empty, no XML tags
#  - body ≤ 500 lines
#  - body contains "Compliance rules (NEVER VIOLATE)" section
#  - body references shared/DISCLAIMER.md
#  - all internal markdown links resolve to existing files
# Exits non-zero on first failure.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

fail=0
note() { echo "  - $*"; }
err()  { echo "  ✗ $*" >&2; fail=1; }
ok()   { echo "  ✓ $*"; }

echo "== Validating skills =="

skills=$(find skills -type f -name SKILL.md | sort)

if [[ -z "$skills" ]]; then
  echo "No skills found under skills/." >&2
  exit 1
fi

# shellcheck disable=SC2086
python3 - $skills <<'PY'
import os, re, sys, pathlib

skills = [pathlib.Path(p) for p in sys.argv[1:]]
fail = 0

NAME_RE = re.compile(r'^[a-z][a-z0-9-]{0,63}$')
XML_RE  = re.compile(r'<[^>]+>')

for skill in skills:
    rel = skill.as_posix()
    text = skill.read_text(encoding='utf-8')

    # Frontmatter
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.DOTALL)
    if not m:
        print(f"  ✗ {rel}: missing YAML frontmatter")
        fail = 1
        continue
    fm, body = m.group(1), m.group(2)

    # Parse fields (very simple parser; full YAML not needed)
    name_m = re.search(r'^name:\s*(\S.*?)\s*$', fm, re.M)
    desc_m = re.search(r'^description:\s*(.+?)(?=\n[a-zA-Z_]+:|\Z)', fm, re.M | re.S)

    if not name_m:
        print(f"  ✗ {rel}: missing 'name' field")
        fail = 1
        continue
    name = name_m.group(1).strip()
    if not NAME_RE.match(name):
        print(f"  ✗ {rel}: name {name!r} fails ^[a-z][a-z0-9-]{{0,63}}$")
        fail = 1

    if not desc_m:
        print(f"  ✗ {rel}: missing 'description' field")
        fail = 1
        continue
    desc = desc_m.group(1).strip().strip('"').strip("'")
    if not desc:
        print(f"  ✗ {rel}: description is empty")
        fail = 1
    if len(desc) > 1024:
        print(f"  ✗ {rel}: description {len(desc)} chars > 1024 limit")
        fail = 1
    if XML_RE.search(desc):
        print(f"  ✗ {rel}: description contains XML-like tags")
        fail = 1

    # Body line count
    body_lines = body.splitlines()
    if len(body_lines) > 500:
        print(f"  ✗ {rel}: body {len(body_lines)} lines > 500 limit")
        fail = 1

    # Required sections
    if 'Compliance rules (NEVER VIOLATE)' not in body:
        print(f"  ✗ {rel}: missing 'Compliance rules (NEVER VIOLATE)' section")
        fail = 1
    if 'shared/DISCLAIMER.md' not in body:
        print(f"  ✗ {rel}: does not reference shared/DISCLAIMER.md")
        fail = 1

    # Internal link check (relative .md links only)
    for link in re.findall(r'\]\(([^)]+\.md[^)]*)\)', body):
        # strip any anchor
        path_part = link.split('#', 1)[0]
        if path_part.startswith(('http://', 'https://', 'mailto:')):
            continue
        target = (skill.parent / path_part).resolve()
        if not target.exists():
            print(f"  ✗ {rel}: broken link to {link} -> {target}")
            fail = 1

    if fail == 0 or True:
        # print success line per skill for transparency
        print(f"  ✓ {rel}: name={name} desc_len={len(desc)} body_lines={len(body_lines)}")

sys.exit(fail)
PY

rc=$?
if [[ $rc -eq 0 ]]; then
  echo ""
  echo "All skills passed validation."
  exit 0
else
  echo ""
  echo "Validation failed." >&2
  exit $rc
fi
