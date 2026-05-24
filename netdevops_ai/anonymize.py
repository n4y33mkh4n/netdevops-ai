"""Anonymizer: replace IPs / MACs / hostnames with stable placeholders.

Used by both CLIs when --anonymize is passed, so production data isn't sent
to a remote LLM.

Same input value always maps to the same placeholder within one process so
the LLM can still reason about identity ("IP_001 reset its session to IP_002").
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field


# Order matters: longer/more-specific patterns first.
_IPV6 = re.compile(r"\b(?:[0-9A-Fa-f]{1,4}:){2,7}[0-9A-Fa-f]{1,4}\b")
_IPV4 = re.compile(r"\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\b")
_MAC  = re.compile(r"\b(?:[0-9A-Fa-f]{2}[:.-]){5}[0-9A-Fa-f]{2}\b|\b(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4}\b")

# Common ISP hostname patterns: Word_Core_MKT, City-Edge-Rt, etc.
_HOSTNAME = re.compile(r"\b[A-Za-z][A-Za-z0-9]+(?:[_-][A-Za-z0-9]+){1,4}_(?:MKT|SW|Rt|POP_SW|POP)\b")


@dataclass
class Anonymizer:
    counters: dict[str, int] = field(default_factory=lambda: {"IP": 0, "IP6": 0, "MAC": 0, "HOST": 0})
    mapping:  dict[str, str] = field(default_factory=dict)

    def _placeholder(self, kind: str, value: str) -> str:
        if value in self.mapping:
            return self.mapping[value]
        self.counters[kind] += 1
        ph = f"{kind}_{self.counters[kind]:03d}"
        self.mapping[value] = ph
        return ph

    def scrub(self, text: str) -> str:
        text = _IPV6.sub(lambda m: self._placeholder("IP6",  m.group(0)), text)
        text = _IPV4.sub(lambda m: self._placeholder("IP",   m.group(0)), text)
        text = _MAC.sub( lambda m: self._placeholder("MAC",  m.group(0)), text)
        text = _HOSTNAME.sub(lambda m: self._placeholder("HOST", m.group(0)), text)
        return text
