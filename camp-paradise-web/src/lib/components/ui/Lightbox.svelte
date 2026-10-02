<script lang="ts">
	import Img from './Img.svelte';

	interface Props {
		slugs: string[];
		index: number;
		onClose: () => void;
	}

	let { slugs, index = $bindable(), onClose }: Props = $props();

	let touchStartX = 0;

	function prev() {
		index = (index - 1 + slugs.length) % slugs.length;
	}
	function next() {
		index = (index + 1) % slugs.length;
	}
	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		else if (e.key === 'ArrowLeft') prev();
		else if (e.key === 'ArrowRight') next();
	}
	function onTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}
	function onTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
	}
</script>

<svelte:window on:keydown={onKey} />

<div
	class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
	role="dialog"
	aria-modal="true"
	aria-label="Image viewer"
	tabindex="-1"
	ontouchstart={onTouchStart}
	ontouchend={onTouchEnd}
>
	<button
		class="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
		onclick={onClose}
		aria-label="Close"
	>
		<i class="bi bi-x-lg text-lg"></i>
	</button>

	<button
		class="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:left-8"
		onclick={prev}
		aria-label="Previous image"
	>
		<i class="bi bi-chevron-left text-lg"></i>
	</button>

	<div class="max-h-[85vh] max-w-[92vw] lg:max-w-5xl">
		{#key index}
			<Img
				slug={slugs[index]}
				alt="Camp Paradise photo {index + 1}"
				sizes="92vw"
				loading="eager"
				class="max-h-[85vh] w-auto rounded-xl object-contain"
			/>
		{/key}
	</div>

	<button
		class="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:right-8"
		onclick={next}
		aria-label="Next image"
	>
		<i class="bi bi-chevron-right text-lg"></i>
	</button>

	<div class="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">
		{index + 1} / {slugs.length}
	</div>
</div>
