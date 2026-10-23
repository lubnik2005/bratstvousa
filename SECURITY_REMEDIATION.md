# Dependency security remediation — 2026-10-22

## Scope and exposure inventory

Alert counts are advisory/package occurrences, not distinct exploitable bugs.
The same dependency appears in multiple lockfiles. Package-manager runtime/dev
labels are not a production reachability assessment.

| Component                  | Deployment/use                                           | Findings and disposition                                                                                                                                                                                                                          |
| -------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin/composer.lock`      | Internet-facing Nova admin, PHP-FPM on `23.92.25.92`     | Deployed lockfile versions were inspected. AWS SDK/JMESPath, media handling, YAML and PsySH updates stay within existing package majors. Laravel/Nova remain on their existing versions.                                                          |
| `admin/package-lock.json`  | Admin asset compilation and local Vite server            | Update Axios, PostCSS, Vite and compatible transitive packages. Built assets are verified. Tailwind 3 migration remains separate. Nova's own bundled frontend dependencies are separate from this npm manifest.                                   |
| `app/package-lock.json`    | Svelte application configured for Cloudflare Pages/D1/R2 | Update SvelteKit within v2, Svelte within v5, Drizzle, Vite and Vitest. Verify application compilation and SQLite-backed Zeffy tests. Exact currently deployed Cloudflare dependency versions still require comparison with the deployment build. |
| Root `package-lock.json`   | Shared Handlebars/build tooling; not the admin runtime   | Update Handlebars within v4 and compatible dependencies. Do not remove it without confirming all consumers.                                                                                                                                       |
| `camp-paradise*` lockfiles | Separate Cloudflare applications                         | Track separately; these packages and their active email changes are not included in this remediation batch.                                                                                                                                       |
| Docker images              | OS packages, native libraries, development headers       | Trivy findings remain visible, including vendor-deferred/unfixed findings. These need package-by-package applicability review; image header packages do not imply that the corresponding kernel runs inside the container.                        |

### Admin dependency batch

Tracked separately in [PR #8](https://github.com/lubnik2005/bratstvousa/pull/8).

Key lockfile changes:

- AWS SDK `3.343.3` → `3.402.0`.
- JMESPath `2.8.0` → `2.9.2`, addressing the critical code-injection advisory.
- Spatie Media Library `11.12.9` → `11.23.9`.
- Symfony YAML `7.2.6` → `7.4.21`.
- PsySH `0.12.8` → `0.12.24`.
- PHPUnit `11.5.19` → `11.5.57` and necessary test dependencies.
- Vite `6.4.5`, compatible Laravel Vite plugin, Axios and PostCSS updates.

The workstation's original `vendor/` did not match the committed/deployed
dependencies. Verification used an isolated copy of the application, seeded
with the already installed production dependencies, followed by a lockfile
install. This did not modify production. A fresh Nova download using the local
Composer credential was rejected by the licence server; fix that credential or
licence entitlement before relying on a clean image rebuild from scratch.

Verification: package discovery, PHPUnit (2 tests / 3 assertions), PHP extension
requirements, targeted Pint formatting, and admin Vite asset build.

Composer advisory occurrences fall from **18 across 8 packages** to **7 across
2 packages** (Laravel and Saloon). Admin npm findings fall from **23** to **7**
(5 high, 2 moderate; no critical). Counts are a snapshot and can change when
advisory databases change.

### Public application and shared-tooling batch

- SvelteKit `2.70.3`, Svelte `5.57.2`, Vite `6.4.5`, Vitest `4.1.12`.
- Drizzle ORM `0.45.4` and matching-generation Drizzle Kit `0.31.11`.
- Explicit Cloudflare binding types and the supported Drizzle `eq` import.
- A narrow `@lix-js/client` override moves its exact `sha.js` dependency from
  vulnerable `2.4.11` to compatible patch `2.4.12`. Remove the override when
  replacing the legacy Paraglide/Lix integration.
- Compatible formatter plugins for the refreshed Prettier/Svelte versions.
- Unit tests skip legacy translation compilation to avoid its lingering
  background network handles under the upgraded test runner.
- Shared Handlebars moves to the patched v4 release line.

Verification: public production build, type checking (zero errors), 41 unit
tests, and formatting of changed source/configuration. Project-wide lint still
reports formatting debt in unrelated files; it is not represented as passing.
No database migration or schema generation is run by these dependency updates.

The public npm lockfile has **23** remaining findings (12 high, 8 moderate,
3 low; no critical). Root npm has **3 low** findings and no high/critical.
Audit totals do not equal GitHub alert totals and do not establish exploitability.

## Prioritized remaining work

1. **Laravel/L1/Saloon migration.** Move to a supported, patched Laravel branch
   (the current advisory set requires at least Laravel 12.69), verify Nova and
   all third-party resources, and adapt the local L1 package to Saloon 4.
   L1 currently constrains Illuminate to 10/11 and Saloon to v2. Its reviewed
   connector uses configured Cloudflare URLs, relative D1 endpoints and bearer
   token authentication; no application use of `AccessTokenAuthenticator` or
   Saloon fixtures was found. That narrows known attack paths but does not clear
   the advisories. Add D1 connector/parameter-binding and authenticated Nova
   resource regression coverage before this migration.
2. **Replace deprecated Paraglide SvelteKit/Lix integration.** Its devalue 4 and
   old SDK dependency chain retain high-severity findings. Avoid a forced
   devalue-major override: migrate to maintained Paraglide and verify locale
   routing, serialization and SSR output.
3. **Tailwind 3 → 4 and remaining development-tool dependencies.** Verify CSS
   output and responsive pages; do not use `npm audit fix --force` as a substitute
   for this migration. Review the old Drizzle Kit esbuild loader and ESLint
   parser chains separately.
4. **Camp application batches.** Apply equivalent compatible upgrades to each
   camp app, with reservation/login/email checks and independent deployments.
5. **Container/host review.** Rebuild and classify OS findings against the exact
   deployed image. Update the workstation's NixOS-managed PHP/Node separately.
   Keep Node upgrades on a deliberately selected supported LTS release rather
   than automatically merging Node 25 proposals.

## Release process and acceptance

Merge and deploy reviewed dependency batches independently. For the admin,
retain a rollback image and consistent SQLite backup, rebuild/install from the
patched lockfile, and verify login, authorized D1-backed resources, uploads and
check-in flows. For Pages, build a preview deployment and verify registration,
locale routing, email and Zeffy flows before promoting it.

These source/lockfile changes alone do not update deployed dependencies.
Keep audits failing for the unresolved findings. Do not blanket-dismiss alerts
or commit a vulnerability baseline just to get green checks. Any future accepted
exception needs its exact advisory, deployed applicability evidence, owner and
expiry/review date; secret scanning and PHP currency checks stay enforced.

## Deployment record — 2026-10-23 UTC

Both remediation PRs were merged and released:

| Release                                                               | Source    | Active deployment                                       | Rollback retained                                       |
| --------------------------------------------------------------------- | --------- | ------------------------------------------------------- | ------------------------------------------------------- |
| Admin, [PR #8](https://github.com/lubnik2005/bratstvousa/pull/8)      | `6c40755` | `bratstvousa-admin:deps-6c40755`, also tagged `:amd64`  | `bratstvousa-admin:pre-deps-6c40755`                    |
| Public app, [PR #9](https://github.com/lubnik2005/bratstvousa/pull/9) | `04c7ff7` | Pages deployment `a7fbea59-705f-4365-b2eb-ab406c006cd5` | Pages deployment `89da4518-e446-4d10-90a5-93b6ae3bd412` |

The admin build reused the installed licensed Nova package and retained deployed
application code/configuration while installing the merged dependency lockfile
and rebuilding assets. Old vendor files and old hashed build assets were removed
before copying their replacements. The build context is retained on the host at
`/root/admin/deps-6c40755`. A consistent SQLite backup is retained in the data
volume as `plumbing.pre-deps-6c40755.sqlite`.

Admin release checks passed: PHP-FPM 8.4.27, nginx/FPM configuration, container
health, authenticated login/dashboard and youth-event/camp-registration resource
reads, parameterized reads against plumbing and both D1 connections, SQLite
`quick_check`, and the production security monitor. Installed package versions
were checked through Composer's runtime metadata, not only the lockfile.

The public app was built in a clean isolated checkout. Build-generated Paraglide
bindings must exist before type checking a fresh checkout; running the build
first provides them. The clean build passed 41 unit tests and type checking with
zero errors (36 warnings). Preview deployment
`https://2811c079.bratstvousa.pages.dev` was tested before uploading the same
artifacts to production; the merged app source was verified identical to the
preview source.

