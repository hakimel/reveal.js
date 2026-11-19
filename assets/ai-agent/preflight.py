"""Check classroom readiness without sending prompts or credentials anywhere."""
import importlib.util
import json
import os
import platform
import sys
import urllib.error
import urllib.request
from urllib.parse import urlparse


def check():
    base = os.getenv("AGENT_BASE_URL", "http://localhost:11434/v1")
    model = os.getenv("AGENT_MODEL", "qwen3")
    parsed = urlparse(base)
    report = {"python": platform.python_version(), "python_ready": sys.version_info >= (3, 10),
              "openai_sdk": importlib.util.find_spec("openai") is not None,
              "framework_sdk": importlib.util.find_spec("agent_framework") is not None,
              "model": model, "endpoint_host": parsed.hostname,
              "server_ready": False, "model_ready": False, "tool_support": "unknown"}
    if parsed.hostname not in ("localhost", "127.0.0.1", "::1") or parsed.scheme != "http":
        report["note"] = "Custom endpoint: no automatic request sent. Verify separately."
        return report
    # Ignore environment proxy configuration for the explicit loopback probe.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    root = f"http://{parsed.netloc}"
    try:
        with opener.open(root + "/api/tags", timeout=3) as response:
            models = json.load(response).get("models", [])
        report["server_ready"] = True
        available = [item.get("name", "") for item in models]
        report["available_models"] = available
        report["model_ready"] = model in available or model + ":latest" in available
        if report["model_ready"]:
            request = urllib.request.Request(root + "/api/show", method="POST",
                data=json.dumps({"model": model}).encode(), headers={"Content-Type": "application/json"})
            with opener.open(request, timeout=3) as response:
                capabilities = json.load(response).get("capabilities", [])
            report["tool_support"] = "advertised" if "tools" in capabilities else "not advertised; test explicitly"
    except (OSError, ValueError, urllib.error.URLError) as exc:
        report["note"] = f"Local runtime unavailable ({type(exc).__name__}). Start Ollama and pull the configured model."
    return report


if __name__ == "__main__":
    result = check()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(0 if all(result[k] for k in ("python_ready", "openai_sdk", "server_ready", "model_ready")) else 1)
