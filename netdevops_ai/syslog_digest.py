"""netdevops-ai-digest: produce a daily syslog incident digest.

Reads syslog from a file argument or stdin, filters to interesting lines,
sends to the LLM, prints a Markdown digest.

Filtering keeps the prompt small enough for GPT-4o:
  1. Severity: keep emergency/alert/critical/error/warning by syslog priority OR
     by RFC-3164 keywords (%, ERROR, CRITICAL, etc.).
  2. Keywords: keep lines mentioning BGP, OSPF, link, interface, neighbor, fan,
     power, temp, auth, login, %ENV-, %BGP-, %OSPF-, %LINK-, %LINEPROTO-.
  3. Cap: at most --top-n filtered lines (default 600), tail-biased for recency.
"""

from __future__ import annotations

import argparse
import re
import sys

from netdevops_ai.anonymize import Anonymizer
from netdevops_ai.llm import get_default_client
from netdevops_ai.prompts import SYSLOG_DIGEST_SYSTEM


INTERESTING_KEYWORDS = re.compile(
    r"""
    \b(?:
        BGP | OSPF | OSPFv3 | ISIS |
        LINK | LINEPROTO | LINK-FLAP |
        interface | neighbor | adjacency | session |
        FAN | POWER | TEMP | THERMAL | ENV |
        AUTH | LOGIN | DENY | failed |
        ERROR | CRITICAL | EMERGENCY | ALERT | FATAL |
        %BGP- | %OSPF- | %LINK- | %LINEPROTO- | %ENV- | %SEC-
    )\b
    """,
    re.IGNORECASE | re.VERBOSE,
)

NOISE = re.compile(
    r"""
    \b(?:
        keepalive | refresh | informational
    )\b
    """,
    re.IGNORECASE | re.VERBOSE,
)


def main() -> int:
    p = argparse.ArgumentParser(description="Summarize the last N hours of router/switch syslog.")
    p.add_argument("syslog", nargs="?", help="Path to syslog file. Reads stdin if omitted.")
    p.add_argument("--since", default="24h",
                   help="Window label included in the prompt (e.g. '24h', '12h'). Default: 24h.")
    p.add_argument("--top-n", type=int, default=600,
                   help="Maximum filtered lines sent to the LLM. Default: 600.")
    p.add_argument("--anonymize", action="store_true",
                   help="Replace IPs / MACs / hostnames with placeholders before sending.")
    p.add_argument("--dry-run", action="store_true",
                   help="Print the assembled prompt without calling the LLM.")
    args = p.parse_args()

    raw = open(args.syslog).read() if args.syslog else sys.stdin.read()
    if not raw.strip():
        print("No syslog input.", file=sys.stderr)
        return 1

    filtered = _filter_interesting(raw.splitlines(), args.top_n)
    if not filtered:
        print("(no interesting events in the window)")
        return 0

    text = "\n".join(filtered)
    if args.anonymize:
        text = Anonymizer().scrub(text)

    user_message = (
        f"Time window: last {args.since}. "
        f"{len(filtered)} filtered syslog lines from the ISP fleet:\n\n"
        f"```\n{text}\n```"
    )

    if args.dry_run:
        print("---- SYSTEM ----")
        print(SYSLOG_DIGEST_SYSTEM)
        print("---- USER ----")
        print(user_message)
        return 0

    try:
        llm = get_default_client()
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2

    response = llm.chat(system=SYSLOG_DIGEST_SYSTEM, user=user_message,
                        temperature=0.2, max_tokens=2000)
    print(response)
    return 0


def _filter_interesting(lines: list[str], top_n: int) -> list[str]:
    kept: list[str] = []
    for line in lines:
        if NOISE.search(line):
            continue
        if INTERESTING_KEYWORDS.search(line):
            kept.append(line)
    # Tail-biased: keep the most recent N (assumes chronological log).
    return kept[-top_n:] if len(kept) > top_n else kept


if __name__ == "__main__":
    raise SystemExit(main())
