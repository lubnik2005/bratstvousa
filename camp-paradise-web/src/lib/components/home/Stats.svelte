<script lang="ts">
	import { counter } from '$lib/motion/counter';
	import { reveal } from '$lib/motion/reveal';
	import { stats, home } from '$lib/content/site';
</script>

<section class="bg-sand relative py-24 md:py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl" use:reveal>
			<p class="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">
				A year-round retreat
			</p>
			<h2 class="font-display text-ink text-3xl font-semibold text-balance md:text-5xl">
				{home.intro}
			</h2>
			<p class="text-ink-soft mt-5 text-lg text-pretty">{home.purpose}</p>
		</div>

		<div class="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each stats as stat (stat.label)}
				<div class="text-center md:text-left" use:reveal={{ y: 30 }}>
					<div
						class="font-display text-primary text-5xl font-semibold md:text-6xl"
						use:counter={{ value: stat.value, suffix: stat.suffix }}
					>
						0{stat.suffix}
					</div>
					<div class="text-ink-soft mt-2 text-sm font-medium tracking-wide uppercase">
						{stat.label}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
