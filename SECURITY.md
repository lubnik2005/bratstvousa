# Security automation

## Local protection

Install the tracked commit/push hooks on each workstation (Python 3 and Docker
are required):

```sh
python3 scripts/security/secrets.py install
```

Installation refuses to overwrite other hooks. Commits scan staged changes and
block sensitive filenames. Pushes scan outgoing commit ranges, including secrets
introduced and removed in the same push. A new remote branch scans its complete
reachable history. A missing scanner or failed scan blocks the operation.
Hooks can be bypassed, so GitHub secret scanning and push protection are also
enabled. These do not recognize every possible secret format.

```sh
python3 scripts/security/secrets.py staged
python3 scripts/security/secrets.py history
python3 scripts/security/runtime.py
python3 -m unittest discover -s scripts/security -p 'test_*.py'
```

Gitleaks is pinned by version and image digest. Output is fully redacted; never
publish unredacted scanner reports. `.gitleaksignore` contains only individually
reviewed historical fingerprints for public Cognito embed IDs and localStorage
names. Do not baseline real secrets. Revoke exposed credentials before removing
them from history; history rewriting is a separate coordinated operation.

## GitHub checks

`Security checks` runs on PRs, main pushes, daily at 08:23 UTC, and manually:

- Full Git history secret scan.
- Supported/latest PHP patch release validation using PHP's official API.

`Dependency audits` checks Composer and all six npm lockfiles daily at 08:33 UTC
and on manual dispatch, without installing dependencies or executing their scripts.
Audits run outside the PR/push path and share one runner. npm HIGH/CRITICAL
findings fail the audit; Composer reports advisories at every severity.

`Container audits (manual during migration)` runs only on manual dispatch.
It retains Trivy HIGH/CRITICAL scans of production and development runtime
packages, including unfixed findings. Production uses the `runtime-base` target,
so private Nova credentials are not needed. This is a runtime package scan,
not a scan of the exact manually deployed production image.

PHP compiled from source can be missed by image CVE databases; the explicit
upstream release check and deployed-version monitor cover this gap. Upstream or
scanner failures fail checks rather than reporting a clean result. Existing
dependency advisories remain visible and can cause initially failing checks.
Dependency remediation may require framework upgrades; this tooling does not
automatically apply breaking updates.

Dependabot groups routine minor/patch Composer, npm, and Actions updates into
one cross-ecosystem maintenance PR, checked Mondays at 09:00 UTC. Major upgrades
are reviewed deliberately and are not proposed as routine version updates.
Security updates remain enabled independently of the weekly schedule and are
grouped per ecosystem; they can require additional PRs, including major fixes.
Docker proposals are paused during the server migration. Nova's registry uses
the Dependabot secret `NOVA_LICENSE_KEY`. No automatic merging or deployment is enabled.

The separate `Security email notifications` workflow runs trusted `main` code
only. It never checks out a PR SHA, consumes PR artifacts, or supplies email
credentials to PR checks. It emails on failure transitions, weekly Monday
reminders for scheduled failures, and recovery. Manual dispatch sends a test.
Security, application, and dependency-audit workflows feed the notifier; manual
container findings do not send routine email during migration. Recent trusted
workflow history is used for transition detection. Required
repository Actions secret: `SECURITY_RESEND_API_KEY` (sending-only Resend key).
Actions are SHA-pinned, tokens have read-only permissions, and checkout does not
persist Git credentials. Review workflow changes before merging them.

### Application regression checks and branch protection

`Application regression checks` builds/type-checks the three public applications,
builds admin and scanner assets, and runs public-app, camp-authentication and
Laravel/D1 regression tests. `Application regression gate`, `Secret history` and
`PHP release currency` are the required main-branch checks. SonarCloud remains
informational. Scheduled dependency advisories and manual container findings
remain visible separately, including lower-severity and OS findings.

PHP CI needs `NOVA_COMPOSER_AUTH` as an Actions secret and, for Dependabot PRs,
as a Dependabot secret. Its value is Composer's `http-basic` JSON for
`nova.laravel.com`. It is supplied only to the install step; application/test
execution receives no Nova licence credential. No private vendor archive is
published or saved in the public Actions cache. Untrusted forks do not receive
this credential and cannot pass the required PHP gate until the change is tested
on a trusted maintainer branch.

Clean admin image builds use a BuildKit secret, not a build argument:

```sh
# Populate COMPOSER_AUTH from your secure credential source, then:
docker build --secret id=composer_auth,env=COMPOSER_AUTH -f admin/docker/Dockerfile admin
```

The Docker context excludes local databases, generated config caches and nested
dependency folders. The admin targets the patched PHP 8.4 branch. The corrected
Nova account/key can download the pinned 5.10.1 release; newer Nova releases may
require renewed licence entitlement and are not silently substituted.

## Email and production monitoring

- Sender: `alert@vitalpredict.org`
- Recipient: `lubnik2005@gmail.com`
- Resend acceptance confirms submission, not inbox delivery; check spam or the
  provider dashboard if an expected alert is missing.

Production checks run independently of CI through `bratstvo-security.timer`
daily around 08:40 UTC. They inspect the running container's CLI/FPM versions,
container health, native upload-progress setting, and public login/health URLs.
They compare the deployed PHP branch against upstream, email on a changed
problem, remind after seven days, and send one recovery notice. State is written
only after Resend accepts the email, so delivery errors retry on the next run.

Installed server paths:

- `/opt/bratstvo-security/{runtime,monitor}.py` — root-owned trusted scripts.
- `/etc/bratstvo-security.env` — root-only `SECURITY_RESEND_API_KEY=...`.
- `/var/lib/bratstvo-security/state.json` — deduplication state.
- `/etc/systemd/system/bratstvo-security.{service,timer}` — service units.

The monitor needs Docker access (effectively root); it uses no production SSH
key in GitHub. Reinstall the scripts/units after changes and run:

```sh
ssh bratstvo 'systemctl daemon-reload && systemctl enable --now bratstvo-security.timer'
ssh bratstvo 'systemctl start bratstvo-security.service'
ssh bratstvo 'journalctl -u bratstvo-security.service -n 30 --no-pager'
ssh bratstvo 'systemctl list-timers bratstvo-security.timer --no-pager'
```

A failed email-provider credential cannot notify through that same provider;
monitor the systemd journal and GitHub notification job failures as well. GitHub
can suspend scheduled workflows in inactive public repositories; production's
systemd timer continues independently. CI schedules start only once these files
are pushed to the default branch. Configure branch rules to require checks and
review changes to `.github/`, `.githooks/`, and `scripts/security/`.
