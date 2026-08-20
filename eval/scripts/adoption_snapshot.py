#!/usr/bin/env python3
"""Collect the weekly adoption numbers and append them to the log.

Runs from GitHub Actions, not from a Claude cloud routine: the routine's
sandbox blocks api.npmjs.org outright and its GitHub App token cannot be
granted the Administration:read that the traffic endpoints require.

Writes two files. eval/adoption-data.json is the source of truth and the
thing deltas are computed from; eval/adoption-log.md is rendered from it
for humans. Never parse the markdown to find last week's numbers.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import date, timedelta

PKG = "@haruspex-guru/mcp-server"
SIBLINGS = ["@haruspex-guru/mcp-server-gemini", "@haruspex-guru/react"]
REPO = "Haruspex-guru/haruspex-skills"
ROOT = os.path.join(os.path.dirname(__file__), "..")
DATA = os.path.join(ROOT, "adoption-data.json")
LOG = os.path.join(ROOT, "adoption-log.md")

UNAVAILABLE = "unavailable"


def get_json(url, token=None):
    req = urllib.request.Request(url, headers={"User-Agent": "haruspex-adoption-snapshot"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
        req.add_header("Accept", "application/vnd.github+json")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def npm_downloads(pkg, start, end):
    """Total downloads over an inclusive day range."""
    url = f"https://api.npmjs.org/downloads/range/{start}:{end}/{pkg}"
    return sum(d["downloads"] for d in get_json(url)["downloads"])


def npm_day(pkg, day):
    url = f"https://api.npmjs.org/downloads/range/{day}:{day}/{pkg}"
    return get_json(url)["downloads"][0]["downloads"]


def traffic(kind, token):
    """Clones or views over the last 14 days.

    Needs a token with Administration:read. The Actions GITHUB_TOKEN may
    carry it depending on workflow permissions; ADOPTION_PAT is the
    fallback. Returns (None, None) rather than raising so one missing
    metric never costs us the whole snapshot.
    """
    try:
        d = get_json(f"https://api.github.com/repos/{REPO}/traffic/{kind}", token)
        return d["count"], d["uniques"]
    except urllib.error.HTTPError as e:
        # 403 here almost always means the token lacks Administration:read.
        print(f"  traffic/{kind}: HTTP {e.code} — {e.reason}", file=sys.stderr)
        return None, None
    except Exception as e:
        print(f"  traffic/{kind}: {e}", file=sys.stderr)
        return None, None


def fmt(v):
    return UNAVAILABLE if v is None else str(v)


def delta(now, prev):
    if now is None or prev is None:
        return "—"
    d = now - prev
    if d == 0:
        return "0"
    return f"+{d}" if d > 0 else f"−{abs(d)}"


def render(snap, prev):
    """Render one snapshot as a markdown section."""
    pd = prev["date"] if prev else None
    head = f"| Signal | Value | Delta vs {pd} | Window |" if prev else "| Signal | Value | Window |"
    sep = "| --- | --- | --- | --- |" if prev else "| --- | --- | --- |"

    def row(label, value, key, window, uniq_key=None):
        if not prev:
            return f"| {label} | {value} | {window} |"
        d = delta(snap.get(key), prev.get(key))
        if uniq_key:
            du = delta(snap.get(uniq_key), prev.get(uniq_key))
            if du != "—":
                d = f"{d} ({du} unique)"
        return f"| {label} | {value} | {d} | {window} |"

    clones = f"{fmt(snap['clones'])} ({fmt(snap['clones_unique'])} unique)"
    views = f"{fmt(snap['views'])} ({fmt(snap['views_unique'])} unique)"

    lines = [
        f"### {snap['date']}",
        "",
        head,
        sep,
        row(f"npm downloads, `{PKG}`", f"**{fmt(snap['npm_week'])}**", "npm_week", snap["npm_week_window"]),
        row("npm downloads, last day", fmt(snap["npm_day"]), "npm_day", snap["npm_week_window"].split("→")[1].strip()),
        row("GitHub clones", clones, "clones", "last 14 days", "clones_unique"),
        row("GitHub views", views, "views", "last 14 days", "views_unique"),
        row("Stars / forks / subscribers", f"{fmt(snap['stars'])} / {fmt(snap['forks'])} / {fmt(snap['subscribers'])}", "stars", "cumulative"),
        row("Open issues", fmt(snap["open_issues"]), "open_issues", "cumulative"),
        "",
    ]

    sib = snap.get("siblings") or {}
    if sib:
        parts = ", ".join(f"`{k}` {fmt(v)} weekly" for k, v in sib.items())
        lines += [f"Sibling packages, for context (same MCP backend, not proxies for", f"this repo): {parts}.", ""]

    missing = [k for k in ("npm_week", "clones", "views") if snap.get(k) is None]
    if missing:
        lines += [
            f"Collection gaps this run: {', '.join(missing)}. See the workflow log",
            "for the failing call — an empty cell here means the fetch failed, not",
            "that the number was zero.",
            "",
        ]

    lines += [
        f"Notes — collected automatically by `.github/workflows/adoption-snapshot.yml`.",
        "Weekly npm counts on a base this small swing widely; read a run of",
        "several weeks, not a single delta.",
        "",
    ]
    return "\n".join(lines)


def main():
    token = os.environ.get("ADOPTION_PAT") or os.environ.get("GITHUB_TOKEN")
    today = date.today()
    # Window ends the day before the snapshot, matching the manual entries.
    end = today - timedelta(days=1)
    start = end - timedelta(days=6)

    snap = {"date": today.isoformat(), "source": "actions"}

    try:
        reg = get_json(f"https://registry.npmjs.org/{PKG.replace('/', '%2f')}")
        snap["npm_version"] = reg["dist-tags"]["latest"]
    except Exception as e:
        print(f"  npm version: {e}", file=sys.stderr)
        snap["npm_version"] = None

    try:
        snap["npm_week"] = npm_downloads(PKG, start.isoformat(), end.isoformat())
        snap["npm_day"] = npm_day(PKG, end.isoformat())
    except Exception as e:
        print(f"  npm downloads: {e}", file=sys.stderr)
        snap["npm_week"] = snap["npm_day"] = None
    snap["npm_week_window"] = f"{start.isoformat()} → {end.isoformat()}"

    snap["siblings"] = {}
    for s in SIBLINGS:
        try:
            snap["siblings"][s] = npm_downloads(s, start.isoformat(), end.isoformat())
        except Exception:
            snap["siblings"][s] = None

    try:
        repo = get_json(f"https://api.github.com/repos/{REPO}", token)
        snap["stars"] = repo["stargazers_count"]
        snap["forks"] = repo["forks_count"]
        # subscribers_count, not watchers_count: GitHub aliases the latter
        # to the star count, which reads as phantom watcher growth.
        snap["subscribers"] = repo["subscribers_count"]
        snap["open_issues"] = repo["open_issues_count"]
        snap["pushed_at"] = repo["pushed_at"]
    except Exception as e:
        print(f"  repo stats: {e}", file=sys.stderr)
        for k in ("stars", "forks", "subscribers", "open_issues"):
            snap[k] = None

    snap["clones"], snap["clones_unique"] = traffic("clones", token)
    snap["views"], snap["views_unique"] = traffic("views", token)

    data = json.load(open(DATA)) if os.path.exists(DATA) else []
    if any(d["date"] == snap["date"] for d in data):
        print(f"Snapshot for {snap['date']} already recorded; nothing to do.")
        return 0
    prev = data[-1] if data else None
    data.append(snap)
    json.dump(data, open(DATA, "w"), indent=2)
    open(DATA, "a").write("\n")

    log = open(LOG).read()
    marker = "## Snapshots\n"
    log = log.replace(marker, marker + "\n" + render(snap, prev), 1)
    open(LOG, "w").write(log)

    print(json.dumps(snap, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
