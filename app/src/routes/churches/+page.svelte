<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { options } from '@fullcalendar/core/preact.js';
	import { onMount } from 'svelte';
	import Map from '$lib/components/Map.svelte';
	export let data;
	let selectedRegion = 'central';
	let map;
	let markers = [];

	const filterByRegion = (region) => {
		selectedRegion = region;
	};

	const regions: Region[] = [
		{ key: 'all', label: 'Все' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];
</script>

<Header title="Адреса Домов Молитвы" />

<div class="d-lg-none container mt-5">
	<!-- Church Grid -->
	<div class="row">
		<h3>Выбрать Регион</h3>
		<div class="col-md-12 col-sm-12 mb-4">
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
	</div>

	<div class="row">
		{#each data.churches.filter((church) => selectedRegion == 'all' || church.region === selectedRegion) as church}
			<div class="col-md-4 col-sm-6">
				<div class="church-card">
					<h4>{church.state}, {church.city}</h4>
					<p>{church.name_line_1} {church.name_line_2}</p>
					<p><strong>Address:</strong> {church.address_line_1}, {church.address_line_2}</p>
					<p><strong>Contact:</strong> {church.contact_first_name} {church.contact_last_name}</p>
					<p><strong>Phone:</strong> <a href="tel:{church.phone}">{church.phone}</a></p>
					{#if church.youtube}
						<p>
							<a href={church.youtube} target="_blank" rel="noopener noreferrer">
								<i class="fab fa-youtube"></i>
							</a>
						</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<div class="d-none d-lg-block container mt-5">
	<!-- Category Filter -->
	<div class="row d-flex justify-content-left mb-4 flex-wrap">
		<ul class="nav nav-pills d-inline-flex">
			{#each regions as category}
				<li class="nav-item me-2">
					<button
						class="btn btn-outline-primary border-2 {category.key === selectedRegion
							? 'active'
							: ''}"
						data-bs-toggle="pill"
						on:click={() => filterByRegion(category.key)}>{category.label}</button
					>
				</li>
			{/each}
		</ul>
	</div>

	<div class="row">
		<table class="table-striped table-hover table">
			<thead class="bg-secondary text-light">
				<tr>
					<th>Штат</th>
					<th>Город</th>
					<th>Адрес</th>
					<th>Название</th>
					<th>Контакт</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.churches
					.filter((church) => selectedRegion == 'all' || church.region === selectedRegion)
					.sort() as church}
					<tr>
						<td>{church.state}</td>
						<td>{church.city}</td>
						<td>{church.address_line_1}<br />{church.address_line_2}</td>
						<td>{church.name_line_1}<br />{church.name_line_2}</td>
						<td>{church.contact_last_name}<br />{church.contact_first_name}</td>
						<td>
							{#if church.phone}
								<a href={`tel:${church.phone}`}> {church.phone}</a><br /> <!-- content here -->
							{/if}
							{#if church.youtube}
								<a target="_blank" href={church.youtube}><i class="fab fa-youtube"></i></a>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<!-- Map -->
<div class="container">
	<Map churches={data.churches} />
</div>

<style>
	.church-card {
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 1rem;
		margin-bottom: 1rem;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
	.filter-buttons button {
		margin-right: 0.5rem;
	}
	#map {
		width: 100%;
		height: 400px;
		margin-top: 2rem;
	}
</style>
