import type { Action } from 'svelte/action';
import { media } from '$lib/stores/media.svelte';

interface TiltOptions {
	max?: number; // max rotation in degrees
	scale?: number;
	glare?: boolean;
}

// Mouse-driven 3D tilt for cards (desktop only). No-op under reduced motion or
// on touch/mobile where hover is meaningless.
export const tilt: Action<HTMLElement, TiltOptions | undefined> = (node, options) => {
	const opts = { max: 8, scale: 1.02, ...options };

	if (media.reducedMotion || media.isMobile) return;

	let raf = 0;
	node.style.transformStyle = 'preserve-3d';
	node.style.transition = 'transform 0.2s var(--ease-out-expo, ease)';

	function onMove(e: MouseEvent) {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			const rect = node.getBoundingClientRect();
			const px = (e.clientX - rect.left) / rect.width - 0.5;
			const py = (e.clientY - rect.top) / rect.height - 0.5;
			const rx = (-py * opts.max).toFixed(2);
			const ry = (px * opts.max).toFixed(2);
			node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${opts.scale})`;
		});
	}

	function reset() {
		cancelAnimationFrame(raf);
		node.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
	}

	node.addEventListener('mousemove', onMove);
	node.addEventListener('mouseleave', reset);

	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener('mousemove', onMove);
			node.removeEventListener('mouseleave', reset);
		}
	};
};
