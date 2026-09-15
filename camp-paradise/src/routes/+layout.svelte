<script lang="ts">
	export let children: import('svelte').Snippet;
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
	<div class="container">
		<a class="navbar-brand fw-semibold" href="/">Camp Paradise</a>
	</div>
</nav>

<main class="min-vh-100">
	{@render children()}
</main>

<footer class="border-top py-4 mt-5">
	<div class="container text-center text-muted small">
		&copy; {new Date().getFullYear()} Camp Paradise
	</div>
</footer>
