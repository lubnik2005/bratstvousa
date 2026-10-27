<script lang="ts">
	import ArrowIcon from '$lib/components/ArrowIcon.svelte';
	import { menu_items } from './menu_items';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	export let media_url;

	let isOpen = false;
	let activeItem: number | null = null;
	let activeSubcategory: number | null = null;
	onMount(() => {
		const open = (): void => {
			isOpen = true;
			document.body.style.overflow = 'hidden';
		};
		const escape = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') closeMenu();
		};
		window.addEventListener('open-app-menu', open);
		window.addEventListener('keydown', escape);
		return () => {
			window.removeEventListener('open-app-menu', open);
			window.removeEventListener('keydown', escape);
			document.body.style.overflow = '';
		};
	});
	$: if ($page.url.searchParams.get('menu') === 'open') isOpen = true;
	afterNavigate(() => {
		if ($page.url.searchParams.get('menu') !== 'open') closeMenu();
	});

	const closeMenu = () => {
		isOpen = false;
		document.body.style.overflow = 'auto';
	};

	const toggleItem = (index: number) => {
		activeItem = activeItem === index ? null : index;
	};

	const toggleSubcategory = (index: number) => {
		activeSubcategory = activeSubcategory === index ? null : index;
	};

	// Close the menu when clicking a link
	const handleLinkClick = (): void => closeMenu();
</script>

