Error page
<script lang="ts">
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
</script>

<Header title={page.status.toString()} subtitle={page.error?.message} />




