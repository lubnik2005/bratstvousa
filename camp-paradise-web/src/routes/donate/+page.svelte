<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { donate } from '$lib/content/site';
</script>

<svelte:head>
	<title>Support Our Mission — Camp Paradise</title>
	<meta
		name="description"
		content="Even the smallest donations go a long way. Support the mission of Camp Paradise."
	/>
</svelte:head>

<PageHero
	image="gallery-09"
	eyebrow="Give"
	title="Support our mission"
	subtitle="Even the smallest donations go a long way."
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto max-w-3xl">
		<p use:reveal class="text-ink-soft text-center text-lg leading-relaxed lg:text-xl">
			{donate.intro}
		</p>

		<div
			use:reveal
			class="mt-12 overflow-hidden rounded-3xl bg-white p-2 shadow-lg ring-1 ring-black/5"
		>
			<iframe
				title="Donate to Camp Paradise"
				src={donate.donorbox}
				name="donorbox"
				height="820"
				width="100%"
				style="max-width: 100%; min-width: 250px; border: 0;"
				allow="payment"
			></iframe>
		</div>

		<div class="mt-10 text-center">
			<p class="text-ink-soft mb-4">Prefer PayPal?</p>
			<Button href={donate.paypal} external variant="outline" size="lg">Donate with PayPal</Button>
		</div>

		<p use:reveal class="text-ink mt-14 text-center text-lg font-medium">
			God bless you for your generosity!
		</p>
	</div>
</section>
