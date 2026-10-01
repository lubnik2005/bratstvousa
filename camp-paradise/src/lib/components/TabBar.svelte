<script lang="ts">
	import { page } from '$app/stores';

	export let topupUrl: string | null = null;

	type Tab = {
		label: string;
		href: string;
		icon: string;
		external?: boolean;
		match: (path: string) => boolean;
	};

	$: tabs = [
		{
			label: 'Camps',
			href: '/camps',
			icon: 'house-door',
			match: (p: string) => p.startsWith('/camps') || /^\/\d+/.test(p)
		},
		{
			label: 'Account',
			href: '/account',
			icon: 'person-circle',
			match: (p: string) => p.startsWith('/account') || p.startsWith('/reservation')
		},
		...(topupUrl
			? [
					{
						label: 'Top up',
						href: topupUrl,
						icon: 'plus-circle',
						external: true,
						match: () => false
					}
				]
			: [])
	] as Tab[];

	$: path = $page.url.pathname;
</script>

<nav class="tabbar glass-dark" aria-label="Primary" style="--cols: {tabs.length}">
	{#each tabs as tab (tab.label)}
		{@const active = tab.match(path)}
		<a
			href={tab.href}
			class="tab"
			class:active
			aria-current={active ? 'page' : undefined}
			target={tab.external ? '_blank' : undefined}
			rel={tab.external ? 'noopener' : undefined}
		>
			<span class="tab-icon">
				<i class="bi bi-{tab.icon}"></i>
				{#if active}<span class="tab-pill"></span>{/if}
			</span>
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
		grid-template-columns: repeat(var(--cols, 3), 1fr);
		align-items: center;
		height: calc(var(--tabbar-height) + var(--safe-bottom, 0px));
		padding-bottom: var(--safe-bottom, 0px);
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		/* Explicit frosted glass so the blur never depends on utility ordering,
		   with the -webkit- prefix iOS Safari still needs. */
		background: color-mix(in srgb, var(--color-forest-deep, #0a2c21) 70%, transparent);
		-webkit-backdrop-filter: saturate(180%) blur(18px);
		backdrop-filter: saturate(180%) blur(18px);
	}
	@media (min-width: 64rem) {
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
		transition:
			color 0.25s,
			transform 0.15s;
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
	}
	.tab-pill {
		position: absolute;
		inset: -0.35rem -0.6rem;
		border-radius: 999px;
		background: rgba(91, 228, 155, 0.16);
		z-index: -1;
	}
</style>