Headless Chromium checks passed on production for Russian/English/Ukrainian
pages, news, churches, calendar, Bible courses and both camp-registration pages:
HTTP 200 with no page JavaScript errors. Blank production registrations were
rejected with Turnstile action status 403; an invalid Zeffy webhook signature
returned HTTP 400. Production environment secrets remained configured. These
checks did not submit real registrations, send registration emails, create
payment records, or apply schema changes. Preview uses the existing production
D1 binding, so preview validation was limited to reads and rejected submissions.

The remaining Laravel/Saloon, Paraglide, Tailwind, camp-project and OS-package
findings above still require remediation. A successful deployment does not clear
those findings. GitHub's dependency graph/alert totals can refresh separately;
use the merged lockfiles and installed runtime versions to verify this release.

## Follow-up hardening — 2026-10-23

The next remediation replaces the remaining vulnerable application dependency
chains, without image cleanup, disk management or backup/storage changes:

- Laravel 12.70.1, Saloon 4.5, Auditing 14 and compatible Nova documentation/settings.
  L1 now uses Laravel 12 schema APIs and current Saloon response types. Regression
  tests cover separate SQL bindings/bearer auth, D1 failures, quoted schema names,
  guest access and secure response headers.
- Admin HTTPS responses add HSTS, nosniff, framing/referrer controls and a narrow
  CSP for framing/base URLs. Same-origin camera permission remains enabled for
  the scanner; inline scripts/editors are not blocked by a speculative full CSP.
