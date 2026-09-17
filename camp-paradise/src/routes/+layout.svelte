<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	export let children: Snippet;

	const year = new Date().getFullYear();
</script>

<header class="glass-dark fixed inset-x-0 top-0 z-40">
	<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:h-20 lg:px-6">
		<a href="https://camp-paradise.org" class="flex items-center gap-2.5">
			<img src="/logo.png" alt="Camp Paradise" class="h-9 w-9 lg:h-11 lg:w-11" />
			<span class="font-display text-lg font-semibold tracking-tight text-white lg:text-xl">
				Camp Paradise
			</span>
		</a>

		<nav class="flex items-center gap-1 sm:gap-2">
			<a
				href="/camps"
				class="rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:text-white sm:px-4"
			>
				Camps
			</a>
			{#if data.camper}
				<a
					href="/account"
					class="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:text-white sm:px-4"
				>
					<i class="bi bi-person-circle"></i>
					<span class="hidden sm:inline">{data.camper.firstName}</span>
				</a>
				<form method="post" action="/account?/signout" class="m-0">
					<button
						type="submit"
						class="bg-primary shadow-primary/30 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl active:scale-95"
					>
						Sign out
					</button>
				</form>
			{:else}
				<a
					href="/"
					class="bg-primary shadow-primary/30 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl active:scale-95"
				>
					Sign in
				</a>
			{/if}
		</nav>
	</div>
</header>

<main class="min-h-screen pt-14 lg:pt-20">
	{@render children()}
</main>

<footer class="bg-forest-deep text-white/80">
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row"
	>
		<a href="https://camp-paradise.org" class="flex items-center gap-2.5">
			<img src="/logo.png" alt="Camp Paradise" class="h-10 w-10" />
			<span class="font-display text-lg font-semibold tracking-tight text-white">Camp Paradise</span
			>
		</a>
		<p class="text-xs text-white/50">© {year} Camp Paradise · Strawberry Valley, CA</p>
	</div>
</footer>
