<script lang="ts">
	import { reviews, site } from '$lib/content/site';
	import { media } from '$lib/stores/media.svelte';

	// Duplicate the list so the marquee can loop seamlessly.
	const loop = [...reviews, ...reviews];
</script>

<section class="bg-forest-deep relative overflow-hidden py-24 text-white lg:py-32">
	<div class="mx-auto mb-14 max-w-6xl px-6 text-center">
		<p class="text-mint-bright text-sm font-semibold tracking-[0.2em] uppercase">Loved by guests</p>
		<h2 class="mt-3 text-4xl font-semibold text-balance lg:text-6xl">
			Memories that last a lifetime
		</h2>
		<a
			href={site.googleReviews}
			target="_blank"
			rel="noopener"
			class="text-mint-bright mt-4 inline-flex items-center gap-2 underline-offset-4 hover:underline"
		>
			<i class="bi bi-google"></i> See all of our reviews
		</a>
	</div>

	<div class="marquee-mask relative">
		<div class="marquee-track flex gap-6 px-6" class:paused={media.reducedMotion}>
			{#each loop as review, i (i)}
				<figure
					class="flex w-[85vw] shrink-0 flex-col justify-between rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur sm:w-[24rem]"
				>
					<div>
						<div class="text-sunset mb-3 flex gap-0.5">
							{#each [0, 1, 2, 3, 4] as s (s)}
								<i class="bi bi-star-fill"></i>
							{/each}
						</div>
						<blockquote class="text-lg leading-relaxed text-pretty text-white/90">
							&ldquo;{review.quote}&rdquo;
						</blockquote>
					</div>
					<figcaption class="mt-6 flex items-center gap-3">
						<span
							class="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
						>
							{review.author.charAt(0)}
						</span>
						<div>
							<div class="font-semibold">{review.author}</div>
							<div class="text-xs text-white/50">{review.source}</div>
						</div>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<style>
	.marquee-mask {
		-webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
		mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
	}
	.marquee-track {
		width: max-content;
		animation: marquee 40s linear infinite;
	}
	.marquee-track.paused {
		animation: none;
	}
	.marquee-track:hover {
		animation-play-state: paused;
	}
	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
			flex-wrap: wrap;
		}
	}
</style>
