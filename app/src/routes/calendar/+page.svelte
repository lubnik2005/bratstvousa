<script lang="ts">
	export let data;
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import listPlugin from '@fullcalendar/list';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import ruLocale from '@fullcalendar/core/locales/ru';
	import { goto } from '$app/navigation';

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
		{ key: 'bibleEducationEvents', label: 'Отдел библейского образования', color: '#5A4A42' },
		{ key: 'familyEvents', label: 'Семейный отдел', color: '#8D230F' },
		{ key: 'childrensEvents', label: 'Детский отдел', color: '#F2C572' },
		{ key: 'gospelEvents', label: 'Отдел Благовестия', color: '#397367' },
		{ key: 'musicEvents', label: 'Музыкально хоровой отдел', color: '#6C4A79' },
		{ key: 'youthEvents', label: 'Молодежный отдел', color: '#2176AE' }
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
	let filteredEvents = data.events;
	let calendar: Calendar;

	function updateURLParams() {
		const params = new URLSearchParams(window.location.search);
		params.set('region', selectedRegion);
		params.set('ministry', selectedMinistry);

		goto(`${window.location.pathname}?${params.toString()}`, {
			replaceState: true,
			keepfocus: true,
			noScroll: true
		});
	}

	function filterEvents() {
		filteredEvents = data.events.filter(
			(e) =>
				(selectedRegion === 'all' || e.region === selectedRegion) &&
				(selectedMinistry === 'all' || e.schemaName === selectedMinistry)
		);

		calendar.removeAllEvents();
		filteredEvents.forEach((e) => calendar.addEvent(e));
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

		const calendarEl = document.getElementById('calendar')!;

		calendar = new Calendar(calendarEl, {
			plugins: [listPlugin, dayGridPlugin, timeGridPlugin],
			initialView: window.matchMedia('(max-width: 754px)').matches ? 'listYear' : 'dayGridMonth',
			initialDate: params.get('date') ?? undefined,
			firstDay: 0,
			defaultAllDay: true,
			datesSet(info) {
				console.log('Current start date:', info.view.currentStart);
				console.log('Current end date:', info.end);
				console.log('View type:', info.view.type);
				params.set('date', info.view.currentStart.toISOString().slice(0, 10)); // "YYYY-MM-DD");
				goto(`${window.location.pathname}?${params.toString()}`, {
					replaceState: true,
					keepfocus: true,
					noScroll: true
				});

				// Your custom function
				// myCustomFunction(info);
			},
			headerToolbar: window.matchMedia('(max-width: 754px)').matches
				? headerToolbarMobile
				: headerToolbar,
			locales: [ruLocale],
			buttonText: {
				list: 'График'
			},
			events: filteredEvents,
			loading: function (isLoading) {
				calendarIsLoading = isLoading;
			}
		});
		calendar.render();
		filterEvents();
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

		{#if calendarIsLoading}
			<div class="placeholder-glow my-4" id="calendar-skeleton">
				<span class="placeholder" style="width: 100%; aspect-ratio: 16/10;" />
			</div>
		{:else}
			<select
				bind:value={selectedRegion}
				on:change={() => filterEvents()}
				class="custom-select"
				id="region"
			>
				{#each regions as region}
					<option value={region.key}>{region.label}</option>
				{/each}
			</select>

			<select
				class="custom-select"
				id="region"
				bind:value={selectedMinistry}
				on:change={() => filterEvents()}
			>
				{#each ministries as ministry}
					<option value={ministry.key}>{ministry.label}</option>
				{/each}
			</select>
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
</style>
