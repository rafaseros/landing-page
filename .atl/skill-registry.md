# Skill Registry — landing-page

Generated: 2026-04-04

## User Skills

| Skill | Trigger | Source |
|-------|---------|--------|
| go-testing | Go tests, Bubbletea TUI testing | ~/.claude/skills/go-testing/ |
| issue-creation | Creating GitHub issues, bug reports, feature requests | ~/.claude/skills/issue-creation/ |
| branch-pr | Creating pull requests, PR workflows | ~/.claude/skills/branch-pr/ |
| judgment-day | Adversarial code review, parallel blind judge protocol | ~/.claude/skills/judgment-day/ |
| skill-creator | Creating new AI agent skills | ~/.claude/skills/skill-creator/ |

## Project Conventions

No project-level CLAUDE.md, .cursorrules, or agents.md detected.

## Compact Rules

### issue-creation
- Follow issue-first enforcement: create issue before branch/PR
- Use labels and structured templates

### branch-pr
- Branch naming: follows issue-first system
- PR must reference issue number

### judgment-day
- Two independent blind judges review in parallel
- Synthesize findings, fix, re-judge until pass or escalate after 2 iterations

## Notes

- **go-testing** and **skill-creator** are global skills, not directly relevant to this Astro project
- No project-level skills detected
