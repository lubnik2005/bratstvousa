<script lang="ts">
	import Files from '$lib/components/Files.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	import { onMount } from 'svelte';
	export let data;

	// Categories and resources
</script>

<div class="container-fluid page-header">
	<div class="container">
		<h1 class="display-3 mb-3">Детский Отдел</h1>
		<!-- </nav> -->
	</div>
</div>

{#if data?.upcomingEvents.length}
	<UpcomingEvents upcomingEvents={data.upcomingEvents} media_url={data.media_url}/>
{/if}
<Files files={data.childrens_files} media_url={data.media_url} />
<UpcomingEvents title="Архив" upcomingEvents={data.archivedEvents} media_url={data.media_url} />
