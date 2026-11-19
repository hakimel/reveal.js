"""Workshop 4 migration: same validated tools, Microsoft Agent Framework runtime.
API reference: https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/model-providers/ollama
Optional dependency: python -m pip install -r requirements-framework.txt
"""
import asyncio
import json
import os
from scratch_agent import ACTIVE_RUN, INSTRUCTIONS, RunState, dispatch


def shared_dispatch(name, arguments):
    if ACTIVE_RUN.get() is None:
        raise RuntimeError("No host run controls available")
    return dispatch(name, arguments)


def safe_calculate(expression: str) -> str:
    """Calculate bounded + - * / arithmetic. Shared validation is unchanged."""
    return shared_dispatch("safe_calculate", json.dumps({"expression": expression}))


def save_note(title: str, content: str, source: str = "user-approved") -> str:
    """Ask the learner before saving a note with provenance to local memory."""
    return shared_dispatch("save_note", json.dumps({"title": title, "content": content, "source": source}))


def search_notes(query: str) -> str:
    """Search local notes only when the caller granted memory-read permission."""
    return shared_dispatch("search_notes", json.dumps({"query": query}))


async def main():
    from agent_framework import Agent
    from agent_framework.openai import OpenAIChatClient
    state = RunState(allow_memory_read=False)
    token = ACTIVE_RUN.set(state)
    try:
        agent = Agent(client=OpenAIChatClient(
            api_key=os.getenv("AGENT_API_KEY", "ollama"),
            base_url=os.getenv("AGENT_BASE_URL", "http://localhost:11434/v1/"),
            model=os.getenv("AGENT_MODEL", "qwen3")),
            name="WorkshopAgent", instructions=INSTRUCTIONS,
            tools=[safe_calculate, save_note, search_notes])
        # Tool functions retain the host-side approval gate and call budget.
        # This timeout is cooperative; terminal input must be answered by the learner.
        result = await asyncio.wait_for(agent.run(
            "18 دەرسنىڭ ھەربىرى 45 مىنۇت بولسا، جەمئىي قانچە سائەت؟ نەتىجىنى ھېسابلاپ، خاتىرە ساقلاشقا رۇخسەت سوراڭ."), timeout=90)
        print(result)
    finally:
        ACTIVE_RUN.reset(token)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except ImportError:
        print("Optional dependency missing: pip install -r requirements-framework.txt")
    except (asyncio.TimeoutError, KeyboardInterrupt):
        print("Stopped: timeout or cancellation")
