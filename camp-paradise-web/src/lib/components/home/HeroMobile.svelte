<script lang="ts">
	import { BOOKING_URL } from '$lib/config';
	import { home, site } from '$lib/content/site';
	import Button from '$lib/components/ui/Button.svelte';

	const bookingUrl = BOOKING_URL;
</script>

<section class="px-4 pt-4">
	<div class="bg-forest-deep relative overflow-hidden rounded-[1.75rem] shadow-xl">
		<video
			class="absolute inset-0 h-full w-full object-cover opacity-50"
			autoplay
			muted
			loop
			playsinline
			poster="/video/retreat-poster.jpg"
		>
			<source src="/video/retreat-720.webm" type="video/webm" />
			<source src="/video/retreat-720.mp4" type="video/mp4" />
		</video>
		<div
			class="from-forest-deep via-forest-deep/40 to-forest-deep/10 absolute inset-0 bg-gradient-to-t"
		></div>

		<div class="relative z-10 flex min-h-[78vh] flex-col justify-end p-6 text-white">
			<p class="text-mint-bright text-xs font-semibold tracking-[0.2em] uppercase">
				Strawberry Valley, CA
			</p>
			<h1 class="mt-2 text-4xl leading-[1.05] font-semibold text-balance">
				{home.heroHeadline}
			</h1>
			<p class="mt-3 text-pretty text-white/85">{home.heroSub}</p>
			<div class="mt-6 flex flex-col gap-3">
				<Button href={bookingUrl} external variant="primary" size="lg">Book Now</Button>
				<Button href="/facilities" variant="outline" size="lg">Explore the Camp</Button>
			</div>
			<p class="mt-4 text-xs text-white/60">{site.distances}</p>
		</div>
	</div>
</section>
