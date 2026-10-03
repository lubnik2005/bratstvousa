<script lang="ts">
	import Img from '$lib/components/ui/Img.svelte';
	import { reveal } from '$lib/motion/reveal';

	type Photo = { slug: string; alt: string; caption?: string };

	let {
		photos,
		href,
		class: className = ''
	}: { photos: Photo[]; href?: string; class?: string } = $props();
</script>

<div class="grid grid-cols-3 gap-3 lg:gap-5 {className}">
	{#each photos as p, i (p.slug)}
		<svelte:element
			this={href ? 'a' : 'figure'}
			{href}
			use:reveal={{ delay: i * 0.08 }}
			class="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 sm:aspect-[4/3] {i %
				2 ===
			1
				? 'lg:translate-y-6'
				: ''}"
		>
			<Img
				slug={p.slug}
				alt={p.alt}
				sizes="(min-width: 1024px) 22rem, 33vw"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
			/>
			{#if p.caption}
				<span
					class="from-forest-deep/85 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-3 pt-8 text-xs font-semibold text-white sm:text-sm lg:p-4 lg:pt-10"
				>
					{p.caption}
				</span>
			{/if}
		</svelte:element>
	{/each}
</div>
