<script>
	export let data;
	export let media_url;
	export let ministry_slug;
	import { regionToLabel } from '$lib/helpers';
	import Events from './Events.svelte';
</script>

<!-- 🔥 Featured Event Section -->
{#if data.news_articles.length}
	<section class="row my-5">
		<div class="col-lg-10 mx-auto">
			<div class="card overflow-hidden border-0 shadow-lg">
				<div class="position-relative">
					<img
						class="img-fluid w-100 object-fit-cover"
						style="max-height: 450px;"
						src="{media_url}{data.news_articles[0].featuredImage}"
						alt={data.news_articles[0].title}
					/>
					<div class="position-absolute text-light bottom-0 start-0 p-4">
						<h2 class="fw-bold text-outline">{data.news_articles[0].title}</h2>
						<p class="lead">{data.news_articles[0].description}</p>
						<span class="fw-bold">{data.news_articles[0].startAtString}</span>
						<div class="mt-3">
							<a href="/news/{data.news_articles[0].slug}" class="btn btn-light">Подробнее</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}
<!-- 🎭 Events -->
<Events events={data.events} {ministry_slug} />
<!-- 📰 News Section -->

<section class="row my-5">
	<h2 class="fw-bold mb-4 text-center">Новости</h2>
	<div class="col-lg-12">
		<div class="row g-3">
			{#each data.news_articles as article}
				<div class="col-md-6 col-lg-4">
					<div class="news-card position-relative overflow-hidden">
						<!-- 📸 News Image -->
						{#if article.featuredImage}
							<img
								class="news-image w-100 object-fit-cover"
								src={`${media_url}${article.featuredImage}`}
								alt={article.title}
							/>
						{/if}

						<!-- 📝 Overlayed Content -->
						<div class="news-overlay">
							<h5 class="news-title">{article.title}</h5>
							<span class="news-date">{article.date}</span>
							<a href={`/news/${article.slug}`} class="btn btn-sm btn-light mt-2">Читать</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	:root {
		--bs-primary: #2c3e50;
		--bs-dark: #1a252f;
	}

	.card {
		border-radius: 12px;
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
	}

	/* 📅 Event Date Block */
	.event-date {
		background: var(--bs-dark);
		color: #ffffff;
		min-width: 70px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 1.4rem;
		font-weight: bold;
		padding: 15px 0;
		border-radius: 12px 0 0 12px;
	}

	.event-divider {
		font-size: 1rem;
		opacity: 0.6;
		margin: 2px 0;
	}

	.event-details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* 📰 News Cards */
	.news-card {
		height: 350px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.news-image {
		height: 70%;
		object-fit: cover;
	}

	/* 🎭 News Overlay */
	.bg-dark.opacity-50 {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 30%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		backdrop-filter: blur(4px);
	}

	:root {
		--bs-primary: #2c3e50;
		--bs-dark: #1a252f;
	}

	.news-card {
		height: 350px;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease-in-out;
	}

	.news-card:hover {
		transform: translateY(-3px);
		box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
	}

	/* 📸 Ensure News Images Fit */
	.news-image {
		height: 100%;
		object-fit: cover;
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}

	/* 📝 Overlay Content */
	.news-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 15px;
		backdrop-filter: blur(4px);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border-radius: 0 0 12px 12px;
	}

	.news-title {
		color: white;
		font-size: 1.1rem;
		margin-bottom: 5px;
	}

	.news-date {
		font-size: 0.85rem;
		opacity: 0.8;
	}
	.text-outline {
		color: white;
		-webkit-text-stroke: 1px black; /* Black outline */
	}
</style>