<div>
	<!-- Mobile Header -->
	<header class="mobile-header d-lg-none">
		<a class="mobile-home-link" href="/" aria-label="Американское Объединение МСЦ ЕХБ — главная">
			<img src="{media_url}logo.png" alt="" width="58" height="40" />
			<span class="mobile-brand-title">Американское Объединение<br />МСЦ ЕХБ</span>
		</a>
	</header>
	<!-- Menu Backdrop -->
	{#if isOpen}
		<button type="button" class="menu-backdrop" aria-label="Закрыть меню" on:click={closeMenu}
		></button>
	{/if}

	<!-- Fullscreen Mobile Menu -->
	<nav class="fullscreen-menu {isOpen ? 'open' : ''}" inert={!isOpen} aria-label="Все разделы">
		<!-- Close Button in Header -->
		<div class="menu-header">
			<h2>Все разделы</h2>
			<button class="close-btn" aria-label="Закрыть меню" on:click={closeMenu}>&times;</button>
		</div>

		<ul class="list-unstyled p-3">
			<li><a href="/" class="d-block py-2" on:click={handleLinkClick}>Главная</a></li>
			{#each menu_items as item, index}
				<li>
					{#if item.children}
						<button
							type="button"
							class="submenu-toggle"
							aria-expanded={activeItem === index}
							on:click={() => toggleItem(index)}
						>
							{item.title}
							<span class="toggle-mark" class:open={activeItem === index}></span>
						</button>
						<ul
							class="list-unstyled ms-3"
							style="display: {activeItem === index ? 'block' : 'none'}"
						>
							{#each item.children as child}
								<li>
									<a href={child.href} class="d-block py-1" on:click={handleLinkClick}
										>{child.title}</a
									>
								</li>
								{#if child.subcategory}
									<ul>
										{#each child.subcategory as sub}
											<li><a href={sub.href} on:click={handleLinkClick}>{sub.title}</a></li>
										{/each}
									</ul>
								{/if}
							{/each}
						</ul>
					{:else if item.subcategory}
						<button
							type="button"
							class="submenu-toggle"
							aria-expanded={activeSubcategory === index}
							on:click={() => toggleSubcategory(index)}
						>
							{item.title}
							<span class="toggle-mark" class:open={activeSubcategory === index}></span>
						</button>
						<ul
							class="list-unstyled ms-3"
							style="display: {activeSubcategory === index ? 'block' : 'none'}"
						>
							{#each item.subcategory as sub}
								<li>
									<a href={sub.href} class="d-block py-1" on:click={handleLinkClick}>{sub.title}</a>
								</li>
							{/each}
						</ul>
					{:else if item.href}
						<a href={item.href} class="d-block py-2" on:click={handleLinkClick}>{item.title}</a>
					{:else if item.link}
						<a href={item.link} target="_blank" rel="noopener noreferrer" class="d-block py-2"
							>{item.title}</a
						>
					{/if}
				</li>
			{/each}
		</ul>
		<div class="menu-extras">
			<section aria-labelledby="menu-contact">
				<h3 id="menu-contact">На связи</h3>
				<a href="mailto:info@bratstvousa.com">info@bratstvousa.com <ArrowIcon /></a>
				<a href="https://www.youtube.com/@bratstvousa" target="_blank" rel="noopener noreferrer"
					>YouTube Братства <ArrowIcon /></a
				>
			</section>
			<section aria-labelledby="menu-partners">
				<h3 id="menu-partners">Служения и ресурсы</h3>
				<a href="https://awakeningmission.org/" target="_blank" rel="noopener noreferrer"
					>Awakening Mission <ArrowIcon /></a
				>
				<a href="https://missionrem.org/" target="_blank" rel="noopener noreferrer"
					>Mission REM <ArrowIcon /></a
				>
				<a href="https://mscmusic.org/" target="_blank" rel="noopener noreferrer"
					>MSC Music <ArrowIcon /></a
				>
				<a href="https://iosifnichita.com/" target="_blank" rel="noopener noreferrer"
					>Iosif Nichita <ArrowIcon /></a
				>
			</section>
			<a href="/privacy-policy" on:click={handleLinkClick}>Политика конфиденциальности</a>
			<p class="menu-copyright">© Bratstvo USA. All Rights Reserved.</p>
		</div>
	</nav>
</div>

<style>
	.mobile-header {
		top: 0;
		left: 0;
		width: 100%;
		height: 60px;
		background: var(--bs-paper, #f6f2ea);
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.mobile-header img {
		height: 40px;
		width: auto;
	}

	.mobile-home-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 100%;
		height: 100%;
		padding: 0 15px;
		text-decoration: none;
	}

	.mobile-brand-title {
		margin: 0;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1rem;
		font-weight: 600;
		color: var(--bs-primary, #5a4a42);
		text-align: center;
	}

	.menu-extras {
		padding: 0 20px 24px;
	}
	.menu-extras section {
		border-top: 1px solid #ddd5c8;
		padding-block: 20px 12px;
	}
	.menu-extras h3 {
		font-size: 12px;
		color: #746b5d;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.menu-extras a {
		display: flex;
		align-items: center;
		min-height: 44px;
		font-size: 14px;
		color: #354f41;
		text-decoration: none;
	}
	.menu-copyright {
		font-size: 11px;
		color: #746b5d;
		margin: 16px 0 0;
	}
	.menu-header h2 {
		margin: 0 auto 0 0;
		font-size: 20px;
	}

	.fullscreen-menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100dvh;
		background: var(--bs-paper, #f6f2ea);
		overflow-y: auto;
		z-index: 999;
		transform: translateX(100%);
		transition: transform 0.3s ease;
		padding-top: 60px;
		padding-bottom: calc(90px + env(safe-area-inset-bottom));
	}

	.fullscreen-menu.open {
		transform: translateX(0);
	}

	.menu-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(44, 43, 41, 0.45);
		border: none;
		padding: 0;
		z-index: 998;
	}

	.menu-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 60px;
		background: var(--bs-paper, #f6f2ea);
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 20px;
		z-index: 1000;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--bs-dark, #2c2b29);
		font-size: 28px;
		line-height: 1;
		cursor: pointer;
	}

	.submenu-toggle {
		cursor: pointer;
		width: 100%;
		background: none;
		border: none;
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 0;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1.05rem;
		color: var(--bs-dark, #2c2b29);
		text-align: left;
	}

	/* +/- indicator drawn in CSS */
	.toggle-mark {
		position: relative;
		width: 12px;
		height: 12px;
		flex-shrink: 0;
	}

	.toggle-mark::before,
	.toggle-mark::after {
		content: '';
		position: absolute;
		background: var(--bs-ink-muted, #736a5f);
		transition: opacity 0.2s ease;
	}

	.toggle-mark::before {
		top: 50%;
		left: 0;
		width: 100%;
		height: 1.5px;
		transform: translateY(-50%);
	}

	.toggle-mark::after {
		left: 50%;
		top: 0;
		height: 100%;
		width: 1.5px;
		transform: translateX(-50%);
	}

	.toggle-mark.open::after {
		opacity: 0;
	}

	.fullscreen-menu a {
		color: var(--bs-body-color, #3a352f);
		text-decoration: none;
	}

	.fullscreen-menu a:hover,
	.fullscreen-menu a:focus-visible {
		color: var(--bs-primary, #5a4a42);
	}
</style>
