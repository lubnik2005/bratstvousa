#!/usr/bin/env python3
"""Trusted production checks and CI notifications; never execute PR artifacts."""
import argparse
import datetime
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import urllib.request

from runtime import check_versions

RECIPIENT = "lubnik2005@gmail.com"
SENDER = "alert@vitalpredict.org"


def send(subject, text):
    key = os.environ.get("SECURITY_RESEND_API_KEY")
    if not key:
        raise RuntimeError("SECURITY_RESEND_API_KEY is not configured")
    payload = {"from": SENDER, "to": [RECIPIENT], "subject": subject, "text": text}
    request = urllib.request.Request(
        "https://api.resend.com/emails", data=json.dumps(payload).encode(),
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json",
                 "User-Agent": "bratstvousa-security-monitor/1.0"}, method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)
    if not result.get("id"):
        raise RuntimeError("Resend did not acknowledge the notification")
    print("Notification accepted by Resend.")


def command(*args):
    return subprocess.check_output(args, text=True, timeout=30, stderr=subprocess.DEVNULL).strip()


def production_problems():
    problems, values = [], []
    container = os.environ.get("SECURITY_CONTAINER", "admin-app-1")
    health = command("docker", "inspect", container, "--format", "{{.State.Health.Status}}")
    if health != "healthy":
        problems.append("Production container is not healthy")
    for binary in ("php", "php-fpm"):
        output = command("docker", "exec", container, binary, "-v")
        match = re.search(r"PHP (\d+\.\d+\.\d+)", output)
        if not match:
            raise RuntimeError("Could not read deployed PHP version")
        values.append((f"Production {binary}", match[1]))
    problems.extend(check_versions(values))
    setting = command("docker", "exec", container, "php", "-r",
                      'echo ini_get("session.upload_progress.enabled") ? "on" : "off";')
    if setting != "off":
        problems.append("Native PHP session upload progress is enabled")
    for route in ("login", "up"):
        request = urllib.request.Request(
            f"https://admin.bratstvousa.com/{route}",
            headers={"User-Agent": "bratstvousa-security-monitor/1.0"},
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.status != 200:
                problems.append(f"Public /{route} is not healthy")
    return problems


def notify_state(problems, state_path, now):
    state = json.loads(state_path.read_text()) if state_path.exists() else {}
    fingerprint = hashlib.sha256(json.dumps(sorted(problems)).encode()).hexdigest() if problems else ""
    previous = state.get("fingerprint", "")
    due = now - state.get("last_sent", 0) >= 7 * 86400
    if problems and (fingerprint != previous or due):
        send("[bratstvousa] Production security alert", "\n".join(problems))
    elif previous and not problems:
        send("[bratstvousa] Production recovered", "Production runtime and health checks are passing again.")
    else:
        return
    # Persist only after successful delivery; failed sends are retried next run.
    state_path.parent.mkdir(parents=True, exist_ok=True)
    temporary = state_path.with_suffix(".tmp")
    temporary.write_text(json.dumps({"fingerprint": fingerprint, "last_sent": now}))
    temporary.chmod(0o600)
    temporary.replace(state_path)


def ci_notification():
    event = json.loads(pathlib.Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
    run = event["workflow_run"]
    repository = os.environ["GITHUB_REPOSITORY"]
    if (run["head_branch"] != "main" or run["event"] not in ("push", "schedule", "workflow_dispatch")
            or run["head_repository"]["full_name"] != repository
            or run["conclusion"] not in ("success", "failure", "timed_out", "action_required")):
        print("No trusted completed run to notify.")
        return
    request = urllib.request.Request(
        f"https://api.github.com/repos/{repository}/actions/workflows/{run['workflow_id']}/runs?branch=main&status=completed&per_page=100",
        headers={"Authorization": "Bearer " + os.environ["GH_TOKEN"],
                 "Accept": "application/vnd.github+json"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        history = json.load(response)["workflow_runs"]
    previous = next((item for item in history if item["run_number"] < run["run_number"]
                     and item["event"] in ("push", "schedule", "workflow_dispatch")
                     and item["conclusion"] in ("success", "failure", "timed_out", "action_required")), None)
    failing = run["conclusion"] != "success"
    was_failing = previous is not None and previous["conclusion"] != "success"
    weekly = run["event"] == "schedule" and datetime.datetime.now(datetime.timezone.utc).weekday() == 0
    if failing and (not was_failing or weekly):
        send("[bratstvousa] Security CI needs attention",
             "Security checks failed or could not complete. Review the run:\n" + run["html_url"])
    elif not failing and was_failing:
        send("[bratstvousa] Security CI recovered", "Security checks are passing:\n" + run["html_url"])
    else:
        print("No transition or weekly reminder; no email needed.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("production", "ci", "test-email"))
    parser.add_argument("--state", type=pathlib.Path, default=pathlib.Path("/var/lib/bratstvo-security/state.json"))
    args = parser.parse_args()
    if args.mode == "test-email":
        send("[bratstvousa] Security alert delivery test", "Security notifications are configured for this address.")
    elif args.mode == "ci":
        ci_notification()
    else:
        try:
            problems = production_problems()
        except Exception as error:
            # Exception text may include HTTP bodies or arguments; never email it.
            status = f", HTTP {error.code}" if isinstance(error, urllib.error.HTTPError) else ""
            problems = [f"Production security checks could not complete ({type(error).__name__}{status}); inspect the service journal."]
        notify_state(problems, args.state, datetime.datetime.now(datetime.timezone.utc).timestamp())
        if problems:
            print("\n".join(problems))
            return 1
        print("Production security checks passed.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(f"Security notification failed ({type(error).__name__}).", file=sys.stderr)
        sys.exit(1)
