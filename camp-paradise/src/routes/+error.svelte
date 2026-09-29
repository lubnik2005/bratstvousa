<script lang="ts">
	import { page } from '$app/stores';

	$: status = $page.status;
	$: message = $page.error?.message ?? '';
	$: camper = ($page.data as { camper?: { firstName: string } | null }).camper ?? null;

	function copyFor(s: number, msg: string): { title: string; subtitle: string } {
		if (s === 404) {
			return {
				title: 'Looks like you wandered off the trail.',
				subtitle:
					msg === 'Event not found'
						? "We couldn't find that camp — it may have closed or the link is out of date."
						: "The page you're looking for doesn't exist or has moved. Let's get you back to camp."
			};
		}
		if (s === 403) {
			return { title: 'This area is for campers only.', subtitle: 'Sign in to continue.' };
		}
		if (s >= 500) {
			return {
				title: 'Something went wrong on our end.',
				subtitle: "We're on it — please try again shortly."
			};
		}
		return {
			title: 'Something went wrong.',
			subtitle: 'An unexpected error occurred. Please try again.'
		};
	}

	$: copy = copyFor(status, message);

	const btn =
		'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl';
	const outline =
		'inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10';
	const dev = import.meta.env.DEV;
</script>

<svelte:head>
	<title>{status} — Camp Paradise</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="bg-forest-deep relative isolate flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden text-white lg:min-h-[calc(100vh-5rem)]"
>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(91,228,155,0.18),transparent_60%)]"
		aria-hidden="true"
	></div>
	<img
		src="/logo.png"
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute -right-16 -bottom-16 -z-10 h-72 w-72 opacity-10 lg:h-96 lg:w-96"
	/>

	<div class="relative z-10 mx-auto w-full max-w-3xl px-6 py-20 text-center lg:py-32">
		<p class="eyebrow">Camp Paradise</p>
		<div
			class="text-mint-bright font-display text-[clamp(5rem,18vw,11rem)] leading-none font-semibold tracking-tighter opacity-90"
			aria-hidden="true"
		>
			{status}
		</div>
		<h1 class="mt-2 text-3xl font-semibold text-balance lg:text-6xl">{copy.title}</h1>
		<p class="mx-auto mt-6 max-w-xl text-lg text-white/85">{copy.subtitle}</p>

		{#if dev && message}
			<pre
				class="mx-auto mt-6 max-w-xl overflow-x-auto rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left font-mono text-sm text-white/70">{message}</pre>
		{/if}

		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<a href="/camps" class={btn}><i class="bi bi-compass"></i> Browse camps</a>
			{#if camper}
				<a href="/account" class={outline}><i class="bi bi-person-circle"></i> My account</a>
			{:else}
				<a href="/" class={outline}><i class="bi bi-box-arrow-in-right"></i> Sign in</a>
			{/if}
			<a href="https://camp-paradise.org" class={outline}>Camp Paradise home</a>
		</div>
	</div>
</section>
