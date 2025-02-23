<script lang="ts">
	import { onMount } from 'svelte';
	export let media_url;

	let isMenuOpen = false;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
		document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
	};

	const menu_items = [
		{
			title: 'О НАС',
			children: [
				{ title: 'Приветственное слово', href: 'greeting' },
				{ title: 'Краткий обзор', href: 'short-introduction' },
				{ title: 'Состав совета', href: 'committee' },
				{ title: 'Вероучение', href: 'beliefs' }
			]
		},
		{ title: 'АДРЕСА ДОМОВ МОЛИТВЫ', href: 'churches' },
		{ title: 'КАЛЕНДАРЬ', href: 'calendar' },
		{ title: 'НОВОСТИ', href: 'news' },
		{
			title: 'ОТДЕЛЫ',
			children: [
				{ title: 'Детский отдел', href: 'childrens-ministry' },
				{ title: 'Молодежный отдел', href: 'youth-ministry' },
				{ title: 'Семейный отдел', href: 'family-ministry' },
				{ title: 'Отдел Благовестия', href: 'gospel-ministry' },
				{ title: 'Музыкально хоровой отдел (МХО)', href: 'music-choir-ministry' },
				{
					title: 'Библейское Образование',
					href: 'bible-education-ministry',
					subcategory: [
						{ title: 'Библейская Школа', href: 'bible-school-ministry' },
						{ title: 'Библейские Курсы', href: 'bible-courses-ministry' },
						{ title: 'Application', href: 'enroll' }
					]
				}
			]
		},
		{ title: 'ПРОПОВЕДИ', link: 'https://www.youtube.com/@bratstvousa' }
	];
</script>

<!-- Navbar Start -->
<div class="navbar container-fluid responsive-fixed-top whole-navbar px-0">
	<a href="/" class="navbar-brand ms-lg-0 d-flex align-items-center ms-4">
		<img width="100" style="display: inline;" src="{media_url}logo.png" alt="Logo" />
		<span class="ms-2">
			<h1 class="fw-bold text-primary d-none d-lg-block m-0 text-center" style="font-size: 1.4rem">
				Американское Объединение <br /> МСЦ ЕХБ
			</h1>
		</span>
	</a>

	<!-- Mobile Menu Toggle -->
	<button class="navbar-toggler d-lg-none me-4" on:click={toggleMenu}>
		<span class="navbar-toggler-icon"></span>
	</button>

	<!-- Desktop Menu -->
	<div class="desktop-menu d-none d-lg-flex ms-auto">
		<ul class="menu-list d-flex align-items-center">
			{#each menu_items as item}
				{#if item.children}
					<li class="dropdown">
						<span class="dropdown-toggle">{item.title}</span>
						<ul class="dropdown-menu">
							{#each item.children as child}
								{#if child.subcategory}
									<li class="has-sub">
										<a href="/{child.href}">{child.title}</a>
										<ul class="submenu">
											{#each child.subcategory as sub}
												<li><a href="/{sub.href}">{sub.title}</a></li>
											{/each}
										</ul>
									</li>
								{:else}
									<li><a href="/{child.href}">{child.title}</a></li>
								{/if}
							{/each}
						</ul>
					</li>
				{:else}
					<li>
						<a
							href={item.href ? '/' + item.href : item.link}
							target={item.link ? '_blank' : '_self'}
						>
							{item.title}
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>

	<!-- Fullscreen Mobile Menu -->
	<div class="mobile-menu" class:open={isMenuOpen}>
		<div class="mobile-menu-content">
			<button class="close-btn" on:click={toggleMenu}>×</button>
			<ul class="menu-list">
				{#each menu_items as item}
					{#if item.children}
						<li>
							<span>{item.title}</span>
							<ul>
								{#each item.children as child}
									{#if child.subcategory}
										<li>
											<a href="/{child.href}">{child.title}</a>
											<ul>
												{#each child.subcategory as sub}
													<li><a href="/{sub.href}">{sub.title}</a></li>
												{/each}
											</ul>
										</li>
									{:else}
										<li><a href="/{child.href}">{child.title}</a></li>
									{/if}
								{/each}
							</ul>
						</li>
					{:else}
						<li>
							<a
								href={item.href ? '/' + item.href : item.link}
								target={item.link ? '_blank' : '_self'}
							>
								{item.title}
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</div>
</div>

<!-- Navbar End -->

<style>
	/* General Navbar Styles */
	.navbar {
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 1000;
	}

	.navbar-toggler {
		border: none;
		background: transparent;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.desktop-menu .menu-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.desktop-menu .menu-list > li {
		position: relative;
		margin-right: 20px;
	}

	.desktop-menu .menu-list > li > a,
	.desktop-menu .menu-list > li > span {
		text-decoration: none;
		color: #333;
		font-size: 1rem;
		padding: 10px 15px;
		display: inline-block;
		cursor: pointer;
	}

	.desktop-menu .menu-list .dropdown:hover .dropdown-menu {
		display: block;
	}

	.dropdown-menu {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 100;
		padding: 10px;
	}

	.dropdown-menu li {
		margin: 5px 0;
	}

	.dropdown-menu a {
		color: #555;
		font-size: 0.9rem;
		text-decoration: none;
	}

	/* Mobile Menu Styles */
	.mobile-menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.8);
		transition: opacity 0.3s ease;
		opacity: 0;
		pointer-events: none;
		z-index: 2000;
	}

	.mobile-menu.open {
		opacity: 1;
		pointer-events: auto;
	}

	.mobile-menu-content {
		background: white;
		width: 80vw;
		height: 100vh;
		overflow-y: auto;
		padding: 20px;
		position: relative;
	}

	.close-btn {
		position: absolute;
		top: 20px;
		right: 20px;
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
	}

	.menu-list ul {
		padding-left: 15px;
		margin-top: 5px;
	}

	.menu-list ul li {
		font-size: 1rem;
	}

	.menu-list ul li a {
		color: #666;
	}
</style>
