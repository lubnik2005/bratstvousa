import { ABBREV_TO_NR, BOOKS } from './books';

// A single parsed citation, e.g. "1 Иоан. 5, 7" or "16: 8-11, 13-14".
export interface Citation {
	raw: string; // exact source substring for this citation (for wrapping)
	bookNr: number;
	bookName: string;
	chapter: number;
	verses: number[]; // expanded, e.g. [8,9,10,11,13,14]; empty => whole chapter
	wholeChapter: boolean;
}

// A parenthetical group of citations found in the text.
export interface RefGroup {
	raw: string; // full text inside parentheses (without the parens)
	start: number; // index in source of "("
	end: number; // index in source just after ")"
	citations: Citation[];
	unparsed: string[]; // citation fragments we could not parse
}

// Build a canonical key for a citation, used to look up verse text.
export function citationKey(c: Citation): string {
	if (c.wholeChapter) return `${c.bookNr}:${c.chapter}`;
	return `${c.bookNr}:${c.chapter}:${c.verses.join(',')}`;
}

// Normalize OCR noise inside a reference group WITHOUT touching letters:
// - collapse spaces that split numbers ("14,2 6" -> "14,26", "2 , 2" -> "2,2")
// - drop stray "?"
// - unify separators
function normalizeGroup(s: string): string {
	let out = s;
	// collapse newlines and runs of whitespace to single spaces
	out = out.replace(/\s+/g, ' ');
	// OCR fix: a bare "Кор." (no numeric prefix, no carry-forward) is ambiguous.
	// The only occurrence in this document is "Кор. 4, 13", the classic
	// "веровах, темже возглаголах" verse = 2 Кор. 4:13.
	out = out.replace(/(^|[^123])Кор\. 4, 13/g, '$12 Кор. 4, 13');
	out = out.replace(/\?/g, '');
	// Cyrillic letters used as digits by OCR: З->3, О is left alone (too risky)
	out = out.replace(/З/g, '3').replace(/з(?=\s*[,;:]|\s*-|\s*гл|\s*ст|\s*$)/g, '3');
	// join spaced-out book abbreviations: a single Cyrillic letter followed by
	// a space then more Cyrillic letters ("Д еян" -> "Деян", "От кр" -> "Откр",
	// "1 Ф ес" -> "1 Фес"). Run twice to catch "Ие р" style leftovers.
	const joinSplit = (t: string): string =>
		t.replace(/([А-ЯЁ])\s+([а-яё]{1,4})(?=[\s.,:;]|$)/g, '$1$2');
	out = joinSplit(joinSplit(out));
	// space before a dot that belongs to an abbrev ("Ис ." -> "Ис.")
	out = out.replace(/([А-Яа-яЁё])\s+\./g, '$1.');
	// dot used as chapter/verse separator between two numbers ("5. 18" -> "5, 18")
	out = out.replace(/(\d)\s*\.\s*(\d)/g, '$1, $2');
	// space(s) around commas/colons
	out = out.replace(/\s*,\s*/g, ', ');
	out = out.replace(/\s*:\s*/g, ':');
	// digit space digit (split number) -> join
	out = out.replace(/(\d)\s+(\d)/g, '$1$2');
	// "гл." and "ст." markers normalized with surrounding spaces.
	// Note: JS \b does not treat Cyrillic as word chars, so match explicitly.
	out = out.replace(/\s*гл\.?/g, ' гл');
	out = out.replace(/\s*ст\.?/g, ' ст');
	return out.trim();
}

// Lookup a book abbreviation (already lowercased, dot-stripped) to nr.
function resolveBook(abbrevRaw: string): number | undefined {
	const key = abbrevRaw.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
	if (key in ABBREV_TO_NR) return ABBREV_TO_NR[key];
	// try without spaces (e.g. "1иоан")
	const nospace = key.replace(/\s+/g, '');
	if (nospace in ABBREV_TO_NR) return ABBREV_TO_NR[nospace];
	return undefined;
}

// Expand a verse spec like "8-11, 13-14" into [8,9,10,11,13,14].
function expandVerses(spec: string): number[] {
	const out: number[] = [];
	for (const part of spec.split(',')) {
		const p = part.trim();
		if (!p) continue;
		const range = p.match(/^(\d+)\s*-\s*(\d+)$/);
		if (range) {
			const a = parseInt(range[1], 10);
			const b = parseInt(range[2], 10);
			for (let v = a; v <= b; v++) out.push(v);
		} else {
			const n = parseInt(p, 10);
			if (!Number.isNaN(n)) out.push(n);
		}
	}
	return out;
}

export { normalizeGroup, resolveBook, expandVerses, BOOKS };

