<script lang="ts">
	import { menu_items } from './menu_items';
	export let media_url;

	let isOpen = false;
	let activeItem: number | null = null;
	let activeSubcategory: number | null = null;

	const toggleMenu = () => {
		isOpen = !isOpen;
		document.body.style.overflow = isOpen ? 'hidden' : 'auto';
	};

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
	const handleLinkClick = (event: MouseEvent) => {
		event.preventDefault();
		const href = (event.currentTarget as HTMLAnchorElement)?.getAttribute('href');
		if (href) {
			closeMenu();
			setTimeout(() => {
				window.location.href = href;
			}, 200); // Delay to allow the closing animation
		}
	};
</script>

<div>
	<!-- Mobile Header -->
	<header class="mobile-header d-lg-none">
		<!-- Logo on the Left -->
		<a href="/">
			<img src="{media_url}logo.png" alt="Логотип Братства США" width="58" height="40" />
		</a>

		<!-- Title in the Center -->
		<h1>Американское Объединение МСЦ ЕХБ</h1>

		<!-- Hamburger Menu on the Right -->
		<button class="hamburger-menu" aria-label="Открыть меню" on:click={toggleMenu}>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</header>
	<!-- Menu Backdrop -->
	{#if isOpen}
		<button type="button" class="menu-backdrop" aria-label="Закрыть меню" on:click={closeMenu}
		></button>
	{/if}

	<!-- Fullscreen Mobile Menu -->
	<nav class="fullscreen-menu {isOpen ? 'open' : ''}">
		<!-- Close Button in Header -->
		<div class="menu-header">
			<button class="close-btn" aria-label="Закрыть меню" on:click={closeMenu}>&times;</button>
		</div>

		<ul class="list-unstyled p-3">
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
		justify-content: space-between;
		padding: 0 15px;
		z-index: 1000;
	}

	.mobile-header img {
		height: 40px;
		width: auto;
	}

	.mobile-header h1 {
		margin: 0;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1rem;
		font-weight: 600;
		color: var(--bs-primary, #5a4a42);
		text-align: center;
		flex-grow: 1;
		padding: 0 0.75rem;
	}

	/* Hamburger: three quiet ink rules */
	.hamburger-menu {
		width: 32px;
		height: 28px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px 2px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.hamburger-menu span {
		display: block;
		height: 1.5px;
		width: 100%;
		background: var(--bs-dark, #2c2b29);
	}

	.fullscreen-menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--bs-paper, #f6f2ea);
		overflow-y: auto;
		z-index: 999;
		transform: translateX(100%);
		transition: transform 0.3s ease;
		padding-top: 60px;
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
