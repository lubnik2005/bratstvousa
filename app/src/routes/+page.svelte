<script lang="ts">
	import { hasEventContent } from '$lib/helpers';

	export let data;

	// The server augments each event with these display fields at runtime
	// (see +page.server.ts); surface them to the template with a light type.
	type HomeEvent = {
		slug: string;
		title: string;
		featuredImage?: string | null;
		numerical_date?: string;
		month_short?: string;
		dates_description?: string;
		description?: string | null;
		content?: string | null;
		editorjs?: unknown;
		use_editorjs?: unknown;
	};
	type HomeArticle = {
		slug: string;
		title: string;
		featuredImage?: string | null;
		date?: string | null;
		description?: string;
	};

	$: events = (data.events ?? []) as HomeEvent[];
	$: news_articles = (data.news_articles ?? []) as HomeArticle[];

	const formatArticleDate = (value?: string | null): string =>
		value
			? new Intl.DateTimeFormat('ru-RU', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				}).format(new Date(value))
			: '';
</script>

<svelte:head>
	<link
		fetchpriority="high"
		rel="preload"
		as="image"
		href="{data.media_url}img/bratstvo_header_low.webp"
		type="image/webp"
	/>
	<title>Американское Объединение МСЦ ЕХБ</title>
	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="Братство США - Американское Объединение МСЦ ЕХБ" />
	<meta
		property="og:description"
		content="Официальный сайт Американского Объединения МСЦ ЕХБ - события, новости и ресурсы для христианских общин."
	/>
	<meta property="og:image" content="{data.media_url}img/og-image.webp" />
	<meta property="og:url" content="https://www.bratstvousa.com/" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container-fluid mb-5 p-0">
	<div id="header-carousel" class="carousel slide">
		<div class="carousel-inner">
			<div class="carousel-item active">
				<div class="video-wrapper d-none d-lg-block">
					<video poster="{data.media_url}video/first-frame.webp" autoplay muted loop playsinline>
						<source src="{data.media_url}video/bg-hero-1280.webm" type="video/webm" />
						<source src="{data.media_url}video/bg-hero-1280.mp4" type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<!---->
					<!-- <video muted loop> -->
					<!--     <source poster="{data.media_url}/video/first-frame.webp" src="{data.media_url}/video/bg_compressed_no_audio.webm" type="video/webm" /> -->
					<!--     Your browser does not support the video tag. -->
					<!-- </video> -->
				</div>
				<div class="d-lg-none">
					<div class="image-container">
						<img
							fetchpriority="high"
							loading="eager"
							src="{data.media_url}img/bratstvo_header.webp"
							alt="Братство США - главный баннер"
						/>
					</div>
				</div>
				<div class="carousel-caption">
					<div class="container">
						<div class="hero-wordmark mx-auto">
							<p class="hero-eyebrow">Американское Объединение</p>
							<h1 class="hero-title">МСЦ ЕХБ</h1>
							<p class="hero-scripture">
								«Господь — Пастырь мой; я ни в чём не буду нуждаться»
								<span class="hero-cite">Псалом 22:1</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Carousel Start -->
<!-- <div class="container-fluid mb-5 p-0"> -->
<!-- 	<div id="header-carousel" class="carousel slide" data-bs-ride="carousel"> -->
<!-- 		<div class="carousel-inner"> -->
<!-- 			<div class="carousel-item active"> -->
<!-- 				<video class="w-100" autoplay muted loop> -->
<!-- 					<source src="{data.media_url}/video/bg_compressed_no_audio.webm" type="video/webm" /> -->
<!-- 					Your browser does not support the video tag. -->
<!-- 				</video> -->
<!-- 				<div class="carousel-caption"> -->
<!-- 					<div class="container"> -->
<!-- 						<div class="row justify-content-start"> -->
<!-- 							<div class="col-lg-12"> -->
<!-- 								<h1 class="display-2 animated slideInDown text-outline mb-5 text-center"> -->
<!-- 									Американское Объединение <br /> МСЦ ЕХБ -->
<!-- 								</h1> -->
<!-- 								<!-- <a href="" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a> -->
<!-- 								<!-- <a href="" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 			</div> -->
<!-- 			<div class="carousel-item"> -->
<!-- 				<img class="w-100" src="{data.media_url}img/carousel-2.jpg" alt="Image" /> -->
<!-- 				<div class="carousel-caption"> -->
<!-- 					<div class="container"> -->
<!-- 						<div class="row justify-content-start"> -->
<!-- 							<div class="col-lg-7"> -->
<!-- 								<h1 class="display-2 animated slideInDown mb-5">Natural Food Is Always Healthy</h1> -->
<!-- 								<a href="" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">Products</a> -->
<!-- 								<a href="" class="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3">Services</a> -->
<!-- 							</div> -->
<!-- 						</div> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!-- 		<button -->
<!-- 			class="carousel-control-prev" -->
<!-- 			type="button" -->
<!-- 			data-bs-target="#header-carousel" -->
<!-- 			data-bs-slide="prev" -->
<!-- 		> -->
<!-- 			<span class="carousel-control-prev-icon" aria-hidden="true"></span> -->
<!-- 			<span class="visually-hidden">Previous</span> -->
<!-- 		</button> -->
<!-- 		<button -->
<!-- 			class="carousel-control-next" -->
<!-- 			type="button" -->
<!-- 			data-bs-target="#header-carousel" -->
<!-- 			data-bs-slide="next" -->
<!-- 		> -->
<!-- 			<span class="carousel-control-next-icon" aria-hidden="true"></span> -->
<!-- 			<span class="visually-hidden">Next</span> -->
<!-- 		</button> -->
<!-- 	</div> -->
<!-- </div> -->
<!-- Carousel End -->

