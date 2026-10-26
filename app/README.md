# Bratstvo USA Website

The public Bratstvo USA website is a SvelteKit application using TypeScript, Drizzle, Cloudflare D1 (SQLite), Paraglide, and Cloudflare R2 for media.

## Development

```bash
npm install
npm run dev
```

Run quality checks before submitting changes:

```bash
npm run format
npm run lint
npm run check
npm run test:unit -- --run
```

## Database

The schema is in `src/lib/server/db/schema.ts`. Development uses local emulated Cloudflare bindings by default. Apply migrations to the local D1 database:

```bash
npm run db:migrate:local
```

For a mobile preview with fictional events and churches, start the development server once, then run `node scripts/seed-mobile-preview.mjs`. This seeds only the local Wrangler database and leaves populated tables unchanged.

`npm run dev:remote` connects development to production bindings; do not use it for local demo data.

## Related services

- `../admin` is the Laravel Nova content-admin application.
- `../camp-paradise` and `../camp-paradise-web` support Camp Paradise.

See `AGENTS.md` for project conventions and available commands.
