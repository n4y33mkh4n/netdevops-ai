"""netdevops-ai-diff: explain a network-config diff in plain English.

Reads a unified diff from a file argument or stdin, sends to the configured
LLM with the CONFIG_DIFF_SYSTEM prompt, and prints the Markdown explanation
to stdout.
"""

from __future__ import annotations

import argparse
import sys

from netdevops_ai.anonymize import Anonymizer
from netdevops_ai.llm import get_default_client
from netdevops_ai.prompts import CONFIG_DIFF_SYSTEM


MAX_DIFF_CHARS = 60_000   # ~15k tokens, well within GPT-4o's window


def main() -> int:
    p = argparse.ArgumentParser(description="Explain a network device config diff in plain English.")
    p.add_argument("diff", nargs="?", help="Path to a unified diff. Reads stdin if omitted.")
    p.add_argument("--anonymize", action="store_true",
                   help="Replace IPs, MACs and hostnames with placeholders before sending to LLM.")
    p.add_argument("--dry-run", action="store_true",
                   help="Print the assembled prompt but don't call the LLM.")
    p.add_argument("--device-type", choices=["auto", "cisco", "juniper", "mikrotik", "bdcom", "huawei"],
                   default="auto", help="Hint for the LLM about the device platform.")
    args = p.parse_args()

    diff = open(args.diff).read() if args.diff else sys.stdin.read()
    if not diff.strip():
        print("No diff input.", file=sys.stderr)
        return 1

    if len(diff) > MAX_DIFF_CHARS:
        print(f"Truncating diff from {len(diff)} to {MAX_DIFF_CHARS} chars.", file=sys.stderr)
        diff = diff[:MAX_DIFF_CHARS]

    if args.anonymize:
        diff = Anonymizer().scrub(diff)

    user_message = _user_message(diff, args.device_type)

    if args.dry_run:
        print("---- SYSTEM ----")
        print(CONFIG_DIFF_SYSTEM)
        print("---- USER ----")
        print(user_message)
        return 0

    try:
        llm = get_default_client()
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2

    response = llm.chat(system=CONFIG_DIFF_SYSTEM, user=user_message, temperature=0.2)
    print(response)
    return 0


def _user_message(diff: str, device_type: str) -> str:
    hint = "" if device_type == "auto" else f"Device platform: {device_type}\n\n"
    return f"{hint}Here is the unified diff:\n\n```diff\n{diff}\n```"


if __name__ == "__main__":
    raise SystemExit(main())
