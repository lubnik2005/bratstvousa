#!/usr/bin/env python3
"""Run a pinned secret scanner locally and in CI. Never print raw credentials."""
import pathlib
import re
import shutil
import subprocess
import sys

IMAGE = "ghcr.io/gitleaks/gitleaks:v8.30.1@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f"
ROOT = pathlib.Path(subprocess.check_output(
    ["git", "rev-parse", "--show-toplevel"], text=True).strip())


def scan(*options):
    if not shutil.which("docker"):
        raise RuntimeError("Docker is required for the pinned Gitleaks scanner.")
    subprocess.run([
        "docker", "run", "--rm", "--network=none", "--read-only",
        "-v", f"{ROOT}:/repo:ro", "-w", "/repo", IMAGE,
        "git", "--redact=100", "--no-banner", "--no-color", "--verbose",
        "--config=/repo/.gitleaks.toml",
        *options, "/repo",
    ], check=True)


def check_filenames(names):
    blocked = []
    for name in names:
        path = pathlib.PurePosixPath(name)
        basename = path.name
        example = basename == ".env.example" or basename.endswith(".example")
        if ((basename == ".env" or basename.startswith(".env.")
             or basename == ".dev.vars" or basename.startswith(".dev.vars.")) and not example
                or basename == "auth.json"
                or re.search(r"\.(?:pem|key|p12|pfx)$", basename, re.I)):
            blocked.append(name)
    if blocked:
        raise RuntimeError("Sensitive filenames blocked: " + ", ".join(blocked))


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "staged"
    if mode == "install":
        existing = subprocess.run(
            ["git", "config", "--get", "core.hooksPath"], capture_output=True, text=True
        ).stdout.strip()
        if existing and existing != ".githooks":
            raise RuntimeError("Existing custom hooksPath found; integrate hooks manually.")
        hooks = pathlib.Path(subprocess.check_output(
            ["git", "rev-parse", "--git-path", "hooks"], text=True).strip())
        if not existing and any((hooks / name).exists() for name in ("pre-commit", "pre-push")):
            raise RuntimeError("Existing Git hooks found; integrate hooks manually.")
        for name in ("pre-commit", "pre-push"):
            (ROOT / ".githooks" / name).chmod(0o755)
        subprocess.run(["docker", "pull", IMAGE], check=True)
        subprocess.run(["git", "config", "--local", "core.hooksPath", ".githooks"], check=True)
        print("Installed staged-secret and outgoing-history checks.")
    elif mode == "staged":
        names = subprocess.check_output([
            "git", "diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"
        ]).decode().split("\0")
        check_filenames(filter(None, names))
        scan("--pre-commit", "--staged")
    elif mode == "push":
        for line in sys.stdin:
            _, local, _, remote = line.split()
            if set(local) == {"0"}:
                continue
            revision = local if set(remote) == {"0"} else f"{remote}..{local}"
            scan(f"--log-opts={revision}")
    elif mode == "history":
        scan("--log-opts=--all")
    else:
        raise RuntimeError("Use install, staged, push, or history.")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, subprocess.CalledProcessError) as error:
        print(f"Secret check failed: {error}", file=sys.stderr)
        sys.exit(1)
