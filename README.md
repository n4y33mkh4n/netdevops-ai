# netdevops-ai

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)

Two CLIs that apply LLMs to real ISP NOC pain points:

| Tool | What it does | Where you run it |
|---|---|---|
| `netdevops-ai-diff` | Reads a unified config diff (Cisco, Juniper, MikroTik, BDCOM) and writes a plain-English review with risk assessment + test plan | GitHub Actions on a PR, or locally |
| `netdevops-ai-digest` | Reads ~24h of router/switch syslog and writes a daily incident digest for the on-call team | cron, daily at 06:00 |

Backed by **GitHub Models GPT-4o** (free for students/users with rate limits) and pluggable to Azure OpenAI or direct OpenAI when you outgrow the free tier.

## Why this exists

- Config PRs are 50+ lines of cryptic CLI. A reviewer needs "what changed, what's the blast radius, what to test." The diff tool answers that in 10 seconds.
- Syslog produces thousands of lines/day. Nobody reads it. The digester surfaces the 5 things that actually matter overnight so the morning standup is one minute instead of 30.

## Install

```bash
pip install netdevops-ai
# or, for development:
git clone https://github.com/<you>/netdevops-ai.git
cd netdevops-ai && pip install -e .[dev]
```

## Set up the LLM backend

The library picks the backend automatically based on which env var is set:

| Backend | Set | Notes |
|---|---|---|
| **GitHub Models** (free) | `GITHUB_TOKEN` | Default. Set `LLM_MODEL=openai/gpt-4o`. Rate limits: 50 req/day anon, 150 GitHub user, 300 Copilot Pro. |
| Azure OpenAI ($100 student) | `AZURE_OPENAI_ENDPOINT` + `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_DEPLOYMENT` | When you outgrow free tier. |
| OpenAI direct | `OPENAI_API_KEY` | Paid. |

Copy `.env.example` to `.env` and fill in the relevant one.

## Usage — diff explainer

```bash
# Local: explain a diff
git diff main..HEAD -- '*.cfg' '*.rsc' | netdevops-ai-diff

# CI: see examples/github-action.yml for the PR-comment workflow

# Anonymize IPs/hostnames before sending to LLM (recommended for production configs)
git diff main..HEAD | netdevops-ai-diff --anonymize
```

Sample output:

```markdown
## Summary
Adds BGP peer 10.50.0.2 (AS 65010) on Housing_Core_MKT with a prefix-list
import filter and changes the existing peer's hold-timer from 90 to 30 seconds.

## What changed
- New eBGP peer to upstream transit on AS 65010
- Inbound prefix-list `from-transit-v4` permits only the customer block
- Existing peer 10.40.0.1 hold-timer reduced from 90s → 30s

## Affected scope
- Housing_Core_MKT only
- Customer traffic egressing via the new transit path
- Faster failover for the existing peer (30s vs 90s)

## Risk
**medium** — hold-timer change affects an active production session.

## Test plan
- `show ip bgp summary` confirm both peers established before merging
- ping from PoP-Housing to 8.8.8.8 to confirm transit reachable
- monitor flap count on 10.40.0.1 for 24h after merge
```

## Usage — syslog digester

```bash
# Read syslog from a file
netdevops-ai-digest /var/log/network/syslog --since 24h

# Or pipe in
journalctl -u rsyslog --since "24 hours ago" | netdevops-ai-digest

# Cron the daily digest (see examples/daily-digest.sh)
```

Sample output:

```markdown
## TL;DR
- 3 link flaps on Housing_Core_MKT eth4 (overnight)
- BGP session to AS 65010 reset twice — uplink instability
- 1 hardware error on BDCOM Saver_POP_SW — fan stuck
- Quiet across all MX240 / Cisco / Juniper devices

## Critical events
- 02:14 Housing_Core_MKT: bgp neighbor 10.50.0.2 went down (peer-reset)
- 02:14 again
- 04:33 Saver_POP_SW: %ENV-3-FAN-FAIL  Fan 2 stopped

## Recurring patterns
- Housing_Core_MKT eth4 flapped 7× between 01:00–04:00
- Authentication failures on Ibrahimpur_Core_MKT from 192.168.x.x (15 attempts)

## Devices needing attention
- **Saver_POP_SW** — fan failure, schedule replacement
- **Housing_Core_MKT** — investigate eth4 uplink stability

## Quiet devices
Desh-Edge-Rt · Huawei_Dist_sw · Mikrotik_Dist_SW · Iqbal-Rd_core_Mkt · ...
```

## Anonymization

Both CLIs accept `--anonymize` which replaces IPv4 addresses, IPv6 addresses, MAC addresses, and known hostname patterns with stable placeholders (`IP_001`, `MAC_001`, etc.) before sending to the LLM. Useful when you don't want to send raw production data to a remote model.

## License

MIT
