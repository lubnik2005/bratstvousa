<script lang="ts">
	import { BOOKING_URL } from '$lib/config';
	import { nav } from '$lib/content/site';
	import { splitReveal } from '$lib/motion/split';
	import { reveal } from '$lib/motion/reveal';
	import Button from '$lib/components/ui/Button.svelte';
	import Img from '$lib/components/ui/Img.svelte';

	// Shared error UI. Used by +error.svelte (runtime errors) and by the
	// prerendered /404 route, which produces the static 404.html that
	// Cloudflare Pages serves for any unmatched path.
	interface Props {
		status: number;
		message?: string;
	}

	let { status, message }: Props = $props();

	interface Copy {
		title: string;
		subtitle: string;
	}

	function copyFor(status: number): Copy {
		switch (status) {
			case 404:
				return {
					title: 'Looks like you wandered off the trail.',
					subtitle:
						"The page you're looking for doesn't exist or has moved. Let's get you back to camp."
				};
			case 403:
				return {
					title: 'This area is staff only.',
					subtitle: "You don't have permission to view this page."
				};
			case 500:
				return {
					title: 'Something went wrong on our end.',
					subtitle: "We're on it — please try again shortly."
				};
			default:
				return {
					title: 'Something went wrong.',
					subtitle: 'An unexpected error occurred. Please try again.'
				};
		}
	}

	const copy = $derived(copyFor(status));
	const rawMessage = $derived(import.meta.env.DEV ? message : undefined);
</script>

<svelte:head>
	<title>{status} — Camp Paradise</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="bg-forest-deep relative flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden text-white lg:min-h-screen"
>
	<div class="absolute inset-0">
		<Img
			slug="gallery-08"
			alt=""
			sizes="100vw"
			loading="eager"
			class="h-full w-full object-cover opacity-25"
		/>
		<div
			class="from-forest-deep/80 via-forest-deep/70 to-forest-deep absolute inset-0 bg-gradient-to-b"
		></div>
	</div>

	<div class="relative z-10 mx-auto w-full max-w-3xl px-6 py-24 text-center lg:py-40">
		<p
			class="text-mint-bright font-display text-[clamp(5rem,18vw,11rem)] leading-none font-semibold tracking-tighter opacity-90"
			aria-hidden="true"
		>
			{status}
		</p>

		<h1 class="mt-2 text-3xl font-semibold text-balance lg:text-6xl" use:splitReveal>
			{copy.title}
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-lg text-pretty text-white/85 lg:text-xl" use:reveal>
			{copy.subtitle}
		</p>

		{#if rawMessage}
			<p
				class="mx-auto mt-6 max-w-xl rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm break-words text-white/70"
			>
				{rawMessage}
			</p>
		{/if}

		<div class="mt-10 flex flex-wrap items-center justify-center gap-4" use:reveal={{ delay: 0.1 }}>
			<Button href="/" variant="primary" size="lg">Back to camp</Button>
			<Button href={BOOKING_URL} external variant="outline" size="lg">Book a stay</Button>
			<Button href="/contact" variant="outline" size="lg">Contact us</Button>
		</div>

		<nav
			class="mt-14 border-t border-white/10 pt-8"
			aria-label="Site sections"
			use:reveal={{ delay: 0.2 }}
		>
			<p class="text-mint-bright text-xs font-semibold tracking-[0.2em] uppercase">
				Or explore the camp
			</p>
			<ul class="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
				{#each nav as item (item.href)}
					<li>
						<a
							href={item.href}
							class="text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</section>
