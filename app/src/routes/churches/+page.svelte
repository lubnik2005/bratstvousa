<script lang="ts">
	import ArrowIcon from '$lib/components/ArrowIcon.svelte';
	import { page } from '$app/stores';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { regions } from '$lib/calendar';
	import type { PageData } from './$types';

	export let data: PageData;
	let selectedRegion = $page.url.searchParams.get('region') || 'all';
	let searchQuery = $page.url.searchParams.get('q') || '';
	let showMap = false;
	let ready = false;
	afterNavigate(() => {
		ready = true;
	});
	$: filteredChurches = data.churches.filter(
		(church) =>
			(selectedRegion === 'all' || church.region === selectedRegion) &&
			[
				church.state,
				church.city,
				church.name_line_1,
				church.name_line_2,
				church.address_line_1,
				church.address_line_2,
				church.contact_first_name,
				church.contact_last_name
			]
				.filter(Boolean)
				.join(' ')
				.toLocaleLowerCase()
				.includes(searchQuery.trim().toLocaleLowerCase())
	);
	$: if (ready) updateFilters(selectedRegion, searchQuery);
	function updateFilters(region: string, q: string): void {
		const url = new URL(window.location.href);
		if (region !== 'all') url.searchParams.set('region', region);
		else url.searchParams.delete('region');
		if (q) url.searchParams.set('q', q);
		else url.searchParams.delete('q');
		replaceState(url, $page.state);
	}
</script>

<svelte:head><title>Найти церковь — Братство США</title></svelte:head>

<div class="directory">
	<header>
		<p class="kicker">Рядом и по всей стране</p>
		<h1>Найти церковь</h1>
		<p class="intro">Адреса домов молитвы и контакты общин.</p>
	</header>
	<div class="search-panel">
		<label for="church-search">Город, штат или название</label>
		<input
			id="church-search"
			type="search"
			placeholder="Где вы ищете церковь?"
			bind:value={searchQuery}
		/>
		<label for="church-region">Регион</label>
		<select id="church-region" bind:value={selectedRegion}
			>{#each regions as region}<option value={region.key}>{region.label}</option>{/each}</select
		>
	</div>
	<div class="results-heading">
		<span>Найдено: {filteredChurches.length}</span><button on:click={() => (showMap = !showMap)}
			>{#if showMap}Скрыть карту{:else}Открыть карту <ArrowIcon />{/if}</button
		>
	</div>
	{#if showMap}
		{#await import('$lib/components/Map.svelte')}<p role="status">
				Загружаем карту…
			</p>{:then module}<module.default churches={filteredChurches} />{:catch}<p>
				Не удалось загрузить карту. Адреса доступны в списке.
			</p>{/await}
	{/if}
	<div class="church-grid">
		{#each filteredChurches as church (church.id)}
			<article class="church-card">
				<p class="location">
					{church.state}{church.state && church.city ? ' / ' : ''}{church.city}
				</p>
				<h2>
					{church.name_line_1 || 'Дом молитвы'}{church.name_line_2 ? ` ${church.name_line_2}` : ''}
				</h2>
				<p class="address">{church.address_line_1}<br />{church.address_line_2}</p>
				{#if church.contact_first_name || church.contact_last_name}<p class="contact">
						{church.contact_first_name}
						{church.contact_last_name}
					</p>{/if}
				<div class="actions">
					<a
						class="directions"
						href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([church.address_line_1, church.address_line_2, church.city, church.state].filter(Boolean).join(', '))}`}
						target="_blank"
						rel="noopener noreferrer">Маршрут <ArrowIcon /></a
					>
					{#if church.phone}<a href={`tel:${church.phone}`}>Позвонить</a>{/if}
					{#if church.website}<a href={church.website} target="_blank" rel="noopener noreferrer"
							>Сайт <ArrowIcon /></a
						>{/if}
					{#if church.youtube}<a href={church.youtube} target="_blank" rel="noopener noreferrer"
							>YouTube <ArrowIcon /></a
						>{/if}
					{#if church.flickr}<a href={church.flickr} target="_blank" rel="noopener noreferrer"
							>Фото <ArrowIcon /></a
						>{/if}
				</div>
			</article>
		{:else}<div class="empty">
				<h2>Церковь не найдена</h2>
				<p>Попробуйте название города или другой регион.</p>
				<button
					on:click={() => {
						searchQuery = '';
						selectedRegion = 'all';
					}}>Сбросить поиск</button
				>
			</div>{/each}
	</div>
</div>

<style>
	.directory {
		max-width: 1080px;
		padding: 34px 24px 48px;
		margin: auto;
		color: #302f29;
	}
	.kicker {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: #746e61;
		margin-bottom: 12px;
	}
	h1 {
		font-size: clamp(32px, 7vw, 48px);
		margin-bottom: 12px;
	}
	.intro {
		color: #746e61;
		font-size: 14px;
		margin-bottom: 24px;
	}
	.search-panel {
		padding: 20px;
		background: #eae6dc;
		border-radius: 18px;
		display: grid;
		gap: 8px;
	}
	.search-panel label {
		font-size: 11px;
		font-weight: 600;
		color: #665f52;
	}
	input,
	select {
		width: 100%;
		min-height: 48px;
		background: #fffdf8;
		padding: 10px 12px;
		border: 1px solid #d8d1c3;
		border-radius: 10px;
		font-size: 16px;
		color: #302f29;
	}
	input {
		margin-bottom: 6px;
	}
	.results-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 18px 0;
		font-size: 12px;
		color: #746e61;
	}
	.results-heading button {
		border: 0;
		background: transparent;
		color: #354f41;
		min-height: 44px;
	}
	.church-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}
	.church-card {
		background: #fffdf7;
		border: 1px solid #e0d9cb;
		border-radius: 16px;
		padding: 22px;
	}
	.location {
		color: #586b50;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 11px;
		margin-bottom: 10px;
	}
	h2 {
		font-size: 21px;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}
	.address {
		font-size: 14px;
		line-height: 1.6;
		color: #746e61;
		margin-block: 12px;
	}
	.contact {
		font-size: 12px;
		color: #746e61;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 18px;
	}
	.actions a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 10px 14px;
		min-height: 44px;
		border: 1px solid #d8d1c3;
		border-radius: 10px;
		font-size: 12px;
		color: #354f41;
		text-decoration: none;
	}
	.actions .directions {
		background: #354f41;
		border-color: #354f41;
		color: #fffdf7;
	}
	.empty {
		padding: 36px 0;
	}
	@media (max-width: 650px) {
		.directory {
			padding: 24px 18px 32px;
		}
		.church-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
