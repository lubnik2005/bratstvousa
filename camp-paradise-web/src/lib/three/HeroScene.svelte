<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import SceneContents from './SceneContents.svelte';

	// WebGL hero backdrop. Mounted only on desktop & when motion is allowed
	// (the parent guards this). Tracks pointer + page scroll to feed parallax.
	let pointer = $state({ x: 0, y: 0 });
	let scroll = $state(0);

	function onMove(e: PointerEvent) {
		pointer = {
			x: (e.clientX / window.innerWidth) * 2 - 1,
			y: -((e.clientY / window.innerHeight) * 2 - 1)
		};
	}

	function onScroll() {
		const h = window.innerHeight || 1;
		scroll = Math.min(1, Math.max(0, window.scrollY / h));
	}

	onMount(() => {
		onScroll();
		window.addEventListener('pointermove', onMove, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<div class="hero-canvas" aria-hidden="true">
	<Canvas
		toneMapping={THREE.ACESFilmicToneMapping}
		dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
	>
		<SceneContents {pointer} {scroll} />
	</Canvas>
</div>

<style>
	.hero-canvas {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.hero-canvas :global(canvas) {
		display: block;
	}
</style>
