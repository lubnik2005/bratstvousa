import { media } from '$lib/stores/media.svelte';
import { loadGsap } from './gsap';

interface CounterOptions {
	value: number;
	suffix?: string;
	duration?: number;
}

/**
 * Svelte action: counts up to `value` when the element scrolls into view.
 * Uses ScrollTrigger for the trigger. Under reduced-motion (or no gsap) it
 * writes the final value immediately.
 */
export function counter(node: HTMLElement, options: CounterOptions) {
	const suffix = options.suffix ?? '';

	function setText(n: number) {
		node.textContent = `${Math.round(n)}${suffix}`;
	}

	if (media.reducedMotion) {
		setText(options.value);
		return {
			update(o: CounterOptions) {
				node.textContent = `${Math.round(o.value)}${o.suffix ?? ''}`;
			}
		};
	}

	setText(0);
	let cancelled = false;
	const state = { n: 0 };

	loadGsap().then(({ gsap }) => {
		if (cancelled) return;
		gsap.to(state, {
			n: options.value,
			duration: options.duration ?? 1.8,
			ease: 'power2.out',
			onUpdate: () => setText(state.n),
			scrollTrigger: {
				trigger: node,
				start: 'top 85%',
				once: true
			}
		});
	});

	return {
		destroy() {
			cancelled = true;
		}
	};
}
