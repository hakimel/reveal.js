"""Report deterministic evaluation separately from optional live model evidence."""
import contextlib
import io
import json
import time
import unittest
from test_lab import LabTests


def main():
    started = time.perf_counter()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(LabTests)
    log = io.StringIO()
    with contextlib.redirect_stdout(log):
        result = unittest.TextTestRunner(stream=log, verbosity=0).run(suite)
    report = {"mode": "deterministic-contract-tests", "real_model_called": False,
        "tests": result.testsRun, "passed": result.testsRun - len(result.failures) - len(result.errors),
        "failures": len(result.failures), "errors": len(result.errors),
        "duration_ms": round((time.perf_counter() - started) * 1000),
        "model_latency_ms": None, "model_tokens": None, "monetary_cost": None,
        "note": "Model quality, latency and monetary cost require a separately configured live run."}
    print(json.dumps(report, indent=2))
    if not result.wasSuccessful():
        print(log.getvalue())
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
