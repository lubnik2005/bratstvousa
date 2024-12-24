<script lang="ts">
	export let data;

	import '@splidejs/svelte-splide/css';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import Header from '$lib/components/Header.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	import News from '$lib/components/News.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	// Resources data
	// Filtered resources
</script>

<Header title="Молодежный отдел" />

{#if data?.upcomingEvents.length}
	<UpcomingEvents upcomingEvents={data.upcomingEvents} media_url={data.media_url} />
{/if}

<Calendar upcomingEvents={data.allEvents} />
<UpcomingEvents title="Архив" upcomingEvents={data.archivedEvents} media_url={data.media_url} />
