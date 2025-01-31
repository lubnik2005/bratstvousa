<script lang="ts">
	import { onMount } from 'svelte';

	export let media_url;
	const menu_items = [
		{
			title: 'О НАС',
			children: [
				{
					title: 'Приветственное слово',
					href: 'greeting'
				},
				{
					title: 'Краткий обзор',
					href: 'short-introduction'
				},

				{
					title: 'Состав совета',
					href: 'committee'
				},
				{
					title: 'Адреса Домов молитвы',
					href: 'churches'
				},
				{
					title: 'Вероучение',
					href: 'beliefs'
				}
			]
		},
		{
			title: 'ОТДЕЛЫ',
			children: [
				{ title: 'Детский отдел', href: 'childrens-ministry' },
				{
					title: 'Молодежный отдел',
					href: 'youth-ministry'
				},
				{
					title: 'Семейный отдел',
					href: 'family-ministry'
				},
				{
					title: 'Отдел Благовестия',
					href: 'gospel-ministry'
				},
				{
					title: 'Музыкально хоровой отдел (МХО)',
					href: 'music-choir-ministry'
				},
				{
					title: 'Отдел библейского образования',
					href: 'bible-school-ministry'
				}
			]
		},
		{
			title: 'КАЛЕНДАРЬ',
			href: 'calendar'
		},
		{
			title: 'НОВОСТИ',
			href: 'news'
		}
	];

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
<div class="container-fluid responsive-fixed-top whole-navbar px-0">
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
						<div class="nav-item dropdown">
							<a
								href={item?.children.length ? '#' : item.href}
								class="nav-item nav-link {item.children && 'dropdown-toggle'} active"
								role="button"
								data-bs-toggle="dropdown">{item.title}</a
							>

							<div class="dropdown-menu m-0">
								{#each item.children as child}
									<a href="/{child.href}" class="dropdown-item">{child.title}</a>
								{/each}
							</div>
						</div>
					{:else}
						<a
							href="/{item.href}"
							class="nav-item nav-link {item.children && 'dropdown-toggle'} active">{item.title}</a
						>
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
	.whole-navbar {
		background: rgb(255, 255, 255);
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 255, 255, 0.7959384437368697) 53%,
			rgba(255, 255, 255, 0.48501407398897056) 100%
		);
		z-index: 1030;
	}

	.responsive-fixed-top {
		position: fixed; /* Default for larger screens */
		top: 0;
		width: 100%;
		z-index: 1030;
	}

	@media (max-width: 768px) {
		.responsive-fixed-top {
			position: relative; /* Disable fixed-top for smaller devices */
		}
	}
</style>
