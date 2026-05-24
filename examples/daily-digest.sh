#!/usr/bin/env bash
# Daily syslog digest — run from cron, email or post to Slack.
#
# Crontab line (06:05 daily):
#   5 6 * * * /home/netdevops/daily-digest.sh
#
# Reads syslog for the last 24h, filters, summarizes with GPT-4o via
# GitHub Models, sends as email.

set -euo pipefail

SYSLOG_PATH="${SYSLOG_PATH:-/var/log/network/syslog}"
OUT_DIR="${OUT_DIR:-/var/log/network/digests}"
RECIPIENT="${RECIPIENT:-noc@example.com}"
DATE_TAG="$(date +%F)"

mkdir -p "$OUT_DIR"

# Tail last 24h of syslog into the digester. If your syslog is rotated, swap
# this for journalctl or zcat across rotated files.
awk -v cutoff="$(date -d '24 hours ago' '+%b %e %H:%M:%S')" \
    '$0 >= cutoff' "$SYSLOG_PATH" \
  | /usr/local/bin/netdevops-ai-digest --since 24h --top-n 600 \
  > "$OUT_DIR/digest-$DATE_TAG.md"

# Send by email (requires mailx / s-nail installed)
if command -v mail >/dev/null; then
  mail -s "NOC daily digest $DATE_TAG" "$RECIPIENT" < "$OUT_DIR/digest-$DATE_TAG.md"
fi

# Or curl to Slack:
# curl -X POST -H 'Content-Type: application/json' \
#   --data "$(jq -Rs '{text:.}' < "$OUT_DIR/digest-$DATE_TAG.md")" \
#   "$SLACK_WEBHOOK_URL"