// Detect the leading book portion of a citation: an optional numeric prefix
// (1/2/3) followed by Cyrillic letters, dots and internal spaces, up to the
// first chapter digit. Handles multi-token abbrevs like "И. Нав." / "П. Песн."
// and OCR-split ones like "От кр." / "Ие р.".
const BOOK_TOKEN = /^\s*((?:[1-3]\s*)?[А-Яа-яЁё][А-Яа-яЁё.\s]*?)\s*(?=\d)/;

// Parse one parenthetical group's inner text into citations, with book
// carry-forward across ';'-separated citations.
export function parseGroup(inner: string): { citations: Citation[]; unparsed: string[] } {
	const norm = normalizeGroup(inner);
	const citations: Citation[] = [];
	const unparsed: string[] = [];
	let lastBookNr: number | undefined;
	let lastBookName = '';

	for (const rawCitation of norm.split(';')) {
		const frag = rawCitation.trim();
		if (!frag) continue;
		// false positives like "39 книг" / "27 книг" (not scripture refs)
		if (/книг/i.test(frag)) continue;

		let rest = frag;
		let bookNr = lastBookNr;
		let bookName = lastBookName;

		const bm = rest.match(BOOK_TOKEN);
		if (bm) {
			const candidate = bm[1];
			const resolved = resolveBook(candidate);
			if (resolved !== undefined) {
				bookNr = resolved;
				bookName = BOOKS.find((b) => b.nr === resolved)?.name ?? candidate;
				rest = rest.slice(bm[0].length);
			}
		}

		if (bookNr === undefined) {
			unparsed.push(frag);
			continue;
		}

		const book = BOOKS.find((b) => b.nr === bookNr);
		const singleChapter = book?.singleChapter ?? false;

		// book recognized but nothing else in this fragment (e.g. "Мал" from
		// "Мал; 2, 7-9"): carry the book forward, next fragment supplies ch/verse
		if (!/\d/.test(rest)) {
			lastBookNr = bookNr;
			lastBookName = bookName;
			continue;
		}

		// whole-chapter markers: "1 и 2 гл", "11 гл", "гл"
		// (JS \b does not treat Cyrillic as a word boundary, so match plainly)
		if (/гл/.test(rest)) {
			const chapters = (rest.match(/\d+/g) ?? []).map((n) => parseInt(n, 10));
			for (const ch of chapters.length ? chapters : [1]) {
				citations.push({
					raw: frag,
					bookNr,
					bookName,
					chapter: ch,
					verses: [],
					wholeChapter: true
				});
			}
			lastBookNr = bookNr;
			lastBookName = bookName;
			continue;
		}

		rest = rest.replace(/\bст\b/g, '').trim();

		let chapter: number;
		let verseSpec: string;

		if (singleChapter) {
			// verse-only citation, e.g. "Иуды 6" or "24-25"
			chapter = 1;
			verseSpec = rest;
		} else {
			// chapter separated by ':' or ',' from verses
			const colon = rest.match(/^(\d+)\s*:\s*(.+)$/);
			const comma = rest.match(/^(\d+)\s*,\s*(.+)$/);
			const chOnly = rest.match(/^(\d+)\s*$/);
			if (colon) {
				chapter = parseInt(colon[1], 10);
				verseSpec = colon[2];
			} else if (comma) {
				chapter = parseInt(comma[1], 10);
				verseSpec = comma[2];
			} else if (chOnly) {
				chapter = parseInt(chOnly[1], 10);
				verseSpec = '';
			} else {
				unparsed.push(frag);
				lastBookNr = bookNr;
				lastBookName = bookName;
				continue;
			}
		}

		const verses = expandVerses(verseSpec);
		citations.push({
			raw: frag,
			bookNr,
			bookName,
			chapter,
			verses,
			wholeChapter: verses.length === 0
		});
		lastBookNr = bookNr;
		lastBookName = bookName;
	}

	return { citations, unparsed };
}

// Scan a plain-text string for parenthetical groups that contain digits
// (i.e. likely scripture refs) and parse each.
export function findRefGroups(text: string): RefGroup[] {
	const groups: RefGroup[] = [];
	const re = /\(([^()]*\d[^()]*)\)/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(text)) !== null) {
		const inner = m[1];
		// require a Cyrillic letter to avoid pure numbers like "(2)"
		if (!/[А-Яа-яЁё]/.test(inner)) continue;
		const { citations, unparsed } = parseGroup(inner);
		if (citations.length === 0 && unparsed.length === 0) continue;
		groups.push({
			raw: inner,
			start: m.index,
			end: m.index + m[0].length,
			citations,
			unparsed
		});
	}
	return groups;
}
