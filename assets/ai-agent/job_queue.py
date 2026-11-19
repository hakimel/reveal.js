"""Small in-process queue for Workshop 5. Not a durable production job service.
Bounded queue, explicit cancellation, submission-time deadline, shared run controls.
The main block is a deterministic demonstration and calls no real model.
"""
import queue
import threading
import time
from dataclasses import dataclass, field
from scratch_agent import RunState, run_agent


@dataclass
class Job:
    goal: str
    state: RunState = field(default_factory=RunState)
    status: str = "queued"
    result: object = None


class ClassroomQueue:
    def __init__(self, runner=run_agent, capacity=8):
        self.jobs = queue.Queue(maxsize=capacity)
        self.runner = runner
        self.by_id = {}
        self.worker = threading.Thread(target=self._work, daemon=True)
        self.worker.start()

    def submit(self, goal, timeout=90):
        job = Job(goal, RunState(timeout_seconds=timeout))
        self.by_id[job.state.run_id] = job
        try:
            self.jobs.put_nowait(job)
        except queue.Full:
            del self.by_id[job.state.run_id]
            raise RuntimeError("Queue full; try later")
        return job.state.run_id

    def cancel(self, run_id):
        self.by_id[run_id].state.cancel.set()

    def _work(self):
        while True:
            job = self.jobs.get()
            try:
                if job is None:
                    return
                job.state.check()
                job.status = "running"
                job.result = self.runner(job.goal, state=job.state)
                job.status = "stopped" if str(job.result).startswith("Stopped:") else "completed"
            except Exception as exc:
                job.status, job.result = "stopped", str(exc)
            finally:
                self.jobs.task_done()

    def close(self):
        self.jobs.join()
        self.jobs.put(None)
        self.worker.join(timeout=2)


if __name__ == "__main__":
    def simulated_runner(goal, state):
        state.check()
        return "Simulated result: 13.5 hours; no model called."
    service = ClassroomQueue(runner=simulated_runner)
    task = service.submit("calculate study time")
    service.jobs.join()
    print(service.by_id[task].status, service.by_id[task].result)
    service.close()
