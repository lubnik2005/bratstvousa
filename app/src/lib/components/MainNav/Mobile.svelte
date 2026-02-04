<script lang="ts">
	import { menu_items } from './menu_items';
	export let media_url;

	let isOpen = false;
	let activeItem = null;
	let activeSubcategory = null;

	const toggleMenu = () => {
		isOpen = !isOpen;
		document.body.style.overflow = isOpen ? 'hidden' : 'auto';
	};

	const closeMenu = () => {
		isOpen = false;
		document.body.style.overflow = 'auto';
	};

	const toggleItem = (index) => {
		activeItem = activeItem === index ? null : index;
	};

	const toggleSubcategory = (index) => {
		activeSubcategory = activeSubcategory === index ? null : index;
	};

	// Close the menu when clicking a link
	const handleLinkClick = (event) => {
		event.preventDefault();
		const href = event.target.getAttribute('href');
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
		<button class="hamburger-menu" aria-label="Открыть меню" on:click={toggleMenu}> ☰ </button>
	</header>
	<!-- Menu Backdrop -->
	{#if isOpen}
		<div class="menu-backdrop" on:click={closeMenu}></div>
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
						<div class="submenu-toggle" on:click={() => toggleItem(index)}>
							{item.title}
							<span>{activeItem === index ? '−' : '+'}</span>
						</div>
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
						<div class="submenu-toggle" on:click={() => toggleSubcategory(index)}>
							{item.title}
							<span>{activeSubcategory === index ? '−' : '+'}</span>
						</div>
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
	.fullscreen-menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #fff;
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
		background: rgba(0, 0, 0, 0.5);
		z-index: 998;
	}

	.menu-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 60px;
		background: #333;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 20px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		z-index: 1000;
	}

	.close-btn {
		background: none;
		border: none;
		color: #fff;
		font-size: 28px;
		cursor: pointer;
	}

	.submenu-toggle {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		border-bottom: 1px solid #ddd;
	}

	.mobile-header {
		top: 0;
		left: 0;
		width: 100%;
		height: 60px;
		background: #fff;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
		font-size: 18px;
		text-align: center;
		flex-grow: 1;
	}

	.hamburger-menu {
		font-size: 28px;
		background: none;
		border: none;
		cursor: pointer;
	}

	/* Menu Styles */
	.fullscreen-menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #fff;
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
		background: rgba(0, 0, 0, 0.5);
		z-index: 998;
	}
</style>
