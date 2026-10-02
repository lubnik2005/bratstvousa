<script lang="ts">
	import { BOOKING_URL } from '$lib/config';
	import { home } from '$lib/content/site';
	import { reveal } from '$lib/motion/reveal';
	import Button from '$lib/components/ui/Button.svelte';
	import Img from '$lib/components/ui/Img.svelte';

	const bookingUrl = BOOKING_URL;
</script>

<section class="bg-forest relative overflow-hidden py-28 text-white lg:py-40">
	<div class="absolute inset-0">
		<Img slug="gallery-05" alt="" sizes="100vw" class="h-full w-full object-cover opacity-30" />
		<div
			class="from-forest/70 via-forest/60 to-forest-deep absolute inset-0 bg-gradient-to-b"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-3xl px-6 text-center" use:reveal>
		<h2 class="text-5xl font-semibold text-balance lg:text-7xl">{home.ctaHeadline}</h2>
		<p class="mx-auto mt-6 max-w-xl text-lg text-pretty text-white/85 lg:text-xl">
			{home.ctaSub}
		</p>
		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<Button href={bookingUrl} external variant="primary" size="lg">Book Now</Button>
			<Button href="/contact" variant="outline" size="lg">Get in touch</Button>
		</div>
	</div>
</section>
