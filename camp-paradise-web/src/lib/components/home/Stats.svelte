<script lang="ts">
	import { counter } from '$lib/motion/counter';
	import { reveal } from '$lib/motion/reveal';
	import { stats, home } from '$lib/content/site';
	import Img from '$lib/components/ui/Img.svelte';
</script>

<section class="bg-sand relative overflow-hidden py-24 md:py-32">
	<!-- faint topographic ring motif -->
	<div
		aria-hidden="true"
		class="border-primary/10 pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full border-[24px]"
	></div>
	<div
		aria-hidden="true"
		class="border-primary/5 pointer-events-none absolute -top-56 -right-56 h-[40rem] w-[40rem] rounded-full border-[24px]"
	></div>

	<div
		class="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20"
	>
		<div>
			<div class="max-w-xl" use:reveal>
				<p class="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">
					A year-round retreat
				</p>
				<h2 class="font-display text-ink text-3xl font-semibold text-balance md:text-5xl">
					{home.intro}
				</h2>
				<p class="text-ink-soft mt-5 text-lg text-pretty">{home.purpose}</p>
			</div>

			<div class="border-ink/10 mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t pt-10">
				{#each stats as stat (stat.label)}
					<div use:reveal={{ y: 30 }}>
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

		<!-- photo mosaic -->
		<div class="relative mx-auto w-full max-w-md lg:max-w-none" use:reveal={{ y: 40 }}>
			<div class="mosaic-main relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
				<Img
					slug="gallery-01"
					alt="Evening outdoor worship under tall pine trees"
					sizes="(min-width: 1024px) 34rem, 90vw"
					class="h-full w-full object-cover"
				/>
				<div
					class="from-forest-deep/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
				></div>
				<p
					class="text-mint-bright absolute bottom-6 left-6 text-xs font-semibold tracking-[0.25em] uppercase"
				>
					Worship under the pines
				</p>
			</div>

			<figure
				class="mosaic-pin ring-primary absolute -right-4 -bottom-10 w-[58%] rotate-[3deg] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-2 sm:-right-10 lg:-right-14 lg:w-[62%]"
			>
				<div class="aspect-[4/3] overflow-hidden rounded-xl">
					<Img
						slug="gallery-11"
						alt="A group of friends jumping together for a photo"
						sizes="(min-width: 1024px) 20rem, 55vw"
						class="h-full w-full object-cover"
					/>
				</div>
				<figcaption class="text-ink px-1 pt-2 pb-1 text-center text-xs font-semibold">
					Friends for life
				</figcaption>
			</figure>

			<span
				aria-hidden="true"
				class="bg-sunset absolute -top-3 left-8 h-6 w-6 rotate-12 rounded-sm shadow-md lg:left-12"
			></span>
		</div>
	</div>
</section>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.mosaic-main {
			animation: drift 12s ease-in-out infinite alternate;
		}
		.mosaic-pin {
			animation: sway 9s ease-in-out infinite alternate;
		}
	}
	@keyframes drift {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-8px);
		}
	}
	@keyframes sway {
		from {
			transform: rotate(3deg) translateY(0);
		}
		to {
			transform: rotate(1.5deg) translateY(6px);
		}
	}
</style>
