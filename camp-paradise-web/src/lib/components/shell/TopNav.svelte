<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { site, nav } from '$lib/content/site';
	import { media } from '$lib/stores/media.svelte';

	let scrolled = $state(false);
	const pathname = $derived($page.url.pathname);
	const isHome = $derived(pathname === '/');

	// Magnetic book button
	let bookBtn: HTMLAnchorElement | null = $state(null);

	function onMove(e: MouseEvent) {
		if (!bookBtn || media.reducedMotion) return;
		const r = bookBtn.getBoundingClientRect();
		const x = e.clientX - (r.left + r.width / 2);
		const y = e.clientY - (r.top + r.height / 2);
		bookBtn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
	}
	function onLeave() {
		if (bookBtn) bookBtn.style.transform = '';
	}

	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 40);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Transparent only over the home hero when at the top
	const transparent = $derived(isHome && !scrolled);
</script>

<header
	class="fixed inset-x-0 top-0 z-40 hidden transition-all duration-500 lg:block"
	class:glass-dark={!transparent}
	class:py-2={scrolled}
	class:py-4={!scrolled}
>
	<nav class="mx-auto flex max-w-7xl items-center justify-between px-6">
		<a href="/" class="flex items-center gap-2.5" aria-label="{site.name} home">
			<img src="/logo.png" alt="" class="h-11 w-11" width="44" height="44" />
			<span
				class="font-display text-xl font-semibold tracking-tight transition-colors"
				class:text-white={transparent || !transparent}
			>
				{site.name}
			</span>
		</a>

		<ul class="flex items-center gap-1">
			{#each nav as item (item.href)}
				{@const active = pathname === item.href}
				<li>
					<a
						href={item.href}
						class="relative rounded-full px-4 py-2 text-sm font-medium text-white/85 transition hover:text-white"
						class:text-white={active}
						aria-current={active ? 'page' : undefined}
					>
						{item.label}
						{#if active}
							<span class="bg-mint-bright absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full"></span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>

		<a
			bind:this={bookBtn}
			href="/contact"
			onmousemove={onMove}
			onmouseleave={onLeave}
			class="bg-primary shadow-primary/30 hover:shadow-primary/40 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-[transform,box-shadow] duration-300 hover:shadow-xl"
		>
			Book Now
		</a>
	</nav>
</header>
