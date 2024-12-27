<script lang="ts">
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
</script>

Error page
<Header title={page.status.toString()} subtitle={page.error?.message} />
