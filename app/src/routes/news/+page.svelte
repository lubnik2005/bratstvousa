<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	export let data;
	const totalPages = Math.ceil(data.news_articles_count / data.perPage); // Calculate total pages
</script>

<svelte:head>
	<title>Новости — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<Header title="Новости" />

<div class="container-xxl py-6">
	<div class="container">
		<div class="row g-4 g-lg-5">
			{#each data.news_articles as article}
				<div class="col-lg-4 col-md-6">
					<article class="news-entry">
						<a class="news-figure" href="news/{article.slug}" aria-label={article.title}>
							<img
								src="{data.media_url}{article.featuredImage}"
								alt=""
								loading="lazy"
								decoding="async"
							/>
						</a>
						<p class="eyebrow news-date">{article.date_string}</p>
						<a class="news-title" href="news/{article.slug}">{article.title}</a>
					</article>
				</div>
			{/each}
		</div>

		<nav class="pager" aria-label="Навигация по страницам">
			<ul class="pager-list list-unstyled">
				{#if data.page > 1}
					<li>
						<a href="?page={data.page - 1}" aria-label="Предыдущая">&laquo;</a>
					</li>
				{/if}

				{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNumber}
					<li>
						<a
							class:active={pageNumber === data.page}
							aria-current={pageNumber === data.page ? 'page' : undefined}
							href="?page={pageNumber}"
						>
							{pageNumber}
						</a>
					</li>
				{/each}

				{#if data.page < totalPages}
					<li>
						<a href="?page={data.page + 1}" aria-label="Следующая">&raquo;</a>
					</li>
				{/if}
			</ul>
		</nav>
	</div>
</div>

<style>
	.news-figure {
		display: block;
		margin-bottom: 1rem;
	}
	.news-figure img {
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		transition: opacity 0.2s ease;
	}
	.news-figure:hover img {
		opacity: 0.92;
	}
	.news-date {
		color: var(--bs-ink-muted);
		margin-bottom: 0.35rem;
	}
	.news-title {
		display: block;
		font-family: var(--bs-font-serif);
		font-size: 1.2rem;
		line-height: 1.4;
		color: var(--bs-dark);
		text-decoration: none;
	}
	.news-title:hover,
	.news-title:focus-visible {
		color: var(--bs-primary);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}
	.pager {
		margin: 3.5rem 0;
	}
	.pager-list {
		display: flex;
		justify-content: center;
		gap: 0.25rem;
		margin: 0;
	}
	.pager-list a {
		display: block;
		padding: 0.5rem 0.9rem;
		font-size: 0.9rem;
		color: var(--bs-ink-muted);
		text-decoration: none;
		border-bottom: 2px solid transparent;
		transition: color 0.2s ease;
	}
	.pager-list a:hover {
		color: var(--bs-primary);
	}
	.pager-list a.active {
		color: var(--bs-primary);
		border-bottom-color: var(--bs-secondary);
	}
</style>
