<script lang="ts">
	import { page } from '$app/stores';
	const tabs = [
		{ href: '/calendar', label: 'События', icon: 'M4 5h16v15H4z M8 2v6 M16 2v6 M4 10h16' },
		{
			href: '/churches',
			label: 'Церкви',
			icon: 'M12 3v5 M10 5h4 M4 21V12l8-5 8 5v9H4 M10 21v-6h4v6'
		},
		{ href: '/news', label: 'Новости', icon: 'M4 3h16v18H4z M8 7h8 M8 11h8 M8 15h3 M8 18h8' },
		{ href: '/?menu=open', label: 'Ещё', icon: 'M4 6h16 M4 12h16 M4 18h16' }
	];
</script>

<nav class="app-tabs" aria-label="Основная навигация">
	{#each tabs as tab}
		<a
			href={tab.href}
			aria-current={$page.url.pathname === tab.href ? 'page' : undefined}
			on:click={(event) => {
				if (tab.label === 'Ещё') {
					event.preventDefault();
					window.dispatchEvent(new Event('open-app-menu'));
				}
			}}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				aria-hidden="true"><path d={tab.icon} /></svg
			>
			<span>{tab.label}</span>
		</a>
	{/each}
</nav>

<style>
	.app-tabs {
		display: none;
	}
	@media (max-width: 991px) {
		.app-tabs {
			position: fixed;
			bottom: 0;
			inset-inline: 0;
			z-index: 1100;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
			background: #faf7f0;
			border-top: 1px solid #dcd5c7;
			box-shadow: 0 -4px 24px #302d2510;
		}
		a {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 3px;
			min-height: 49px;
			color: #726b60;
			font-size: 11px;
			text-decoration: none;
			border-radius: 12px;
		}
		a[aria-current='page'] {
			color: #354f41;
			background: #e8ece3;
			font-weight: 700;
		}
		svg {
			width: 23px;
			height: 23px;
		}
	}
</style>
