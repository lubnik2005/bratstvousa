<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import listPlugin from '@fullcalendar/list';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import ruLocale from '@fullcalendar/core/locales/ru';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	// Define available regions and ministries
	const regions = [
		{ key: 'all', label: 'Все Регионы' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];

	const ministries = [
		{ key: 'all', label: 'Все Отделы' },
		{ key: 'bibleEducationEvents', label: 'Отдел библейского образования' },
		{ key: 'familyEvents', label: 'Семейный отдел' },
		{ key: 'childrensEvents', label: 'Детский отдел' },
		{ key: 'gospelEvents', label: 'Отдел Благовестия' },
		{ key: 'musicEvents', label: 'Музыкально хоровой отдел' },
		{ key: 'youthEvents', label: 'Молодежный отдел' }
	];

	const headerToolbar = {
		left: 'prev,today,next',
		center: 'title',
		right: 'listYear,dayGridMonth'
	};

	const headerToolbarMobile = {
		left: '',
		center: 'title',
		right: 'prev,next,listYear,dayGridMonth'
	};

	let calendarIsLoading = true;
	let selectedRegion = 'all';
	let selectedMinistry = 'all';
	let calendar: Calendar;

	function getFilteredEvents() {
		return data.events
			.filter(
				(e) =>
					(selectedRegion === 'all' || e.region === selectedRegion) &&
					(selectedMinistry === 'all' || e.schemaName === selectedMinistry)
			)
			.map((e) => ({
				id: String(e.id),
				title: e.title,
				start: e.start ?? undefined,
				end: e.end ?? undefined,
				url: e.url,
				backgroundColor: e.backgroundColor,
				borderColor: e.borderColor
			}));
	}

	function updateURLParams(dateStr?: string) {
		const params = new URLSearchParams(window.location.search);
		params.set('region', selectedRegion);
		params.set('ministry', selectedMinistry);
		if (dateStr) {
			params.set('date', dateStr);
		}

		goto(`${window.location.pathname}?${params.toString()}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	function filterEvents() {
		// Use setOption to update events efficiently (no DOM churn)
		calendar.setOption('events', getFilteredEvents());
		updateURLParams();
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		// If URL contains filter values, use them
		if (params.has('region')) {
			selectedRegion = params.get('region') || 'all';
		}
		if (params.has('ministry')) {
			selectedMinistry = params.get('ministry') || 'all';
		}

		const isMobile = window.matchMedia('(max-width: 754px)').matches;
		const calendarEl = document.getElementById('calendar')!;

		calendar = new Calendar(calendarEl, {
			plugins: [listPlugin, dayGridPlugin, timeGridPlugin],
			initialView: isMobile ? 'listYear' : 'dayGridMonth',
			initialDate: params.get('date') ?? undefined,
			firstDay: 0,
			defaultAllDay: true,
			datesSet(info) {
				const dateStr = info.view.currentStart.toISOString().slice(0, 10);
				updateURLParams(dateStr);
			},
			headerToolbar: isMobile ? headerToolbarMobile : headerToolbar,
			locales: [ruLocale],
			buttonText: {
				list: 'График'
			},
			events: getFilteredEvents(),
			loading(isLoading) {
				calendarIsLoading = isLoading;
			}
		});

		calendar.render();

		return () => {
			calendar.destroy();
		};
	});
</script>

<div class="container-xxl py-6">
	<div class="container">
		<div class="section-header mx-auto mb-5 text-center" style="max-width: 500px;">
			<h1 class="display-5 mb-3">Календарь</h1>
		</div>

		{#if !calendarIsLoading}
			<div class="d-flex mb-3 flex-wrap gap-2">
				<select
					bind:value={selectedRegion}
					on:change={() => filterEvents()}
					class="custom-select"
					id="filter-region"
					aria-label="Фильтр по региону"
				>
					{#each regions as region}
						<option value={region.key}>{region.label}</option>
					{/each}
				</select>

				<select
					bind:value={selectedMinistry}
					on:change={() => filterEvents()}
					class="custom-select"
					id="filter-ministry"
					aria-label="Фильтр по отделу"
				>
					{#each ministries as ministry}
						<option value={ministry.key}>{ministry.label}</option>
					{/each}
				</select>
			</div>
		{:else}
			<div class="placeholder-glow my-4" id="calendar-skeleton">
				<span class="placeholder" style="width: 100%; aspect-ratio: 16/10;" />
			</div>
		{/if}

		<div id="calendar" class="my-4" style="min-height: 700px;" />
	</div>
</div>

<style>
	:root {
		--fc-small-font-size: 0.85em;
		--fc-page-bg-color: #fff;
		--fc-neutral-bg-color: rgba(208, 208, 208, 0.3);
		--fc-neutral-text-color: #808080;
		--fc-border-color: #ddd;

		--fc-button-text-color: #fff;
		--fc-button-bg-color: #2c2b29;
		--fc-button-border-color: #2c2b29;
		--fc-button-hover-bg-color: #555555;
		--fc-button-hover-border-color: #555555;
		--fc-button-active-bg-color: #555555;
		--fc-button-active-border-color: #555555;

		--fc-event-bg-color: #5a4a42;
		--fc-event-border-color: #2c2b29;
		--fc-event-text-color: #fff;
		--fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);

		--fc-more-link-bg-color: #d0d0d0;
		--fc-more-link-text-color: inherit;

		--fc-event-resizer-thickness: 8px;
		--fc-event-resizer-dot-total-width: 8px;
		--fc-event-resizer-dot-border-width: 1px;

		--fc-non-business-color: rgba(215, 215, 215, 0.3);
		--fc-bg-event-color: rgb(143, 223, 130);
		--fc-bg-event-opacity: 0.3;
		--fc-highlight-color: rgba(188, 232, 241, 0.3);
		--fc-today-bg-color: rgba(255, 220, 40, 0.15);
		--fc-now-indicator-color: red;
	}

	.custom-select {
		min-width: 200px;
	}
</style>
