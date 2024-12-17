<script lang="ts">
	let { data, children } = $props();
	const menu_items = [
		{
			title: 'HOME',
			href: ''
		},
		{
			title: 'О НАС',
			children: [
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
				// {
				//   title: 'Семейный отдел'
				// },
				{
					title: 'Отдел Благовестия',
					href: 'gospel-ministry'
				}
				// {
				//   title: 'Музыкально хоровой отдел (МХО)'
				// },
				// {
				//   title: 'Отдел библейского образования'
				// }
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
</script>

<svelte:head></svelte:head>
    <!-- <div class="container-fluid fixed-top px-0 wow fadeIn" data-wow-delay="0.1s"> -->
    <!--     <nav class="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s"> -->
    <!---->

<!-- Spinner Start -->
<!-- Spinner End -->

<!-- Navbar Start -->
<div class="container-fluid fixed-top whole-navbar px-0 wow fadeIn" data-wow-delay="0.1s">
	<div class="top-bar row gx-0 align-items-center d-none d-lg-flex">
		<div class="col-lg-6 px-5 text-start">
			<small><i class="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</small>
			<small class="ms-4"><i class="fa fa-envelope me-2"></i>info@bratstvousa.com</small>
		</div>
		<div class="col-lg-6 px-5 text-end">
			<a class="text-body ms-3" href=""><i class="fab fa-facebook-f"></i></a>
			<a class="text-body ms-3" href=""><i class="fab fa-twitter"></i></a>
			<a class="text-body ms-3" href="https://www.youtube.com/@bratstvousa6465"
				><i class="fab fa-youtube"></i></a
			>
			<a class="text-body ms-3" href=""><i class="fab fa-instagram"></i></a>
		</div>
	</div>

	<nav class="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
		<a href="/" class="navbar-brand ms-lg-0 ms-4">
			<h1 class="fw-bold text-primary m-0">Американское Объединение МСЦ ЕХБ</h1>
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
								href={item.href}
								class="nav-item nav-link {item.children && 'dropdown-toggle'} active"
								>{item.title}</a
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
			<div class="d-none d-lg-flex ms-2">
				<a class="btn-sm-square rounded-circle ms-3 bg-white" href="">
					<small class="fa fa-search text-body"></small>
				</a>
			</div>
		</div>
	</nav>
</div>
<!-- Navbar End -->

{@render children()}

<!-- Footer Start -->
<div class="container-fluid bg-dark footer mt-5 pt-5">
	<div class="container py-5">
		<div class="row g-5">
			<div class="col-lg-3 col-md-6">
				<h1 class="fw-bold text-primary mb-4">МСЦ ЕХБ</h1>
				<p>Американское объединение</p>
				<div class="d-flex pt-2">
					<a class="btn btn-square btn-outline-light rounded-circle me-1" href=""
						><i class="fab fa-twitter"></i></a
					>
					<a class="btn btn-square btn-outline-light rounded-circle me-1" href=""
						><i class="fab fa-facebook-f"></i></a
					>
					<a class="btn btn-square btn-outline-light rounded-circle me-1" href=""
						><i class="fab fa-youtube"></i></a
					>
					<a class="btn btn-square btn-outline-light rounded-circle me-0" href=""
						><i class="fab fa-linkedin-in"></i></a
					>
				</div>
			</div>
			<div class="col-lg-3 col-md-6">
				<h4 class="text-light mb-4">Адрес</h4>
				<p><i class="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
				<p><i class="fa fa-phone-alt me-3"></i>+012 345 67890</p>
				<p><i class="fa fa-envelope me-3"></i>info@bratstvousa.com</p>
			</div>
			<div class="col-lg-3 col-md-6">
				<h4 class="text-light mb-4">Quick Links</h4>
				<a class="btn btn-link" href="">Donate</a>
			</div>
			<div class="col-lg-3 col-md-6">
				<h4 class="text-light mb-4">Рассылка</h4>
				<p>
					Получайте свежие новости, специальные предложения и полезную информацию прямо на вашу
					электронную почту.
				</p>
				<div class="position-relative mx-auto" style="max-width: 400px;">
					<input
						class="form-control w-100 bg-transparent py-3 pe-5 ps-4"
						type="text"
						placeholder="Ваш email"
					/>
					<button type="button" class="btn btn-primary position-absolute end-0 top-0 me-2 mt-2 py-2"
						>Подписаться</button
					>
				</div>
			</div>
		</div>
	</div>
	<div class="container-fluid copyright">
		<div class="container">
			<div class="row">
				<div class="col-md-6 text-md-start mb-md-0 mb-3 text-center">
					&copy; <a href="#">Bratsvo USA</a>, All Right Reserved.
				</div>
				<div class="col-md-6 text-md-end text-center">
					<!--/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. ***/-->
					Designed By <a href="https://htmlcodex.com">HTML Codex</a>
					<br />Distributed By: <a href="https://themewagon.com" target="_blank">ThemeWagon</a>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Footer End -->

<!-- Back to Top -->
<a href="#" class="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
	><i class="bi bi-arrow-up"></i></a
>

<style>
	.whole-navbar {
		background: rgb(255, 255, 255);
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 255, 255, 0.7959384437368697) 53%,
			rgba(255, 255, 255, 0.48501407398897056) 100%
		);
	}
</style>
