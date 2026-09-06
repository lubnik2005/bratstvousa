<script lang="ts">
	// import MainNav from '$lib/components/MainNav.svelte';
	import MainNav from '$lib/components/MainNav/Main.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	export let data;
	export let children;

	// Home has a full-bleed video hero that must sit under the transparent navbar.
	$: isHome = $page.url.pathname === '/';
	onMount(() => {
		// Keep --nav-offset in sync with the fixed desktop navbar's real height.
		// The navbar wraps to two lines between 992px and ~1150px, so its height
		// is not constant; #main-content uses var(--nav-offset) to stay clear of it.
		const navbar: HTMLElement | null = document.querySelector('.responsive-fixed-top');
		const updateNavOffset = () => {
			if (!navbar) return;
			// Only offset on desktop, where the navbar is position: fixed. Below 992px
			// the mobile header is in normal flow and needs no offset.
			const offset = window.innerWidth >= 992 ? navbar.offsetHeight : 0;
			document.documentElement.style.setProperty('--nav-offset', `${offset}px`);
		};
		updateNavOffset();
		const ro =
			typeof ResizeObserver !== 'undefined' && navbar ? new ResizeObserver(updateNavOffset) : null;
		ro?.observe(navbar as Element);
		window.addEventListener('resize', updateNavOffset);
	});
</script>

<MainNav media_url={data.media_url} />

<main id="main-content" class:home-hero={isHome}>
	{@render children()}
</main>

<!-- Footer Start -->
<footer class="container-fluid bg-dark footer mt-0 pt-5">
	<!-- Decorative cross monogram watermark (behind content, subtle texture) -->
	<svg
		class="footer-cross"
		viewBox="0 0 100 140"
		aria-hidden="true"
		focusable="false"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M42 0 h16 v46 h42 v16 h-42 v78 h-16 v-78 h-42 v-16 h42 z" fill="currentColor" />
	</svg>
	<!-- Top link bar (mirrors the bottom copyright bar — the "sandwich" top slice) -->
	<div class="container-fluid footer-linkbar">
		<div class="container">
			<nav class="footer-linkbar-row" aria-label="Ссылки в подвале">
				<a
					class="footer-link-inline"
					target="_blank"
					rel="noopener noreferrer"
					href="https://awakeningmission.org/">Awakening Mission</a
				>
				<a
					class="footer-link-inline"
					target="_blank"
					rel="noopener noreferrer"
					href="https://missionrem.org/">Mission REM</a
				>
				<a
					class="footer-link-inline"
					target="_blank"
					rel="noopener noreferrer"
					href="https://mscmusic.org/">MSC Music</a
				>
				<a
					class="footer-link-inline"
					target="_blank"
					rel="noopener noreferrer"
					href="https://iosifnichita.com/">Iosif Nichita</a
				>
				<a class="footer-link-inline footer-link-email" href="mailto:info@bratstvousa.com"
					>info@bratstvousa.com</a
				>
			</nav>
		</div>
	</div>

	<div class="footer-body container py-5">
		<!-- Brand (left) — the open middle of the sandwich -->
		<div class="footer-brand">
			<h2 class="footer-wordmark text-light mb-2">МСЦ ЕХБ</h2>
			<p class="footer-muted mb-3">Американское объединение</p>
			<p class="footer-scripture mb-4">
				«Господь — Пастырь мой; я ни в чём не буду нуждаться»
				<span class="footer-scripture-cite">Псалом 22:1</span>
			</p>
			<a
				class="footer-social"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="YouTube канал Братства"
				href="https://www.youtube.com/@bratstvousa"><i class="fab fa-youtube"></i></a
			>
		</div>
	</div>
	<div class="container-fluid copyright">
		<div class="container">
			<div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
				<div class="text-md-start text-center">&copy; Bratstvo USA, All Rights Reserved.</div>
				<a href="/privacy-policy" class="copyright-link">Privacy Policy</a>
			</div>
		</div>
	</div>
</footer>
<!-- Footer End -->

<!-- Back to Top -->
<button
	type="button"
	class="btn btn-primary back-to-top"
	aria-label="Наверх"
	on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
	<i class="bi bi-arrow-up"></i>
</button>
