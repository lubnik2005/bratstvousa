<script lang="ts">
	import ErrorView from '$lib/components/ui/ErrorView.svelte';

	// Prerendered to 404.html. Cloudflare Pages serves that file, with a real
	// 404 status, for any path that is neither a static asset nor a Worker route.
</script>

<ErrorView status={404} />
