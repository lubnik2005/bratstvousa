<script lang="ts">
	import Img from './Img.svelte';
	import { splitReveal } from '$lib/motion/split';

	interface Props {
		title: string;
		eyebrow?: string;
		subtitle?: string;
		image?: string;
	}

	let { title, eyebrow, subtitle, image = 'gallery-03' }: Props = $props();
</script>

<header class="bg-forest-deep relative isolate overflow-hidden px-4 pt-24 pb-16 lg:pt-40 lg:pb-24">
	<Img
		slug={image}
		alt=""
		sizes="100vw"
		loading="eager"
		fetchpriority="high"
		class="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
	/>
	<div
		class="from-forest-deep via-forest-deep/70 to-forest-deep/40 absolute inset-0 -z-10 bg-gradient-to-t"
	></div>
	<div class="mx-auto max-w-4xl text-center">
		{#if eyebrow}
			<p class="text-mint-bright mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
				{eyebrow}
			</p>
		{/if}
		<h1 class="text-4xl text-balance text-white lg:text-6xl" use:splitReveal>{title}</h1>
		{#if subtitle}
			<p class="text-mint/90 mx-auto mt-5 max-w-2xl text-lg text-pretty">{subtitle}</p>
		{/if}
	</div>
</header>
