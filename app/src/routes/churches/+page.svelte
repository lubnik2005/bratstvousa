<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Map from '$lib/components/Map.svelte';

	interface Region {
		key: string;
		label: string;
	}

	export let data;
	let selectedRegion = 'all';
	let searchQuery = '';

	const filterByRegion = (region: string) => {
		selectedRegion = region;
	};

	const regions: Region[] = [
		{ key: 'all', label: 'Все' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];

	// Combined region + free-text search, applied to both the mobile card grid
	// and the desktop table.
	$: filteredChurches = data.churches
		.filter((church) => selectedRegion === 'all' || church.region === selectedRegion)
		.filter((church) => {
			const q = searchQuery.trim().toLowerCase();
			if (!q) return true;
			return [
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
				.some((field) => String(field).toLowerCase().includes(q));
		});
</script>

<svelte:head>
	<title>Адреса Домов Молитвы — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<Header title="Адреса Домов Молитвы" />

<div class="d-lg-none container-xxl py-6">
	<div class="container">
		<!-- Church Grid -->
		<div class="row">
			<h3>Выбрать Регион</h3>
			<div class="col-md-12 col-sm-12 mb-3">
				<select
					class="form-select"
					bind:value={selectedRegion}
					on:change={() => filterByRegion(selectedRegion)}
				>
					{#each regions as region}
						<option value={region.key}>{region.label}</option>
					{/each}
				</select>
			</div>
			<div class="col-md-12 col-sm-12 mb-4">
				<input
					type="search"
					class="form-control church-search"
					placeholder="Поиск по городу, штату, названию…"
					aria-label="Поиск церквей"
					bind:value={searchQuery}
				/>
			</div>
		</div>

		<div class="row">
			{#each filteredChurches as church}
				<div class="col-md-4 col-sm-6">
					<div class="church-card">
						<h4>{church.state}, {church.city}</h4>
						<p>{church.name_line_1} {church.name_line_2}</p>
						<p>
							<strong>Адрес:</strong>
							<a
								target="_blank"
								href={`http://maps.google.com/?q=${church.address_line_1 + ' ' + (church.address_line_2 ?? '')}`}
								>{church.address_line_1}<br />{church.address_line_2}</a
							>
						</p>
						<p><strong>Контакт:</strong> {church.contact_first_name} {church.contact_last_name}</p>
						<p><strong>Телефон:</strong> <a href="tel:{church.phone}">{church.phone}</a></p>
						{#if church.website}
							<p>
								<a
									href={church.website}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Веб-сайт церкви"
								>
									<i class="fab fa-globe"></i>
								</a>
							</p>
						{/if}
						{#if church.youtube}
							<p>
								<a
									href={church.youtube}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="YouTube-канал церкви"
								>
									<i class="fab fa-youtube"></i>
								</a>
							</p>
						{/if}
						{#if church.flickr}
							<p>
								<a
									href={church.flickr}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Flickr церкви"
								>
									<i class="fa-brands fa-flickr"></i>
								</a>
							</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="d-none d-lg-block container-xxl py-6">
	<div class="container">
		<!-- Search -->
		<div class="row mb-4">
			<div class="col-12">
				<input
					type="search"
					class="form-control church-search"
					placeholder="Поиск по городу, штату, названию…"
					aria-label="Поиск церквей"
					bind:value={searchQuery}
				/>
			</div>
		</div>

		<!-- Region Filter -->
		<div class="row mb-4">
			<div class="col-12">
				<ul class="nav region-filter">
					{#each regions as category}
						<li class="nav-item">
							<button
								type="button"
								class="region-tab {category.key === selectedRegion ? 'active' : ''}"
								on:click={() => filterByRegion(category.key)}>{category.label}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="row">
			<table class="churches-table">
				<thead>
					<tr>
						<th scope="col">Штат</th>
						<th scope="col">Город</th>
						<th scope="col">Адрес</th>
						<th scope="col">Название</th>
						<th scope="col">Контакт</th>
						<th scope="col">Связь</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredChurches as church}
						<tr>
							<td>{church.state}</td>
							<td>{church.city}</td>
							<td>
								<a
									target="_blank"
									href={`http://maps.google.com/?q=${church.address_line_1 + ' ' + (church.address_line_2 ?? '')}`}
									>{church.address_line_1}<br />{church.address_line_2}</a
								>
							</td>
							<td>{church.name_line_1}<br />{church.name_line_2}</td>
							<td>{church.contact_last_name}<br />{church.contact_first_name}</td>
							<td>
								{#if church.phone}
									<a href={`tel:${church.phone}`}> {church.phone}</a><br /> <!-- content here -->
								{/if}
								{#if church.website}
									<a target="_blank" href={church.website} aria-label="Веб-сайт церкви">
										<i class="fa fa-globe"></i>
									</a>
								{/if}
								{#if church.youtube}
									<a target="_blank" href={church.youtube} aria-label="YouTube-канал церкви">
										<i class="fab fa-youtube"></i>
									</a>
								{/if}
								{#if church.flickr}
									<a target="_blank" href={church.flickr} aria-label="Flickr церкви">
										<i class="fab fa-flickr"></i>
									</a>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
<!-- Map -->
<div class="container-xxl pb-6">
	<div class="container">
		<Map churches={data.churches} />
	</div>
</div>

<style>
	.church-card {
		border: 1px solid var(--bs-rule);
		border-top: 2px solid var(--bs-secondary);
		padding: 1.25rem;
		margin-bottom: 1.5rem;
		height: 100%;
	}
	.church-card h4 {
		font-family: var(--bs-font-serif);
		font-size: 1.1rem;
		color: var(--bs-dark);
	}
	.region-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 1.75rem;
		border-bottom: 1px solid var(--bs-rule);
		padding-bottom: 0.25rem;
		margin-bottom: 0;
	}
	.region-tab {
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		padding: 0.5rem 0;
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--bs-ink-muted);
		cursor: pointer;
		transition: color 0.2s ease;
	}
	.region-tab:hover {
		color: var(--bs-primary);
	}
	.region-tab.active {
		color: var(--bs-primary);
		border-bottom-color: var(--bs-secondary);
	}
	.churches-table {
		width: 100%;
		background: transparent;
		border-collapse: collapse;
	}
	.church-search {
		border: 1px solid var(--bs-rule);
		border-radius: 0;
		background: var(--bs-paper);
		color: var(--bs-dark);
	}
	.church-search:focus {
		border-color: var(--bs-secondary);
		box-shadow: none;
		background: var(--bs-paper);
	}
	.churches-table thead th {
		font-family: var(--bs-font-serif);
		font-weight: 600;
		color: var(--bs-dark);
		border-bottom: 1px solid var(--bs-rule-strong);
		padding: 0.75rem 0.75rem;
	}
	.churches-table tbody td {
		border-bottom: 1px solid var(--bs-rule);
		padding: 0.75rem;
		vertical-align: top;
	}
	.churches-table tbody tr:hover {
		background-color: var(--bs-paper-sunk);
	}
</style>
