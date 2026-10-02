// SSR-safe lazy loader for GSAP + ScrollTrigger. Import returns the same
// singletons on subsequent calls. Never import gsap at module top-level in
// components that render during SSR.
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

let cached: { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType } | null = null;

export async function loadGsap() {
	if (cached) return cached;
	const [{ gsap }, { ScrollTrigger }] = await Promise.all([
		import('gsap'),
		import('gsap/ScrollTrigger')
	]);
	gsap.registerPlugin(ScrollTrigger);
	cached = { gsap, ScrollTrigger };
	return cached;
}
