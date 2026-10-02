import { browser } from '$app/environment';

// Reactive viewport helpers backed by Svelte 5 runes.
// `isMobile` drives the two-experience layout switch at the lg breakpoint (1024px).

const MOBILE_QUERY = '(max-width: 1023px)';
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

class MediaState {
	isMobile = $state(false);
	reducedMotion = $state(false);
	ready = $state(false);

	constructor() {
		if (!browser) return;
		const mq = window.matchMedia(MOBILE_QUERY);
		const rm = window.matchMedia(MOTION_QUERY);
		this.isMobile = mq.matches;
		this.reducedMotion = rm.matches;
		this.ready = true;
		mq.addEventListener('change', (e) => (this.isMobile = e.matches));
		rm.addEventListener('change', (e) => (this.reducedMotion = e.matches));
	}
}

export const media = new MediaState();
