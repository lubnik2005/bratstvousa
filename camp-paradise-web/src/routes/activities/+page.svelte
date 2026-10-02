<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { tilt } from '$lib/motion/tilt';
	import { activities, activitiesNote } from '$lib/content/site';
</script>

<svelte:head>
	<title>Activities — Camp Paradise</title>
	<meta
		name="description"
		content="Basketball, volleyball, swimming, hiking, frisbee golf and much more. Adventure around every corner at Camp Paradise."
	/>
</svelte:head>

<PageHero
	image="gallery-11"
	eyebrow="Things to do"
	title="Adventure around every corner"
	subtitle="From the court to the trail to the pool, there is always something happening."
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each activities as activity, i (activity.name)}
				<div use:reveal={{ delay: (i % 4) * 0.06 }}>
					<div
						use:tilt={{ max: 10, scale: 1.03 }}
						class="activity-card flex h-full flex-col items-start gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
					>
						<span
							class="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
						>
							<i class="bi bi-{activity.icon}"></i>
						</span>
						<span class="text-ink font-semibold">{activity.name}</span>
					</div>
				</div>
			{/each}
		</div>
		<p class="text-ink-soft mt-10 text-center text-lg font-medium">{activitiesNote}</p>

		<div class="mt-14 text-center">
			<Button href="/gallery" variant="outline" size="lg">See the gallery</Button>
		</div>
	</div>
</section>

<style>
	.activity-card {
		transform-style: preserve-3d;
	}
</style>
