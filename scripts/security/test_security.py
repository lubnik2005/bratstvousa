import json
import importlib.util
import io
import os
import pathlib
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import monitor
import runtime

spec = importlib.util.spec_from_file_location("secret_scan", pathlib.Path(__file__).with_name("secrets.py"))
secret_scan = importlib.util.module_from_spec(spec)
spec.loader.exec_module(secret_scan)


class RuntimeTests(unittest.TestCase):
    def test_old_patch_is_rejected_even_without_cve_database(self):
        with patch.object(runtime, "release", return_value={"version": "8.4.27", "tags": ["security"]}):
            self.assertIn("security", runtime.check_versions([("production", "8.4.26")])[0])
            self.assertEqual([], runtime.check_versions([("production", "8.4.27")]))

    def test_upstream_failure_is_not_reported_as_safe(self):
        with patch.object(runtime, "release", side_effect=TimeoutError):
            with self.assertRaises(TimeoutError):
                runtime.check_versions([("production", "8.4.27")])

    def test_prereleases_and_floating_versions_are_rejected(self):
        for value in ("8.4", "8.4.27RC1", "latest"):
            with self.assertRaises(ValueError):
                runtime.version(value)

    def test_unsupported_branch_is_rejected(self):
        payload = {"version": "8.1.34", "supported_versions": ["8.4"]}
        with patch("urllib.request.urlopen") as request:
            request.return_value.__enter__.return_value.read.return_value = json.dumps(payload).encode()
            with self.assertRaises(ValueError):
                runtime.release("8.1")


class NotificationTests(unittest.TestCase):
    def test_first_failure_deduplicated_reminder_and_recovery(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(monitor, "send") as send:
            state = pathlib.Path(directory) / "state.json"
            monitor.notify_state(["outdated"], state, 1000000)
            monitor.notify_state(["outdated"], state, 1000001)
            self.assertEqual(1, send.call_count)
            monitor.notify_state(["outdated"], state, 1000000 + 7 * 86400)
            self.assertEqual(2, send.call_count)
            monitor.notify_state([], state, 2000000)
            monitor.notify_state([], state, 2000001)
            self.assertEqual(3, send.call_count)
            self.assertIn("recovered", send.call_args.args[0])

    def test_failed_delivery_does_not_suppress_retry(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(monitor, "send", side_effect=TimeoutError):
            state = pathlib.Path(directory) / "state.json"
            with self.assertRaises(TimeoutError):
                monitor.notify_state(["outdated"], state, 1000000)
            self.assertFalse(state.exists())

    def test_fork_or_pr_run_cannot_send_email(self):
        event = {"workflow_run": {
            "head_branch": "main", "event": "pull_request",
            "head_repository": {"full_name": "someone/fork"}, "conclusion": "failure",
        }}
        with tempfile.TemporaryDirectory() as directory, patch.object(monitor, "send") as send:
            path = pathlib.Path(directory) / "event.json"
            path.write_text(json.dumps(event))
            with patch.dict(os.environ, {"GITHUB_EVENT_PATH": str(path), "GITHUB_REPOSITORY": "owner/repo"}):
                monitor.ci_notification()
            send.assert_not_called()

    def test_ci_failure_and_recovery_transitions(self):
        for conclusion, previous, expected in (
            ("failure", "success", 1), ("failure", "failure", 0),
            ("success", "failure", 1), ("success", "success", 0),
        ):
            with self.subTest(conclusion=conclusion, previous=previous):
                event = {"workflow_run": {
                    "head_branch": "main", "event": "push", "workflow_id": 1,
                    "head_repository": {"full_name": "owner/repo"},
                    "conclusion": conclusion, "run_number": 2,
                    "html_url": "https://github.com/owner/repo/actions/runs/2",
                }}
                history = {"workflow_runs": [{"run_number": 1, "event": "push", "conclusion": previous}]}
                with tempfile.TemporaryDirectory() as directory, patch.object(monitor, "send") as send:
                    path = pathlib.Path(directory) / "event.json"
                    path.write_text(json.dumps(event))
                    with patch.dict(os.environ, {
                        "GITHUB_EVENT_PATH": str(path), "GITHUB_REPOSITORY": "owner/repo", "GH_TOKEN": "dummy",
                    }), patch("urllib.request.urlopen") as request:
                        request.return_value.__enter__.return_value.read.return_value = json.dumps(history).encode()
                        monitor.ci_notification()
                    self.assertEqual(expected, send.call_count)


class SecretTests(unittest.TestCase):
    def test_sensitive_filenames_blocked_but_examples_allowed(self):
        secret_scan.check_filenames(["app/.env.example", "admin/.env.production.example"])
        for name in ("app/.env.prod", "app/.dev.vars", "admin/auth.json", "private.pem", "cert.p12"):
            with self.assertRaises(RuntimeError):
                secret_scan.check_filenames([name])

    def test_push_checks_whole_outgoing_range_and_new_branch_history(self):
        local, remote, zero = "a" * 40, "b" * 40, "0" * 40
        incoming = f"refs/heads/main {local} refs/heads/main {remote}\n"
        incoming += f"refs/heads/new {local} refs/heads/new {zero}\n"
        incoming += f"(delete) {zero} refs/heads/old {remote}\n"
        with patch("sys.argv", ["secrets.py", "push"]), patch("sys.stdin", io.StringIO(incoming)), patch.object(secret_scan, "scan") as scan:
            secret_scan.main()
        self.assertEqual([(f"--log-opts={remote}..{local}",), (f"--log-opts={local}",)],
                         [call.args for call in scan.call_args_list])

    @unittest.skipUnless(os.environ.get("SECURITY_INTEGRATION") == "1", "opt-in Docker integration")
    def test_actual_staged_scanner_rejects_dummy_resend_key(self):
        root = pathlib.Path(__file__).resolve().parents[2]
        with tempfile.TemporaryDirectory() as directory:
            repo = pathlib.Path(directory)
            subprocess.run(["git", "init", "--quiet", directory], check=True)
            (repo / ".gitleaks.toml").write_bytes((root / ".gitleaks.toml").read_bytes())
            (repo / "credential.txt").write_text("RESEND_API_KEY=" + "re_" + "testOnlyNotARealCredential123456789" + "\n")
            subprocess.run(["git", "-C", directory, "add", "credential.txt"], check=True)
            result = subprocess.run(
                ["python3", str(root / "scripts/security/secrets.py"), "staged"],
                cwd=directory, capture_output=True, text=True,
            )
            self.assertNotEqual(0, result.returncode)
            self.assertIn("leaks found", result.stdout + result.stderr)
            self.assertNotIn("testOnlyNotARealCredential123456789", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
