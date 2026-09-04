<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let articles: any[] = [];
	export let title = 'Новости';
	export let subtitle: string | undefined = undefined;
	export let media_url = '/';
</script>

{#if articles?.length}
	<section class="my-6">
		<div class="container">
			<div class="section-header mb-5 text-start">
				<p class="eyebrow">Публикации</p>
				<h2 class="mb-2">{title}</h2>
				{#if subtitle}
					<p class="text-muted mb-0">{subtitle}</p>
				{/if}
			</div>
			<div class="row g-4 g-lg-5">
				{#each articles as article}
					<div class="col-md-6 col-lg-4">
						<article class="news-entry">
							{#if article.featuredImage}
								<a
									class="news-figure d-block"
									href={`/news/${article.slug}`}
									aria-label={article.title}
								>
									<img src={`${media_url}${article.featuredImage}`} alt="" />
								</a>
							{/if}
							<p class="eyebrow mb-1 mt-3">{article.dateString}</p>
							<a class="news-title" href={`/news/${article.slug}`}>{article.title}</a>
						</article>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.news-figure img {
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		transition: opacity 0.4s ease;
	}
	.news-figure:hover img {
		opacity: 0.92;
	}
	.news-title {
		display: block;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1.15rem;
		line-height: 1.35;
		color: var(--bs-dark);
		text-decoration: none;
	}
	.news-title:hover,
	.news-title:focus-visible {
		color: var(--bs-primary);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}
</style>
