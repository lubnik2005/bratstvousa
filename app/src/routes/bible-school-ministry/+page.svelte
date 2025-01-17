<script>
	import Calendar from '$lib/components/Calendar.svelte';
	import Header from '$lib/components/Header.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	export let data;
</script>

<Header
	title="Отдел библейского образования"
	subtitle="Задача, поставленная апостолом Павлом перед Тимофеем - «вникай в себя и в учение» - остаётся важной необходимостью и христианина нашего времени. Для успешного достижения этой цели и предназначен наш отдел."
/>
<UpcomingEvents ministry_slug="bible-school-ministry" upcomingEvents={data.upcomingEvents} media_url={data.media_url} />
<Calendar ministry_slug="bible-school-ministry" upcomingEvents={data.allEvents} media_url={data.media_url} />
<UpcomingEvents ministry_slug="bible-school-ministry" title="Архив" upcomingEvents={data.archivedEvents} media_url={data.media_url} />