{#if events.length}
	<section class="container my-6">
		<div class="featured-event measure-wide mx-auto">
			<p class="eyebrow">Ближайшее событие</p>
			<div class="row g-4 align-items-center">
				{#if events[0]?.featuredImage}
					<div class="col-lg-4 d-none d-lg-block">
						{#if hasEventContent(events[0])}
							<a href="/general-event/{events[0].slug}">
								<img
									src="{data.media_url}{events[0].featuredImage}"
									alt={events[0].title}
									class="featured-event-img"
								/>
							</a>
						{:else}
							<img
								src="{data.media_url}{events[0].featuredImage}"
								alt={events[0].title}
								class="featured-event-img"
							/>
						{/if}
					</div>
				{/if}
				<div class="col-lg-8">
					<h2 class="featured-event-title">{events[0].title}</h2>
					<p class="featured-event-meta">{events[0].dates_description}</p>
					{#if hasEventContent(events[0])}
						<a href="/general-event/{events[0].slug}" class="btn-quiet">Подробнее →</a>
					{/if}
				</div>
			</div>
		</div>
	</section>
{/if}

<div class="container my-6">
	<div class="row g-5 g-lg-6">
		<!-- Upcoming Events -->
		<div class="col-lg-6">
			<div class="section-header mb-4 text-start">
				<p class="eyebrow">Календарь</p>
				<h2>События</h2>
			</div>
			<ul class="home-list list-unstyled">
				{#each events as event}
					<li class="home-event">
						<div class="home-event-when">
							<span class="home-event-day">{event.numerical_date}</span>
							<span class="home-event-month">{event.month_short}</span>
						</div>
						<div class="home-event-body">
							<span class="home-event-title">{event.title}</span>
							<p class="home-event-meta">{event.dates_description}</p>
							{#if event.description}
								<p class="home-event-desc">{event.description}</p>
							{/if}
							{#if hasEventContent(event)}
								<a href="/general-event/{event.slug}" class="btn-quiet home-event-cta">
									Подробнее →
								</a>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Latest News -->
		<div class="col-lg-6">
			<div class="section-header mb-4 text-start">
				<p class="eyebrow">Публикации</p>
				<h2>Новости</h2>
			</div>
			<ul class="home-list list-unstyled">
				{#each news_articles as article}
					<li class="home-news">
						{#if article.featuredImage}
							<a href="/news/{article.slug}" class="home-news-figure">
								<img
									src="{data.media_url}{article.featuredImage}"
									alt={article.title}
									loading="lazy"
								/>
							</a>
						{/if}
						<div class="home-news-body">
							<p class="eyebrow home-news-date">{formatArticleDate(article.date)}</p>
							<a href="/news/{article.slug}" class="home-news-title">{article.title}</a>
							{#if article.description}
								<p class="home-news-desc">{article.description}</p>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	#header-carousel .carousel-item {
		position: relative;
		background-color: black; /* Black background for the bars */
	}

	/* Muting overlay: an even tint across the whole video tones the colours
	   down and evens out the light/dark flicker, layered with a stronger
	   gradient toward the bottom so the wordmark stays legible. */
	.video-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background:
			linear-gradient(
				to bottom,
				rgba(44, 43, 41, 0.25) 0%,
				rgba(44, 43, 41, 0.3) 45%,
				rgba(44, 43, 41, 0.7) 100%
			),
			rgba(44, 43, 41, 0.28);
		z-index: 2;
		pointer-events: none;
	}

	/* General styles for the video wrapper */
	.video-wrapper {
		position: relative;
		max-width: 120rem;
		margin: 0 auto;
		display: block;
		width: 100%;
		height: auto; /* Default height for larger screens */
	}

	/* Ensure the video covers the wrapper */
	.video-wrapper video {
		display: block;
		width: 100%; /* Ensure it stretches the width of the wrapper */
		height: 100%; /* Make it stretch to the full height */
		object-fit: cover; /* Ensures the video fills the container while cropping edges */
		z-index: 1; /* Video below the overlay */
		position: relative;
	}

	/* Responsive styling for smaller screens */
	@media (max-width: 768px) {
		.video-wrapper {
			height: 80vh; /* Full height of the viewport */
			width: 100%; /* Full width */
		}
	}

	/* Caption sits low in the frame, resting on the gradient scrim */
	.carousel-caption {
		position: absolute;
		left: 50%;
		bottom: 8%;
		transform: translateX(-50%);
		z-index: 3;
		text-align: center;
		width: 100%;
	}

	.hero-wordmark {
		color: #f6f2ea;
		max-width: 46rem;
	}

	.hero-eyebrow {
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.25em;
		margin-bottom: 0.75rem;
		color: rgba(246, 242, 234, 0.85);
	}

	.hero-title {
		font-family: 'Lora', serif;
		font-weight: 600;
		font-size: clamp(2.75rem, 6vw, 4.5rem);
		letter-spacing: 0.02em;
		margin: 0;
		color: #f6f2ea;
	}

	.hero-scripture {
		font-family: 'Lora', serif;
		font-style: italic;
		font-size: 1.05rem;
		line-height: 1.6;
		margin: 1.5rem auto 0;
		max-width: 34rem;
		color: rgba(246, 242, 234, 0.92);
	}

	.hero-cite {
		display: block;
		font-style: normal;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		margin-top: 0.6rem;
		color: rgba(246, 242, 234, 0.7);
	}

	@media (max-width: 768px) {
		.carousel-caption {
			bottom: 6%;
		}
	}

	.image-container {
		position: relative;
		/* Fixed hero band on mobile so the caption always sits over the photo.
		   The height lives on the wrapper (not the img) so the image can never
		   collapse to 0 and expose the black carousel background. */
		height: 78vh;
		min-height: 420px;
		max-height: 560px;
		overflow: hidden;
	}

	.image-container img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		filter: blur(2px); /* Soft focus behind the wordmark */
	}

	/* Mobile hero scrim: the caption text is light (#f6f2ea), so darken the
	   blurred image enough for it to read — an even tint plus a stronger
	   gradient toward the bottom where the wordmark sits. */
	.image-container::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background:
			linear-gradient(
				to bottom,
				rgba(44, 43, 41, 0.3) 0%,
				rgba(44, 43, 41, 0.4) 45%,
				rgba(44, 43, 41, 0.72) 100%
			),
			rgba(44, 43, 41, 0.32);
		pointer-events: none; /* Ensures the overlay doesn't block interactions */
	}

	/* Featured event */
	.featured-event {
		padding-top: 2rem;
		border-top: 1px solid var(--bs-rule);
	}

	.featured-event-img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		transition: opacity 0.4s ease;
	}

	.featured-event-img:hover {
		opacity: 0.92;
	}

	.featured-event-title {
		font-family: var(--bs-font-serif, 'Lora', serif);
		color: var(--bs-dark);
		margin-bottom: 0.5rem;
	}

	.featured-event-meta {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.82rem;
		color: var(--bs-ink-muted);
		margin: 0 0 0.85rem;
		white-space: nowrap;
	}

	/* Shared home lists (events + news) */
	.home-list {
		margin: 0;
	}

	/* Events list: day/month rule + serif title */
	.home-event {
		display: grid;
		grid-template-columns: 4.5rem 1fr;
		gap: 1.25rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--bs-rule);
	}

	.home-event:first-child {
		border-top: 1px solid var(--bs-rule);
	}

	.home-event-when {
		text-align: center;
		line-height: 1.1;
	}

	.home-event-day {
		display: block;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1.6rem;
		color: var(--bs-dark);
	}

	.home-event-month {
		display: block;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.7rem;
		color: var(--bs-ink-muted);
		margin-top: 0.15rem;
	}

	.home-event-title {
		display: block;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1.15rem;
		color: var(--bs-dark);
	}

	.home-event-meta {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.78rem;
		color: var(--bs-ink-muted);
		margin: 0.35rem 0 0;
	}

	.home-event-desc {
		margin: 0.5rem 0 0;
		color: var(--bs-body-color);
	}

	.home-event-cta {
		display: inline-block;
		margin-top: 0.6rem;
	}

	/* News list: small figure + serif title */
	.home-news {
		display: flex;
		gap: 1.25rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--bs-rule);
	}

	.home-news:first-child {
		border-top: 1px solid var(--bs-rule);
	}

	.home-news-figure {
		flex: 0 0 auto;
		display: block;
		width: 96px;
	}

	.home-news-figure img {
		display: block;
		width: 96px;
		height: 96px;
		object-fit: cover;
		transition: opacity 0.4s ease;
	}

	.home-news-figure:hover img {
		opacity: 0.92;
	}

	.home-news-body {
		min-width: 0;
	}

	.home-news-date {
		margin-bottom: 0.35rem;
	}

	.home-news-title {
		display: block;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1.1rem;
		color: var(--bs-dark);
		text-decoration: none;
	}

	.home-news-title:hover,
	.home-news-title:focus-visible {
		color: var(--bs-primary);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.home-news-desc {
		margin: 0.5rem 0 0;
		color: var(--bs-body-color);
	}
</style>
