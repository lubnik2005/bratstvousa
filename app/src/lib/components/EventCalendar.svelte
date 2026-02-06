<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import ruLocale from '@fullcalendar/core/locales/ru';
	import type { CalendarEvent } from '$lib/types/calendar';

	/** Events to display in the calendar */
	export let events: CalendarEvent[] = [];

	/** Ministry slug for event URL generation (e.g., 'youth-ministry') */
	export let ministrySlug = 'general-event';

	/** Initial calendar view */
	export let initialView: 'dayGridMonth' | 'dayGridWeek' | 'timeGridDay' = 'dayGridMonth';

	/** Show header with title */
	export let showHeader = true;

	/** Calendar title */
	export let title = 'Календарь';

	let calendar: Calendar;
	let calendarEl: HTMLElement;

	// Transform events to FullCalendar format (convert null to undefined for FC compatibility)
	$: calendarEvents = events.map((e) => ({
		id: String(e.id),
		title: e.title,
		start: e.start ?? undefined,
		end: e.end ?? undefined,
		url: e.url || `/${ministrySlug}/${e.id}`,
		backgroundColor: e.backgroundColor,
		borderColor: e.borderColor
	}));

	// Update calendar events when props change
	$: if (calendar && calendarEvents) {
		calendar.setOption('events', calendarEvents);
	}

	onMount(() => {
		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin],
			firstDay: 0,
			initialView,
			headerToolbar: {
				left: 'prev,today,next',
				center: 'title',
				right: 'dayGridMonth,dayGridWeek,timeGridDay'
			},
			locales: [ruLocale],
			events: calendarEvents
		});

		calendar.render();

		return () => {
			calendar.destroy();
		};
	});
</script>

<div class="event-calendar d-none d-lg-block container-xxl py-6">
	<div class="container">
		{#if showHeader}
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">{title}</h1>
					</div>
				</div>
			</div>
		{/if}
		<div class="row p-6">
			<div class="p-6" bind:this={calendarEl}></div>
		</div>
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
