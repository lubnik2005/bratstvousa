<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	export let upcomingEvents;
	import ruLocale from '@fullcalendar/core/locales/ru';
	export let ministry_slug = 'general-ministry';

	let calendar: Calendar;

	onMount(() => {
		const calendarEl = document.getElementById('calendar')!;
		calendar = new Calendar(calendarEl, {
			firstDay: 0,
			locales: [ruLocale],
			plugins: [dayGridPlugin],
			events: upcomingEvents.map((e) => ({
				title: e.title,
				start: e.startAt,
				end: e.endAt,
				url: `/${ministry_slug}/${e.slug}`
			})) // Add events here
		});
		calendar.render();

		return () => {
			calendar.destroy(); // Cleanup when the component is unmounted
		};
	});
</script>

<div class="d-none d-lg-block container-xxl py-6">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-5">
				<div class="section-header mb-5 text-start" style="max-width: 500px;">
					<h1 class="display-5 mb-3">Календарь</h1>
				</div>
			</div>
		</div>
		<div class="row p-6">
			<div class="p-6" id="calendar"></div>
		</div>
	</div>
</div>

<style>
	/* Add styles for the calendar if needed */
</style>
