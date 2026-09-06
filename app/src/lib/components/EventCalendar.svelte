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

<!-- FullCalendar theming is centralised in src/scss/main.scss (.fc). -->
