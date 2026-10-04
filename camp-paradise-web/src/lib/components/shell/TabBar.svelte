<script lang="ts">
	import { page } from '$app/stores';

	// App-style bottom tab bar (mobile only). Five destinations map onto the
	// marketing routes. Active tab shows an animated pill indicator.
	interface Tab {
		label: string;
		href: string;
		icon: string; // bootstrap-icons class name
		match: (path: string) => boolean;
		featured?: boolean;
	}

	// Home is reached via the header logo.
	const tabs: Tab[] = [
		{
			label: 'Stay',
			href: '/facilities',
			icon: 'buildings',
			match: (p) => p.startsWith('/facilities')
		},
		{
			label: 'Visit',
			href: '/location',
			icon: 'geo-alt',
			match: (p) => p.startsWith('/location')
		},
		{
			label: 'Book',
			href: '/contact',
			icon: 'calendar-check-fill',
			match: (p) => p.startsWith('/contact'),
			featured: true
		},
		{
			label: 'Gallery',
			href: '/gallery',
			icon: 'images',
			match: (p) => p.startsWith('/gallery')
		},
		{
			label: 'Mission',
			href: '/mission',
			icon: 'book',
			match: (p) => p.startsWith('/mission')
		}
	];

	let path = $derived($page.url.pathname);
</script>

<nav class="tabbar glass-dark" aria-label="Primary">
	{#each tabs as tab (tab.href)}
		{@const active = tab.match(path)}
		<a
			href={tab.href}
			class="tab"
			class:active
			class:featured={tab.featured}
			aria-current={active ? 'page' : undefined}
		>
			{#if tab.featured}
				<span class="fab" aria-hidden="true"><i class="bi bi-{tab.icon}"></i></span>
			{:else}
				<span class="tab-icon">
					<i class="bi bi-{tab.icon}"></i>
					{#if active}<span class="tab-pill" aria-hidden="true"></span>{/if}
				</span>
			{/if}
			<span class="tab-label">{tab.label}</span>
		</a>
	{/each}
</nav>

<style>
	.tabbar {
		position: fixed;
		inset-inline: 0;
		bottom: 0;
		z-index: 50;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		align-items: center;
		height: var(--tabbar-height);
		padding-bottom: var(--safe-bottom, 0px);
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}
	@media (min-width: 1024px) {
		.tabbar {
			display: none;
		}
	}
	.tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.15rem;
		height: 100%;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.7rem;
		font-weight: 600;
		text-decoration: none;
		transition: color 0.25s ease;
		-webkit-tap-highlight-color: transparent;
	}
	.tab.active {
		color: var(--color-mint-bright, #5be49b);
	}
	.tab:active {
		transform: scale(0.92);
	}
	.tab-icon {
		position: relative;
		display: grid;
		place-items: center;
		font-size: 1.35rem;
		line-height: 1;
	}
	.tab-pill {
		position: absolute;
		inset: -0.35rem -0.6rem;
		border-radius: 999px;
		background: rgba(91, 228, 155, 0.16);
		z-index: -1;
		animation: pill-in 0.35s var(--ease-out-expo, ease);
	}
	@keyframes pill-in {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	/* Raised center action */
	.tab.featured {
		justify-content: flex-end;
		padding-bottom: 0.55rem;
		color: rgba(255, 255, 255, 0.85);
	}
	.tab.featured.active {
		color: var(--color-mint-bright, #5be49b);
	}
	.tab.featured:active {
		transform: none;
	}
	.fab {
		position: absolute;
		top: -1.25rem;
		left: 50%;
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		margin-left: -1.75rem;
		border-radius: 999px;
		background: var(--color-primary, #16aa65);
		color: #fff;
		font-size: 1.5rem;
		box-shadow:
			0 0 0 5px var(--color-forest-deep, #0a2c21),
			0 10px 24px -6px rgba(22, 170, 101, 0.65);
		transition:
			transform 0.25s var(--ease-out-expo, ease),
			box-shadow 0.25s ease;
	}
	.tab.featured {
		position: relative;
	}
	.tab.featured:active .fab {
		transform: scale(0.92);
	}
	.tab.featured.active .fab {
		box-shadow:
			0 0 0 5px var(--color-forest-deep, #0a2c21),
			0 0 0 7px var(--color-mint-bright, #5be49b),
			0 10px 24px -6px rgba(22, 170, 101, 0.65);
	}
	@media (prefers-reduced-motion: reduce) {
		.fab,
		.tab.featured:active .fab {
			transition: none;
			transform: none;
		}
		.tab,
		.tab:active {
			transition: none;
			transform: none;
		}
		.tab-pill {
			animation: none;
		}
	}
</style>
