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
			<img width="100" style="display: inline;" src="{media_url}logo.png" alt="" />
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
								<a href="#" class="nav-link dropdown-toggle active" data-bs-toggle="dropdown">
									{item.title}
								</a>
								<div class="dropdown-menu mega-content w-100">
									<div class="container">
										<div class="row">
											{#each item.children as department}
												<div class="col-6">
													<a
														href={department.href ? '/' + department.href : null}
														class="dropdown-item title"
													>
														<strong>{department.title}</strong>
													</a>
													{#if department.subcategory}
														<ul class="list-unstyled">
															{#each department.subcategory as sub}
																<li>
																	<a href="/{sub.href}" class="dropdown-item">{sub.title}</a>
																</li>
															{/each}
														</ul>
													{/if}
													<p class="desc">{department.description}</p>
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
										<a href="/{child.href}" class="dropdown-item">{child.title}</a>
									{/each}
								</div>
							</div>
						{/if}
					{:else}
						<a href={item.href ? '/' + item.href : item.link} class="nav-item nav-link active">
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
		background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
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

	.mega-menu {
		position: static !important; /* Ensure correct placement */
	}

	.mega-content {
		position: absolute;
		top: 100%;
		right: 10px;
		transform: translateX(-50%); /* Center aligns */
		width: 80vw; /* Reduce width to keep it visually contained */
		max-width: 900px; /* Prevents stretching on large screens */
		padding: 20px;
		background: white;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
		display: none;
		z-index: 1000;
		border-radius: 6px; /* Slight rounding for a cleaner look */
	}

	.mega-menu:hover .mega-content {
		display: block;
	}

	.mega-content .row {
		display: flex;
		justify-content: space-between;
	}

	.mega-content .col-md-4 {
		flex: 1;
		padding: 10px;
		min-width: 200px; /* Ensures columns don't collapse */
	}

	.mega-content .title {
		font-weight: bold;
		color: #333;
		font-size: 1.1rem;
	}

	.mega-content .desc {
		font-size: 0.9rem;
		color: gray;
		margin-top: 5px;
	}

	/* Mobile Fixes */
	@media (max-width: 992px) {
		.mega-content {
			width: 100%;
			left: 0;
			transform: none;
			max-width: 100%;
		}

		.mega-content .row {
			flex-wrap: wrap;
		}

		.mega-content .col-md-4 {
			width: 100%;
			text-align: center;
			margin-bottom: 15px;
		}
	}
</style>
