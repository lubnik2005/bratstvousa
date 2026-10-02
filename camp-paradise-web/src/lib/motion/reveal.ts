import type { Action } from 'svelte/action';
import { media } from '$lib/stores/media.svelte';

interface RevealOptions {
	y?: number;
	delay?: number;
	duration?: number;
	once?: boolean;
}

// Scroll-triggered reveal. Falls back to instantly-visible when reduced motion
// is requested or when IntersectionObserver is unavailable.
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options) => {
	const opts = { y: 24, delay: 0, duration: 0.7, once: true, ...options };

	if (media.reducedMotion || typeof IntersectionObserver === 'undefined') {
		node.style.opacity = '1';
		node.style.transform = 'none';
		return;
	}

	node.style.opacity = '0';
	node.style.transform = `translateY(${opts.y}px)`;
	node.style.willChange = 'opacity, transform';

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				void run();
				if (opts.once) io.unobserve(node);
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
	);

	async function run() {
		const { gsap } = await import('gsap');
		gsap.to(node, {
			opacity: 1,
			y: 0,
			duration: opts.duration,
			delay: opts.delay,
			ease: 'power3.out',
			onComplete: () => (node.style.willChange = 'auto')
		});
	}

	io.observe(node);

	return { destroy: () => io.disconnect() };
};
