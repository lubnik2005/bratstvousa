<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	export let children: import('svelte').Snippet;
	export let data: LayoutData;
</script>

<nav class="navbar navbar-expand-lg cp-navbar sticky-top">
	<div class="container">
		<a class="navbar-brand d-flex align-items-center gap-2" href="/">
			<img src="/logo-single.svg" alt="" class="cp-brand-logo" />
			<span>Camp Paradise</span>
		</a>
		<div class="d-flex align-items-center gap-2">
			<a href="/" class="btn btn-sm btn-outline-primary rounded-pill px-3">Camps</a>
			{#if data.camper}
				<a href="/account" class="btn btn-sm btn-primary rounded-pill px-3">
					<i class="bi bi-person-circle me-1"></i>{data.camper.firstName}
				</a>
				<form method="post" action="/account?/signout">
					<button type="submit" class="btn btn-sm btn-outline-secondary rounded-pill px-3">
						Sign out
					</button>
				</form>
			{:else}
				<a href="/login" class="btn btn-sm btn-primary rounded-pill px-3">Sign in</a>
			{/if}
		</div>
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
