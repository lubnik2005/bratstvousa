#!/usr/bin/env python3
"""Check upstream PHP releases independently of vulnerability database lag."""
import json
import pathlib
import re
import urllib.request

DOCKERFILES = ("admin/docker/Dockerfile", "admin/runtimes/8.4/Dockerfile")


def version(value):
    if not re.fullmatch(r"\d+\.\d+\.\d+", value):
        raise ValueError("Expected an exact stable PHP version")
    return tuple(map(int, value.split(".")))


def release(branch):
    if not re.fullmatch(r"\d+\.\d+", branch):
        raise ValueError("Invalid PHP release branch")
    request = urllib.request.Request(
        f"https://www.php.net/releases/index.php?json&version={branch}",
        headers={"User-Agent": "bratstvousa-security-monitor/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        data = json.load(response)
    version(data["version"])
    if not data["version"].startswith(branch + "."):
        raise ValueError("PHP release API returned a different branch")
    if branch not in data["supported_versions"]:
        raise ValueError(f"PHP {branch} is no longer supported upstream")
    return data


def check_versions(values):
    problems, releases = [], {}
    for label, current in values:
        parsed = version(current)
        branch = ".".join(map(str, parsed[:2]))
        if branch not in releases:
            releases[branch] = release(branch)
        latest = releases[branch]
        if parsed < version(latest["version"]):
            kind = "security" if "security" in latest.get("tags", []) else "patch"
            problems.append(f"{label}: PHP {current}; latest {kind} release is {latest['version']}")
    return problems


def repository_versions(root):
    values = []
    for filename in DOCKERFILES:
        content = (root / filename).read_text()
        images = re.findall(r"(?im)^FROM\s+php:([^\s]+)", content)
        if not images:
            raise ValueError(f"No PHP base image found in {filename}")
        for image in images:
            match = re.match(r"(\d+\.\d+\.\d+)-", image)
            if not match:
                raise ValueError(f"Unpinned PHP image in {filename}")
            values.append((filename, match[1]))
    if len({value for _, value in values}) != 1:
        raise ValueError("Production and development PHP versions differ")
    return values


if __name__ == "__main__":
    root = pathlib.Path(__file__).resolve().parents[2]
    problems = check_versions(repository_versions(root))
    for problem in problems:
        print(problem)
    if problems:
        raise SystemExit(1)
    print("Active PHP Dockerfiles use the latest supported patch release.")
