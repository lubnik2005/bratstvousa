<script lang="ts">
	import timeGridPlugin from '@fullcalendar/timegrid';
	import ruLocale from '@fullcalendar/core/locales/ru';

	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import listPlugin from '@fullcalendar/list';
	export let data;

	let calendar: Calendar;
	let calendarIsLoading = true;

	onMount(() => {
		const calendarEl = document.getElementById('calendar')!;
		calendar = new Calendar(calendarEl, {
			plugins: [listPlugin, dayGridPlugin, timeGridPlugin],
			initialView: 'dayGridMonth',
			defaultAllDay: true,
			headerToolbar: {
				left: 'prev,today,next',
				center: 'title',
				right: 'listYear,dayGridMonth'
			},
			locales: [ruLocale],
			events: filteredEvents,
			loading: function (isLoading) {
				calendarIsLoading = isLoading;
			}
		});
		console.log(data);
		calendar.render();

		return () => {
			calendar.destroy(); // Cleanup when the component is unmounted
		};
	});

	const regions: Region[] = [
		{ key: 'all', label: 'Все Регионы' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];

	const ministries: { key: string; label: string; color?: string }[] = [
		{ key: 'all', label: 'Все Отделы' },
		{ key: 'bibleEducationEvents', label: 'Отдел библейского образования', color: '#5A4A42' },
		{ key: 'familyEvents', label: 'Семейный отдел', color: '#8D230F' },
		{ key: 'childrensEvents', label: 'Детский отдел', color: '#F2C572' },
		{ key: 'gospelEvents', label: 'Отдел Благовестия', color: '#397367' },
		{ key: 'musicEvents', label: 'Музыкально хоровой отдел', color: '#6C4A79' },
		{ key: 'youthEvents', label: 'Молодежный отделй', color: '#2176AE' }
	];

	let selectedRegion = regions[0].key;
	let selectedMinistry = ministries[0].key;
	let filteredEvents = data.events;

	function filterEvents() {
		console.log(selectedRegion);
		filteredEvents = data.events.filter(
			(e) =>
				(selectedRegion == 'all' || e.region == selectedRegion) &&
				(selectedMinistry == 'all' || e.schemaName == selectedMinistry)
		);
		// calendar.destroy();
		// calendar.render();
		calendar.removeAllEvents();
		filteredEvents.forEach((e) => calendar.addEvent(e));
		// calendar.addEvent(data.events[0]);
		// calendar.removeAllEvents();
		// console.log('fiterevents');
	}
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
		<div id="calendar" class="my-4" />
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
