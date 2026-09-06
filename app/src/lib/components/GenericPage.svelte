<script>
	export let data;
	export let media_url;
	export let ministry_slug;
	import Events from './Events.svelte';
</script>

<!-- Featured article -->
{#if data.news_articles?.length}
	<section class="featured my-6">
		<div class="measure-wide mx-auto">
			<article class="featured-article">
				{#if data.news_articles[0].featuredImage}
					<a href="/news/{data.news_articles[0].slug}" class="featured-figure">
						<img
							class="img-fluid w-100"
							src="{media_url}{data.news_articles[0].featuredImage}"
							alt={data.news_articles[0].title}
						/>
					</a>
				{/if}
				<div class="featured-body">
					{#if data.news_articles[0].startAtString}
						<p class="eyebrow mb-2">{data.news_articles[0].startAtString}</p>
					{/if}
					<h2 class="h3 mb-3">
						<a href="/news/{data.news_articles[0].slug}">{data.news_articles[0].title}</a>
					</h2>
					<p class="featured-desc mb-3">{data.news_articles[0].description}</p>
					<a href="/news/{data.news_articles[0].slug}" class="btn-quiet">Подробнее</a>
				</div>
			</article>
		</div>
	</section>
{/if}

<!-- Events -->
<Events events={data.events} {ministry_slug} />

<!-- News -->
{#if data.news_articles?.length > 1}
	<section class="news my-6">
		<div class="container">
			<p class="eyebrow mb-2 text-center">Публикации</p>
			<h2 class="mb-5 text-center">Новости</h2>
			<div class="row g-4 g-lg-5">
			{#each data.news_articles.slice(1) as article}
				<div class="col-md-6 col-lg-4">
					<article class="news-entry">
						{#if article.featuredImage}
							<a href={`/news/${article.slug}`} class="news-figure">
								<img
									class="img-fluid w-100"
									src={`${media_url}${article.featuredImage}`}
									alt={article.title}
								/>
							</a>
						{/if}
						{#if article.date}
							<p class="eyebrow mb-1 mt-3">{article.date}</p>
						{/if}
						<h3 class="h6 mb-0">
							<a href={`/news/${article.slug}`}>{article.title}</a>
						</h3>
					</article>
				</div>
			{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.featured-article {
		display: grid;
		gap: 1.75rem;
	}

	.featured-figure {
		display: block;
		overflow: hidden;
	}

	.featured-figure img {
		transition: opacity 0.4s ease;
	}

	.featured-figure:hover img {
		opacity: 0.92;
	}

	.featured-body h2 a {
		font-family: 'Lora', serif;
		color: var(--bs-dark, #2c2b29);
		text-decoration: none;
	}

	.featured-body h2 a:hover,
	.featured-body h2 a:focus-visible {
		color: var(--bs-primary, #5a4a42);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.featured-desc {
		color: var(--bs-body-color, #3a352f);
	}

	.news-figure {
		display: block;
		overflow: hidden;
	}

	.news-figure img {
		aspect-ratio: 3 / 2;
		object-fit: cover;
		transition: opacity 0.4s ease;
	}

	.news-figure:hover img {
		opacity: 0.92;
	}

	.news-entry h3 a {
		font-family: 'Lora', serif;
		color: var(--bs-dark, #2c2b29);
		text-decoration: none;
	}

	.news-entry h3 a:hover,
	.news-entry h3 a:focus-visible {
		color: var(--bs-primary, #5a4a42);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}
</style>