- The main site moves to maintained Paraglide JS 2, retaining Russian default
  URLs and English/Ukrainian prefixes, with parallel-request locale-isolation
  tests. Unused Tailwind dependencies/configuration are removed: this site uses
  Bootstrap/Sass and had no Tailwind directives or CSS entry point.
- Admin styling moves to Tailwind 4. The scanner switches from obsolete Mix and
  a missing local Nova devtool dependency to Vite/Vue, retaining versioned Nova
  assets, external Nova-provided Vue, camera behavior and third-party notices.
- Both camp applications receive patched framework/dependency versions. Camp
  login codes use Web Crypto instead of Math.random; tests exercise hashed code
  storage, normalization/rate limits, expiry, five-attempt lockout, single-use
  redemption and password verification using isolated SQLite.
- The static camp site's existing optimized media are fetched unchanged as build
  inputs. No media is regenerated, removed or migrated. Its public build-time
  configuration is separate from server secrets.
- Application build/test/type-check CI and required main-branch checks supplement
  advisory scanning. Nova credentials are private step-scoped secrets; clean
  image builds now succeed from licensed downloads without seeding old vendor files.

At validation, Composer has zero advisories; admin and scanner npm manifests have
zero findings. No npm manifest has high or critical findings. Remaining low and
moderate findings are retained for review (primarily the SvelteKit 2/adapter 7
cookie dependency and the Drizzle Kit esbuild-loader development chain). OS image
findings remain out of scope for the requested server migration.

### Follow-up release verification

[PR #11](https://github.com/lubnik2005/bratstvousa/pull/11) was merged as
`31bf396`. Deployment configuration follow-up `7181dfd` also allows the camp
contact form on its two production custom domains, retaining hostname validation.

| Application | Released artifact | Previous release retained |
| --- | --- | --- |
| Admin | `bratstvousa-admin:hardening-1cb12fd` (also `:amd64`) | `bratstvousa-admin:pre-hardening-31bf396` |
| Main site | Pages `c00d6745-2f7f-423a-a702-9438eefa01f4` | `a7fbea59-705f-4365-b2eb-ab406c006cd5` |
| Camp registration | Pages `0228a333-64f6-401a-8d22-cccbc7e55d69` | `ce8b2d90-7b86-42d6-8c22-5a125b177020` |
| Camp website | Pages `1b2b7414-9ca0-4b6e-b665-737129299eaf` | `d50818f2-890a-4a2a-8444-09201aef38f6` |

GitHub application regression checks pass for all five Node builds and licensed
Laravel tests; Composer and all high/critical npm audit gates pass. Sonar analysis,
secret scanning and PHP currency checks pass. Only the explicitly out-of-scope
container OS scans remain red. The source fix also publishes Nova's frontend
assets during clean builds, and tests now require the login page to actually
render successfully, not merely return security headers.

The admin was tested in isolated browser staging using a copied plumbing database
and no scheduler. Authenticated D1-backed resource reads and scanner fake-camera
start/stop passed with no browser errors. The same checks passed after deployment;
runtime metadata confirms Laravel 12.70.1 / Saloon 4.5 / Nova 5.10.1. Both D1
connections and plumbing accept parameterized reads. The new security headers
are present on HTTPS responses and monitoring passes.

All three Pages builds were tested as previews and deployed with their existing
production bindings/secrets. Production browser checks cover the main site's
three locales, camp account/camps/map pages, and camp website contact/mission/
gallery pages, with no page JavaScript errors. Existing optimized media were
reused unchanged. No schema migration, image cleanup, disk maintenance, storage
migration or automated-backup configuration was performed. A consistent release
rollback snapshot is retained as `plumbing.pre-hardening-31bf396.sqlite` in the
admin's data volume.
