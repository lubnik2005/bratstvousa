// Build-time script: extract scripture refs from the beliefs page, fetch only
// the referenced verses from the Synodal translation, and write a curated JSON.
//
// Usage: node scripts/build-beliefs-verses.mjs
//
// Network is used ONLY here (build time). The app runtime stays offline.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { register } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load the TS parser via tsx/esbuild-register if available; otherwise the
// caller should run this with `npx tsx`. We import dynamically.
const { findRefGroups, citationKey } = await import(resolve(ROOT, 'src/lib/scripture/parse.ts'));

const PAGE = resolve(ROOT, 'src/routes/beliefs/+page.svelte');
const OUT = resolve(ROOT, 'src/lib/data/synodal-beliefs.json');

const GETBIBLE = (bookNr, chapter) =>
	`https://api.getbible.net/v2/synodal/${bookNr}/${chapter}.json`;

function stripHtml(s) {
	// remove the <script>...</script> block and all tags, decode a few entities
	const noScript = s.replace(/<script[\s\S]*?<\/script>/g, ' ');
	const noStyle = noScript.replace(/<style[\s\S]*?<\/style>/g, ' ');
	const noTags = noStyle.replace(/<[^>]+>/g, ' ');
	return noTags
		.replace(/&nbsp;/g, ' ')
		.replace(/&laquo;|&raquo;/g, '"')
		.replace(/&mdash;/g, '—')
		.replace(/&amp;/g, '&');
}

async function fetchChapter(bookNr, chapter) {
	const url = GETBIBLE(bookNr, chapter);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
	const json = await res.json();
	const map = new Map();
	for (const v of json.verses) map.set(v.verse, v.text.trim());
	return map;
}

async function main() {
	const src = readFileSync(PAGE, 'utf8');
	const text = stripHtml(src);
	const groups = findRefGroups(text);

	const allCitations = groups.flatMap((g) => g.citations);
	const unparsed = groups.flatMap((g) => g.unparsed);

	console.log(`Found ${groups.length} ref groups, ${allCitations.length} citations.`);
	if (unparsed.length) {
		console.log(`\n⚠️  ${unparsed.length} UNPARSED fragments (review needed):`);
		for (const u of [...new Set(unparsed)]) console.log(`   • "${u}"`);
	}

	// Collect chapters to fetch: Map "bookNr:chapter" -> Set(verses|'*')
	const chapters = new Map();
	for (const c of allCitations) {
		const k = `${c.bookNr}:${c.chapter}`;
		if (!chapters.has(k)) chapters.set(k, new Set());
		if (c.wholeChapter) chapters.get(k).add('*');
		else for (const v of c.verses) chapters.get(k).add(v);
	}

	console.log(`\nFetching ${chapters.size} unique chapters from getbible.net…`);
	const chapterText = new Map(); // "bookNr:chapter" -> Map(verse->text)
	for (const key of chapters.keys()) {
		const [bookNr, chapter] = key.split(':').map(Number);
		try {
			const m = await fetchChapter(bookNr, chapter);
			chapterText.set(key, m);
		} catch (e) {
			console.log(`   ✗ ${key}: ${e.message}`);
		}
	}

	// Build output: citationKey -> { ref, text }
	const out = {};
	for (const c of allCitations) {
		const key = citationKey(c);
		if (key in out) continue;
		const chKey = `${c.bookNr}:${c.chapter}`;
		const verseMap = chapterText.get(chKey);
		if (!verseMap) continue;
		let verses;
		if (c.wholeChapter) verses = [...verseMap.keys()].sort((a, b) => a - b);
		else verses = c.verses;
		const parts = [];
		for (const v of verses) {
			const t = verseMap.get(v);
			if (t) parts.push(`${v} ${t}`);
		}
		if (!parts.length) continue;
		const ref = c.wholeChapter
			? `${c.bookName} ${c.chapter}`
			: `${c.bookName} ${c.chapter}:${c.verses.join(',')}`;
		out[key] = { ref, text: parts.join(' ') };
	}

	writeFileSync(OUT, JSON.stringify(out, null, '\t') + '\n', 'utf8');
	console.log(`\n✓ Wrote ${Object.keys(out).length} verse entries to ${OUT}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
