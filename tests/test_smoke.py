"""Smoke tests — exercise the non-LLM paths (filter/anonymize/CLI plumbing).

We don't make real LLM calls in tests. To verify the LLM integration end to
end, run the CLIs with --dry-run, or set GITHUB_TOKEN and run them against
the bundled fixtures.
"""

from __future__ import annotations

from pathlib import Path

from netdevops_ai.anonymize import Anonymizer
from netdevops_ai.syslog_digest import _filter_interesting


FIXTURES = Path(__file__).parent / "fixtures"


def test_anonymize_ipv4() -> None:
    a = Anonymizer()
    out = a.scrub("peer 10.50.0.2 went down; backup 10.50.0.3")
    assert "10.50.0.2" not in out
    assert "10.50.0.3" not in out
    # Same value → same placeholder; different value → different
    assert a.mapping["10.50.0.2"] != a.mapping["10.50.0.3"]


def test_anonymize_idempotent_per_value() -> None:
    a = Anonymizer()
    first  = a.scrub("see 10.50.0.2 and 10.50.0.2")
    second = a.scrub("see 10.50.0.2 again")
    # Same value across calls within one Anonymizer keeps the same placeholder
    assert first.count(a.mapping["10.50.0.2"]) == 2
    assert a.mapping["10.50.0.2"] in second


def test_anonymize_mac() -> None:
    out = Anonymizer().scrub("mac aa:bb:cc:dd:ee:ff stale")
    assert "aa:bb:cc:dd:ee:ff" not in out
    assert "MAC_" in out


def test_anonymize_hostname() -> None:
    out = Anonymizer().scrub("Housing_Core_MKT bgp peer down")
    assert "Housing_Core_MKT" not in out
    assert "HOST_" in out


def test_filter_drops_noise() -> None:
    syslog = (FIXTURES / "sample_syslog.log").read_text().splitlines()
    kept = _filter_interesting(syslog, top_n=1000)
    # We should keep the BGP / link / fan / auth lines, drop BGP_REFRESH
    assert any("FAN-FAIL" in line for line in kept)
    assert any("link down" in line for line in kept)
    assert not any("BGP_REFRESH" in line for line in kept), "refresh noise should be filtered out"


def test_filter_cap_respected() -> None:
    huge = ["May 23 00:00:00 host BGP peer 1.1.1.1 went down"] * 5000
    kept = _filter_interesting(huge, top_n=100)
    assert len(kept) == 100
