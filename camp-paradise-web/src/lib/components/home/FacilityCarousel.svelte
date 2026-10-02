<script lang="ts">
	import { facilities } from '$lib/content/site';
	import Img from '$lib/components/ui/Img.svelte';
</script>

<section class="mt-12">
	<div class="mb-4 flex items-end justify-between px-4">
		<h2 class="text-ink text-2xl font-semibold">Where you'll stay</h2>
		<a href="/facilities" class="text-primary-600 text-sm font-semibold">See all</a>
	</div>

	<div class="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
		{#each facilities as facility (facility.slug)}
			<a
				href="/facilities"
				class="group bg-forest-deep relative w-[72vw] shrink-0 snap-start overflow-hidden rounded-3xl shadow-lg active:scale-[0.98]"
			>
				<div class="aspect-[3/4] overflow-hidden">
					<Img
						slug={facility.image}
						alt={facility.name}
						sizes="72vw"
						class="h-full w-full object-cover"
					/>
				</div>
				<div
					class="from-forest-deep via-forest-deep/20 absolute inset-0 bg-gradient-to-t to-transparent"
				></div>
				<div class="absolute inset-x-0 bottom-0 p-5 text-white">
					{#if facility.capacity}
						<span
							class="bg-primary/90 mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
						>
							{facility.capacity}
						</span>
					{/if}
					<h3 class="text-xl font-semibold">{facility.name}</h3>
				</div>
			</a>
		{/each}
	</div>
</section>
