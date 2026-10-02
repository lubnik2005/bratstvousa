import { media } from '$lib/stores/media.svelte';
import { loadGsap } from './gsap';

interface SplitOptions {
	/** stagger between words, seconds */
	stagger?: number;
	/** initial delay, seconds */
	delay?: number;
}

/**
 * Svelte action that splits an element's text into word spans and reveals them
 * with a staggered rise-in. Falls back to plain text (no animation) under
 * reduced-motion. Preserves the original text for accessibility by keeping it
 * as the element's textContent source before splitting.
 */
export function splitReveal(node: HTMLElement, options: SplitOptions = {}) {
	const { stagger = 0.08, delay = 0.1 } = options;

	if (media.reducedMotion) {
		return {};
	}

	const original = node.textContent ?? '';
	const words = original.split(/(\s+)/);
	node.textContent = '';
	const spans: HTMLSpanElement[] = [];

	for (const w of words) {
		if (/^\s+$/.test(w)) {
			node.appendChild(document.createTextNode(w));
			continue;
		}
		const outer = document.createElement('span');
		outer.style.display = 'inline-block';
		outer.style.overflow = 'hidden';
		outer.style.verticalAlign = 'top';
		const inner = document.createElement('span');
		inner.style.display = 'inline-block';
		inner.style.willChange = 'transform, opacity';
		inner.textContent = w;
		outer.appendChild(inner);
		node.appendChild(outer);
		spans.push(inner);
	}

	let cancelled = false;
	loadGsap().then(({ gsap }) => {
		if (cancelled) return;
		gsap.from(spans, {
			yPercent: 120,
			opacity: 0,
			duration: 0.9,
			ease: 'expo.out',
			stagger,
			delay
		});
	});

	return {
		destroy() {
			cancelled = true;
			node.textContent = original;
		}
	};
}
