"""Pluggable LLM backend.

Picks one of GitHub Models / Azure OpenAI / OpenAI direct based on env vars.
All three speak the OpenAI Chat Completions API, so we use the openai SDK
with a swapped base_url for GitHub Models.

Set ONE of:
    GITHUB_TOKEN                                — GitHub Models (default, free tier)
    AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY — Azure OpenAI
    OPENAI_API_KEY                              — OpenAI direct (paid)
"""

from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv
from openai import OpenAI, AzureOpenAI


load_dotenv()


@dataclass
class LLMClient:
    """Thin wrapper around an OpenAI-compatible client."""
    client: OpenAI | AzureOpenAI
    model: str
    backend: str

    def chat(self, system: str, user: str, temperature: float = 0.2, max_tokens: int = 1500) -> str:
        """Single-turn chat completion. Returns the assistant message content."""
        resp = self.client.chat.completions.create(
            model=self.model,
            temperature=temperature,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system},
                {"role": "user",   "content": user},
            ],
        )
        return (resp.choices[0].message.content or "").strip()


def get_default_client() -> LLMClient:
    """Inspect env and build the right client. Raises if no backend is configured."""
    # 1. GitHub Models (free tier — preferred for student use)
    if os.environ.get("GITHUB_TOKEN"):
        return LLMClient(
            client=OpenAI(
                api_key=os.environ["GITHUB_TOKEN"],
                base_url="https://models.github.ai/inference",
            ),
            model=os.environ.get("LLM_MODEL", "openai/gpt-4o"),
            backend="github-models",
        )

    # 2. Azure OpenAI
    if os.environ.get("AZURE_OPENAI_API_KEY") and os.environ.get("AZURE_OPENAI_ENDPOINT"):
        return LLMClient(
            client=AzureOpenAI(
                api_key=os.environ["AZURE_OPENAI_API_KEY"],
                azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
                api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-08-01-preview"),
            ),
            model=os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4o"),
            backend="azure-openai",
        )

    # 3. OpenAI direct
    if os.environ.get("OPENAI_API_KEY"):
        return LLMClient(
            client=OpenAI(api_key=os.environ["OPENAI_API_KEY"]),
            model=os.environ.get("LLM_MODEL", "gpt-4o"),
            backend="openai-direct",
        )

    raise RuntimeError(
        "No LLM backend configured. Set one of: GITHUB_TOKEN, "
        "AZURE_OPENAI_API_KEY+AZURE_OPENAI_ENDPOINT, or OPENAI_API_KEY."
    )
