# Security Policy

## Reporting a vulnerability

Email **security@haruspex.guru** with details. We aim to acknowledge within 2
business days.

Please include:
- A description of the issue.
- Steps to reproduce, if applicable.
- The affected skill or file path.
- Any suggested mitigation.

Do **not** open public GitHub issues for security-sensitive reports.

## Scope

This repository contains **skills**: markdown instructions that Claude reads and
follows. Skills do not execute code, do not handle API keys, and do not make
network requests directly. The data path runs through `@haruspex-guru/mcp-server`,
which is a separate package with its own security policy.

The most plausible threat model for this repository is therefore **prompt
injection or social-engineering content** embedded in skill instructions. If
you find a skill that could be manipulated to leak data, mislead a user, or
bypass the compliance rules, please report it.

## Out of scope

- Vulnerabilities in `@haruspex-guru/mcp-server` — report at that repository.
- Vulnerabilities in the Haruspex API — report at security@haruspex.guru.
- General Claude / Anthropic platform issues — report to Anthropic directly.

## API keys

No API key, demo or otherwise, should ever be committed to this repository.
The MCP setup guide instructs users to configure their own key locally. If you
find a leaked key in this repo, treat it as a vulnerability and report it.
