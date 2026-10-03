<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import PhotoStrip from '$lib/components/ui/PhotoStrip.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { donate } from '$lib/content/site';
</script>

<svelte:head>
	<title>Support Our Mission — Camp Paradise</title>
	<meta
		name="description"
		content="Even the smallest donations go a long way. Support the mission of Camp Paradise."
	/>
	<!-- Zeffy donation embed -->
	<script src="https://www.zeffy.com/embed/v2/zeffy-embed.js"></script>
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
			<div data-zeffy-embed data-form-url="/embed/donation-form/camp-paradise"></div>
			<div data-zeffy-embed-fallback style="display:none;">
				<div style="position:relative;overflow:hidden;height:450px;width:100%;">
					<iframe
						title="Donation form powered by Zeffy"
						style="position:absolute;border:0;top:0;left:0;bottom:0;right:0;width:100%;height:100%"
						data-zeffy-embed-src="https://www.zeffy.com/embed/donation-form/camp-paradise"
						allow="payment"
					></iframe>
				</div>
			</div>
		</div>

		<p use:reveal class="text-ink mt-14 text-center text-lg font-medium">
			God bless you for your generosity!
		</p>
	</div>
	<div class="mx-auto mt-14 max-w-6xl">
		<p class="text-ink-soft mb-6 text-center text-sm font-semibold tracking-[0.2em] uppercase">
			What your gift makes possible
		</p>
		<PhotoStrip
			photos={[
				{
					slug: 'gallery-08',
					alt: 'Campers singing around a campfire with a guitar',
					caption: 'Campfire worship'
				},
				{
					slug: 'gallery-16',
					alt: 'Children gathered for a lesson beside a wooden cross',
					caption: 'Kids learning about Jesus'
				},
				{
					slug: 'gallery-14',
					alt: 'A large evening outdoor camp meeting',
					caption: 'Gatherings for hundreds'
				}
			]}
		/>
	</div>
</section>
