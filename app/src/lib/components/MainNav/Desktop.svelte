<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	export let media_url;
	export let menu_items;

	// Home page has a full-bleed video hero. There the navbar starts fully
	// transparent (just the menu text over the video) and becomes the normal
	// opaque paper bar once the user scrolls past the threshold. On every other
	// page the navbar is always opaque.
	const SCROLL_THRESHOLD = 80;
	$: isHome = $page.url.pathname === '/';

	// Tracked reactively so the `class:nav-transparent` directive drives the
	// class. (Toggling via classList imperatively caused Svelte to tree-shake
	// the scoped .nav-transparent styles as "unused".)
	let scrollY = 0;
	$: navTransparent = isHome && scrollY <= SCROLL_THRESHOLD;

	onMount(() => {
		const onScroll = () => {
			scrollY = window.scrollY;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<!-- Navbar Start -->
<div
	class="container-fluid responsive-fixed-top whole-navbar d-none d-lg-block px-0"
	class:nav-transparent={navTransparent}
>
	<!-- Mobile only -->
	<div class="d-lg-none text-center">
		<h1 class="text-primary ms-2 p-2" style="font-size:1.4rem">Американское Объединение МСЦ ЕХБ</h1>
	</div>

	<!-- <div class="top-bar row gx-0 align-items-center d-none d-lg-flex"> -->
	<!-- This is the upper menu bit. Make sure to uncomment the main.js file to move this on scroll. -->
	<!-- <div class="top-bar row gx-0 align-items-center d-none d-lg-flex"> -->
	<!-- 	<div class="col-lg-6 px-5 text-start"> -->
	<!-- 		<small><i class="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</small> -->
	<!-- 		<small class="ms-4"><i class="fa fa-envelope me-2"></i>info@bratstvousa.com</small> -->
	<!-- 	</div> -->
	<!-- 	<div class="col-lg-6 px-5 text-end"> -->
	<!-- 		<a class="text-body ms-3" href=""><i class="fab fa-facebook-f"></i></a> -->
	<!-- 		<a class="text-body ms-3" href=""><i class="fab fa-twitter"></i></a> -->
	<!-- 		<a class="text-body ms-3" href="https://www.youtube.com/@bratstvousa6465" -->
	<!-- 			><i class="fab fa-youtube"></i></a -->
	<!-- 		> -->
	<!-- 		<a class="text-body ms-3" href=""><i class="fab fa-instagram"></i></a> -->
	<!-- 	</div> -->
	<!-- </div> -->
	<!-- </div> -->

	<nav class="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5">
		<a href="/" class="navbar-brand ms-lg-0 d-flex align-items-center ms-4">
			<img
				width="100"
				height="69"
				style="display: inline;"
				src="{media_url}logo.png"
				alt="Логотип Братства США"
			/>
			<span class="ms-2">
				<h1
					class="fw-bold text-primary d-none d-lg-block m-0 text-center"
					style="font-size: 1.4rem"
				>
					Американское Объединение <br /> МСЦ ЕХБ
				</h1>
			</span>
		</a>

		<button
			type="button"
			class="navbar-toggler me-4"
			data-bs-toggle="collapse"
			data-bs-target="#navbarCollapse"
			aria-label="Открыть меню"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="navbar-collapse collapse" id="navbarCollapse">
			<div class="navbar-nav p-lg-0 ms-auto p-4">
				{#each menu_items as item}
					{#if item.children}
						{#if item.title === 'ОТДЕЛЫ'}
							<!-- Mega Menu for Departments -->
							<div class="nav-item dropdown mega-menu position-static">
								<button
									type="button"
									class="nav-link dropdown-toggle active"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									{item.title}
								</button>
								<div class="dropdown-menu mega-content">
									<div class="mega-container">
										<div class="mega-grid">
											{#each item.children as department}
												<div class="mega-card" style="--accent-color: {department.color}">
													<a href={department.href ?? '#'} class="mega-card-title"
														>{department.title}</a
													>
													<p class="mega-card-desc">{department.description}</p>
													{#if department.subcategory}
														<div class="mega-card-links">
															{#each department.subcategory as sub}
																<a href={sub.href}>{sub.title}</a>
															{/each}
														</div>
													{/if}
												</div>
											{/each}
										</div>
									</div>
								</div>
							</div>
						{:else}
							<!-- Regular Dropdown -->
							<div class="nav-item dropdown">
								<a
									href={item?.children.length ? '#' : item.href}
									class="nav-link dropdown-toggle active"
									data-bs-toggle="dropdown"
								>
									{item.title}
								</a>
								<div class="dropdown-menu">
									{#each item.children as child}
										<a href={child.href} class="dropdown-item">{child.title}</a>
									{/each}
								</div>
							</div>
						{/if}
					{:else if item.href}
						<a href={item.href} class="nav-item nav-link active">
							{item.title}
						</a>
					{:else if item.link}
						<a
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							class="nav-item nav-link active"
						>
							{item.title}
						</a>
					{/if}
				{/each}
			</div>

			<!-- This is a search icon. Commented out for now. -->
			<!-- <div class="d-none d-lg-flex ms-2"> -->
			<!-- 	<a class="btn-sm-square rounded-circle ms-3 bg-white" href=""> -->
			<!-- 		<small class="fa fa-search text-body"></small> -->
			<!-- 	</a> -->
			<!-- </div> -->
		</div>
	</nav>
</div>

<!-- Navbar End -->

<style>
	.responsive-fixed-top {
		background: var(--bs-paper, #f6f2ea);
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		transition:
			background 0.3s,
			border-color 0.3s,
			box-shadow 0.3s;
		z-index: 1000;
		width: 100%;
		top: 0;
		position: fixed;
	}

	/* Home hero: navbar fully transparent over the video, showing only the menu
	   text. Reverts to the opaque paper bar (rule above) once scrolled. */
	.responsive-fixed-top.nav-transparent {
		background: transparent;
		border-bottom-color: transparent;
		box-shadow: none;
	}

	/* Hide the logo + wordmark while transparent — just the menu text remains. */
	.responsive-fixed-top.nav-transparent :global(.navbar-brand) {
		visibility: hidden;
	}

	/* Light, legible menu text over the moving video. */
	.responsive-fixed-top.nav-transparent :global(.navbar-nav .nav-link) {
		color: #f6f2ea !important;
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55);
	}

	.responsive-fixed-top.nav-transparent :global(.navbar-nav .nav-link:hover),
	.responsive-fixed-top.nav-transparent :global(.navbar-nav .nav-link:focus) {
		color: #ffffff !important;
	}

	/* Navbar needs relative positioning to contain the mega menu dropdown */
	:global(.whole-navbar .navbar) {
		position: relative !important;
	}

	/* Mega menu container - must be static so dropdown positions relative to navbar */
	.mega-menu {
		position: static !important;
	}

	/* Style the dropdown toggle button to look like a nav link */
	.mega-menu :global(button.nav-link.dropdown-toggle) {
		background: none;
		border: none;
		cursor: pointer;
	}

	/* Override Bootstrap's dropdown-menu positioning for mega menu - FULL WIDTH */
	.mega-menu :global(.dropdown-menu.mega-content) {
		position: absolute !important;
		top: 100% !important;
		left: 0 !important;
		right: 0 !important;
		transform: none !important;
		width: 100% !important;
		max-width: none !important;
		padding: 2.5rem 2.5rem 3rem;
		background: var(--bs-paper, #f6f2ea);
		box-shadow: none;
		border-radius: 0;
		border: none;
		border-top: 1px solid var(--bs-rule, #ddd5c8);
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		margin-top: 0;
	}

	/* Show mega menu on hover */
	.mega-menu:hover :global(.dropdown-menu.mega-content),
	.mega-menu:focus-within :global(.dropdown-menu.mega-content) {
		display: block !important;
	}

	/* Container inside mega menu */
	.mega-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* 3-column grid layout */
	.mega-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem 2.5rem;
	}

	/* Individual card - quiet, hairline accent only */
	.mega-card {
		padding: 0 0 0 1rem;
		background: none;
		border-left: 2px solid var(--accent-color, #a28c6a);
		border-radius: 0;
		transition: border-color 0.2s ease;
	}

	/* Card title */
	.mega-card-title {
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--bs-dark, #2c2b29);
		display: block;
		margin-bottom: 0.35rem;
		line-height: 1.3;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.mega-card-title:hover,
	.mega-card-title:focus-visible {
		color: var(--accent-color, #5a4a42);
	}

	/* Card description */
	.mega-card-desc {
		font-size: 0.85rem;
		color: var(--bs-ink-muted, #736a5f);
		margin: 0;
		line-height: 1.6;
	}

	/* Subcategory links */
	.mega-card-links {
		margin-top: 0.85rem;
		padding-top: 0.6rem;
		border-top: 1px solid var(--bs-rule, #ddd5c8);
		display: flex;
		flex-flow: row wrap;
		align-items: baseline;
		gap: 0.35rem 1rem;
	}

	.mega-card-links a {
		font-size: 0.8rem;
		letter-spacing: 0.01em;
		white-space: nowrap;
		color: var(--accent-color, #5a4a42);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
		text-decoration-color: var(--bs-rule, #ddd5c8);
		transition:
			color 0.2s ease,
			text-decoration-color 0.2s ease;
	}

	.mega-card-links a:hover,
	.mega-card-links a:focus-visible {
		color: var(--accent-color, #5a4a42);
		text-decoration-color: var(--accent-color, #5a4a42);
	}

	/* Responsive: 2 columns on medium screens */
	@media (max-width: 1024px) {
		.mega-menu :global(.dropdown-menu.mega-content) {
			padding: 20px 24px;
		}

		.mega-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Responsive: 1 column on small/tablet screens */
	@media (max-width: 768px) {
		.mega-menu :global(.dropdown-menu.mega-content) {
			padding: 16px;
		}

		.mega-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.mega-card {
			padding: 12px;
		}
	}
</style>
