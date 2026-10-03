<script lang="ts">
	import { activities, activitiesNote } from '$lib/content/site';
	import { reveal } from '$lib/motion/reveal';
	import { tilt } from '$lib/motion/tilt';
	import PhotoStrip from '$lib/components/ui/PhotoStrip.svelte';
</script>

<section class="bg-sand-warm relative py-24 lg:py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl" use:reveal>
			<p class="text-primary-600 text-sm font-semibold tracking-[0.2em] uppercase">Things to do</p>
			<h2 class="text-ink mt-3 text-4xl font-semibold text-balance lg:text-6xl">
				Adventure around every corner
			</h2>
		</div>

		<div class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-16 lg:grid-cols-4 lg:gap-6">
			{#each activities as activity, i (activity.name)}
				<div use:reveal={{ delay: (i % 4) * 0.06 }}>
					<div
						use:tilt={{ max: 10, scale: 1.03 }}
						class="activity-card border-ink/5 flex h-full flex-col items-start gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
					>
						<span
							class="bg-primary/10 text-primary-600 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
						>
							<i class="bi bi-{activity.icon}"></i>
						</span>
						<h3 class="text-ink text-lg font-semibold">{activity.name}</h3>
					</div>
				</div>
			{/each}
		</div>

		<p class="text-ink-soft mt-10 text-center text-lg font-medium" use:reveal>
			{activitiesNote}
		</p>

		<PhotoStrip
			class="mt-14"
			href="/gallery"
			photos={[
				{
					slug: 'gallery-10',
					alt: 'Campers playing Spikeball on the grass',
					caption: 'Spikeball showdowns'
				},
				{
					slug: 'gallery-15',
					alt: 'An outdoor volleyball court surrounded by forest',
					caption: 'Volleyball in the forest'
				},
				{
					slug: 'gallery-18',
					alt: 'Campers playing with a giant beach ball',
					caption: 'Giant beach ball chaos'
				}
			]}
		/>
		<p class="mt-12 text-center lg:mt-16">
			<a
				href="/gallery"
				class="text-primary-600 hover:text-primary inline-flex items-center gap-2 font-semibold transition"
			>
				See more photos <i class="bi bi-arrow-right"></i>
			</a>
		</p>
	</div>
</section>

<style>
	.activity-card {
		transform-style: preserve-3d;
	}
</style>
