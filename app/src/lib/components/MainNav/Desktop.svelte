<script lang="ts">
	import { onMount } from 'svelte';
	export let media_url;
	export let menu_items;

	onMount(() => {
		// Fixed Navbar
		window.addEventListener('scroll', () => {
			const fixedTop: HTMLElement | null = document.querySelector('.responsive-fixed-top');
			if (!fixedTop) return;
			if (window.innerWidth < 992) {
				if (window.scrollY > 45) {
					fixedTop.classList.add('bg-white', 'shadow');
				} else {
					fixedTop.classList.remove('bg-white', 'shadow');
				}
			} else {
				if (window.scrollY > 45) {
					fixedTop.classList.add('bg-white', 'shadow');
					fixedTop.style.top = '0';
				} else {
					fixedTop.classList.remove('bg-white', 'shadow');
					fixedTop.style.top = '0';
				}
			}
		});
	});
</script>

<!-- Navbar Start -->
<div class="container-fluid responsive-fixed-top whole-navbar d-none d-lg-block px-0">
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
		background: linear-gradient(180deg, #fff, #ffffffcb 53%, #ffffff7c);
		transition:
			background 0.3s,
			box-shadow 0.3s;
		z-index: 1000;
		width: 100%;
		top: 0;
		position: fixed;
	}

	.bg-white-on-scroll {
		background: white !important;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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
		padding: 24px 40px;
		background: #fff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-radius: 0;
		border: none;
		border-top: 1px solid #eee;
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
		gap: 16px;
	}

	/* Individual card - simplified without icons */
	.mega-card {
		padding: 16px;
		background: #fafafa;
		border-left: 3px solid var(--accent-color, #666);
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.mega-card:hover {
		background: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	/* Card title */
	.mega-card-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: #333;
		display: block;
		margin-bottom: 6px;
		line-height: 1.3;
		text-decoration: none;
	}

	.mega-card-title:hover {
		color: var(--accent-color, #333);
		text-decoration: underline;
	}

	/* Card description */
	.mega-card-desc {
		font-size: 0.8rem;
		color: #666;
		margin: 0;
		line-height: 1.5;
	}

	/* Subcategory links */
	.mega-card-links {
		margin-top: 10px;
		padding-top: 8px;
		border-top: 1px solid #e5e5e5;
		display: flex;
		flex-wrap: wrap;
		gap: 6px 16px;
	}

	.mega-card-links a {
		font-size: 0.8rem;
		color: var(--accent-color, #555);
		text-decoration: none;
	}

	.mega-card-links a:hover {
		text-decoration: underline;
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
