<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { media } from '$lib/stores/media.svelte';
	import TopNav from '$lib/components/shell/TopNav.svelte';
	import MobileHeader from '$lib/components/shell/MobileHeader.svelte';
	import TabBar from '$lib/components/shell/TabBar.svelte';
	import Footer from '$lib/components/shell/Footer.svelte';

	let { children }: { children: Snippet } = $props();

	// Native View Transitions between pages (app-like slide/fade).
	onNavigate((navigation) => {
		if (!document.startViewTransition || media.reducedMotion) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>Camp Paradise — Christian Camp & Retreat Center in Strawberry Valley, CA</title>
	<meta
		name="description"
		content="A year-round Christian camp and retreat center in Strawberry Valley, California. See, know, and experience God."
	/>
</svelte:head>

<TopNav />
<MobileHeader />

<main id="main" class="pb-safe min-h-screen pt-14 lg:pt-0">
	{@render children()}
</main>

<Footer />
<TabBar />
