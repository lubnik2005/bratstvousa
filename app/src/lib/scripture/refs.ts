// Svelte action + helpers to turn plain-text scripture references inside a
// rendered content block into hover cards showing the Synodal (1876) verse text.
//
// The referenced verses are looked up from a curated map built at build time
// (see scripts/build-beliefs-verses.mjs) keyed by citationKey().

import { findRefGroups, citationKey } from './parse';
import type { RefGroup } from './parse';

export interface VerseEntry {
	ref: string;
	text: string;
}

export type VerseMap = Record<string, VerseEntry>;

interface RefsOptions {
	verses: VerseMap;
}

// Build the inner HTML for a hover card given a parsed ref group.
function cardHtml(group: RefGroup, verses: VerseMap): string {
	const blocks: string[] = [];
	for (const c of group.citations) {
		const entry = verses[citationKey(c)];
		if (!entry) continue;
		blocks.push(
			`<div class="ref-card-item">` +
				`<div class="ref-card-ref">${escapeHtml(entry.ref)}</div>` +
				`<div class="ref-card-text">${escapeHtml(entry.text)}</div>` +
				`</div>`
		);
	}
	return blocks.join('');
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

// Walk text nodes under `root` and wrap each parenthetical scripture group in a
// <span class="ref-group"> carrying the verse text as a data attribute. Only
// groups with at least one resolvable verse are wrapped.
function wrapRefsInElement(root: HTMLElement, verses: VerseMap): void {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			const parent = node.parentElement;
			if (!parent) return NodeFilter.FILTER_REJECT;
			// skip headings and already-processed refs
			if (parent.closest('.ref-group')) return NodeFilter.FILTER_REJECT;
			if (parent.closest('h1,h2,h3,h4,h5,h6')) return NodeFilter.FILTER_REJECT;
			if (!node.textContent || !node.textContent.includes('(')) {
				return NodeFilter.FILTER_REJECT;
			}
			return NodeFilter.FILTER_ACCEPT;
		}
	});

	const targets: Text[] = [];
	let n: Node | null;
	while ((n = walker.nextNode())) targets.push(n as Text);

	for (const textNode of targets) {
		const text = textNode.textContent ?? '';
		const groups = findRefGroups(text).filter((g) =>
			g.citations.some((c) => verses[citationKey(c)])
		);
		if (!groups.length) continue;

		const frag = document.createDocumentFragment();
		let cursor = 0;
		for (const g of groups) {
			if (g.start > cursor) {
				frag.appendChild(document.createTextNode(text.slice(cursor, g.start)));
			}
			const span = document.createElement('span');
			span.className = 'ref-group';
			span.textContent = text.slice(g.start, g.end);
			span.dataset.card = cardHtml(g, verses);
			frag.appendChild(span);
			cursor = g.end;
		}
		if (cursor < text.length) {
			frag.appendChild(document.createTextNode(text.slice(cursor)));
		}
		textNode.parentNode?.replaceChild(frag, textNode);
	}
}

// Svelte action: wraps refs on mount and manages a single shared hover card.
export function scriptureRefs(node: HTMLElement, options: RefsOptions) {
	let verses = options.verses;
	wrapRefsInElement(node, verses);

	const card = document.createElement('div');
	card.className = 'ref-hovercard';
	card.setAttribute('role', 'tooltip');
	card.hidden = true;
	document.body.appendChild(card);

	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	function positionCard(target: HTMLElement) {
		const r = target.getBoundingClientRect();
		const margin = 8;
		card.style.maxWidth = Math.min(420, window.innerWidth - 2 * margin) + 'px';
		card.hidden = false;
		const cardRect = card.getBoundingClientRect();
		const top = r.bottom + window.scrollY + 6;
		let left = r.left + window.scrollX;
		if (left + cardRect.width > window.scrollX + window.innerWidth - margin) {
			left = window.scrollX + window.innerWidth - cardRect.width - margin;
		}
		if (left < window.scrollX + margin) left = window.scrollX + margin;
		card.style.top = top + 'px';
		card.style.left = left + 'px';
	}

	function show(target: HTMLElement) {
		if (hideTimer) clearTimeout(hideTimer);
		const html = target.dataset.card;
		if (!html) return;
		card.innerHTML = html;
		positionCard(target);
	}

	function scheduleHide() {
		hideTimer = setTimeout(() => {
			card.hidden = true;
		}, 120);
	}

	function onOver(e: Event) {
		const t = (e.target as HTMLElement)?.closest?.('.ref-group');
		if (t) show(t as HTMLElement);
	}
	function onOut(e: Event) {
		const t = (e.target as HTMLElement)?.closest?.('.ref-group');
		if (t) scheduleHide();
	}
	function onFocusIn(e: Event) {
		const t = (e.target as HTMLElement)?.closest?.('.ref-group');
		if (t) show(t as HTMLElement);
	}
	function onFocusOut() {
		scheduleHide();
	}

	card.addEventListener('mouseenter', () => {
		if (hideTimer) clearTimeout(hideTimer);
	});
	card.addEventListener('mouseleave', scheduleHide);

	node.addEventListener('mouseover', onOver);
	node.addEventListener('mouseout', onOut);
	node.addEventListener('focusin', onFocusIn);
	node.addEventListener('focusout', onFocusOut);

	return {
		update(next: RefsOptions) {
			verses = next.verses;
		},
		destroy() {
			node.removeEventListener('mouseover', onOver);
			node.removeEventListener('mouseout', onOut);
			node.removeEventListener('focusin', onFocusIn);
			node.removeEventListener('focusout', onFocusOut);
			card.remove();
		}
	};
}
