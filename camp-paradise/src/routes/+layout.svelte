<script lang="ts">
	import '../app.css';
	export let children: import('svelte').Snippet;
</script>

<nav class="navbar navbar-expand-lg cp-navbar sticky-top">
	<div class="container">
		<a class="navbar-brand d-flex align-items-center gap-2" href="/">
			<img src="/logo-single.svg" alt="" class="cp-brand-logo" />
			<span>Camp Paradise</span>
		</a>
		<a href="/" class="btn btn-sm btn-outline-primary rounded-pill px-3">Camps</a>
	</div>
</nav>

<main class="min-vh-100">
	{@render children()}
</main>

<footer class="cp-footer py-5 mt-5">
	<div class="container">
		<div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
			<div class="d-flex align-items-center gap-2">
				<img src="/logo-single.svg" alt="" style="height:28px" />
				<span class="fw-semibold text-white">Camp Paradise</span>
			</div>
			<div class="small">
				&copy; {new Date().getFullYear()} Camp Paradise. A place to rest, grow, and belong.
			</div>
		</div>
	</div>
</footer>
