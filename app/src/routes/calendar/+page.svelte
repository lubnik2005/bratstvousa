<script lang="ts">
	import timeGridPlugin from '@fullcalendar/timegrid';
	import ruLocale from '@fullcalendar/core/locales/ru';

	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	export let data;

	let calendar: Calendar;

	onMount(() => {
		const calendarEl = document.getElementById('calendar')!;
		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin],
			initialView: 'dayGridMonth',
			headerToolbar: {
				left: 'prev,today,next',
				center: 'title',
				right: 'dayGridMonth,dayGridWeek,timeGridDay'
			},
			locales: [ruLocale],
			events: data.events.map((e) => ({
				title: e.title,
				start: e.startAt,
				end: e.endAt,
				url: e.slug
			})) // Add events here
		});
		calendar.render();

		return () => {
			calendar.destroy(); // Cleanup when the component is unmounted
		};
	});
</script>

}

<div class="container-xxl py-6">
	<div class="container">
		<div class="section-header mx-auto mb-5 text-center" style="max-width: 500px;">
			<h1 class="display-5 mb-3">Календарь</h1>
		</div>
		<div id="calendar"></div>
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
