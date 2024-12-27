<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	let { data } = $props();

	let calendar: Calendar;

	// Define your events
	const events = [
		{
			title: 'Meeting',
			start: '2024-12-01T10:00:00',
			end: '2024-12-01T12:00:00',
			url: 'https://google.com'
		},
		{
			title: 'Lunch',
			start: '2024-12-02T13:00:00'
		},
		{
			title: 'Conference',
			start: '2024-12-05',
			end: '2024-12-07'
		}
	];

	onMount(() => {
		const calendarEl = document.getElementById('calendar')!;
		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin],
			events: data.youth_events.map((e) => ({
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

<div class="container-xxl py-6">
	<div class="container">
		<div class="section-header mx-auto mb-5 text-center" style="max-width: 500px;">
			<h1 class="display-5 mb-3">Календарь</h1>
		</div>
		<div id="calendar"></div>
	</div>
</div>

<style>
	/* Add styles for the calendar if needed */
</style>
