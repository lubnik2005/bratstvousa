<script>
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import 'glightbox/dist/css/glightbox.css';

	export let data;

	onMount(async () => {
		// Dynamically import GLightbox for the browser
		const { default: GLightbox } = await import('glightbox');
		const lightbox = GLightbox({
			selector: '.glightbox',
			touchNavigation: true,
			loop: true,
			openEffect: 'zoom',
			closeEffect: 'fade',
			slideEffect: 'slide'
		});
	});
</script>

<svelte:head>
	<meta property="og:title" content={data.news_article?.title} />
	{#if data.news_article?.featuredImage}
		<meta property="og:image" content={data.media_url + data.news_article.featuredImage} />
	{/if}
	<meta property="og:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:type" content="article" />
	{#if data.news_article?.date}
		<meta property="article:published_time" content={data.news_article.date} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.news_article?.title} />
	<meta name="twitter:description" content="Американское Объединение МСЦ ЕХБ" />
	{#if data.news_article?.featuredImage}
		<meta name="twitter:image" content={data.media_url + data.news_article.featuredImage} />
	{/if}
	<meta property="og:site_name" content="Bratstvo USA" />
	<title>{data.news_article?.title}</title>
	<meta name="description" content="Американское Объединение МСЦ ЕХБ" />
</svelte:head>





<!-- <div class="container p-0"> -->
<!-- 	<img -->
<!-- 		src="{data.media_url}{data.news_article.featuredImage}" -->
<!-- 		class="img-fluid w-100" -->
<!-- 		alt="Top Image" -->
<!-- 	/> -->
<!-- </div> -->

<Header title={data.news_article.title} />
<div class="blog-container mx-auto px-3">
	<div class="blog-content">
		{@html data.news_article.content}
	</div>
</div>

{#if data?.images?.length > 0}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">Галерия</h1>
					</div>
				</div>
			</div>
		</div>

		<div class="blog-container py-5">
			<div class="gallightbox">
				{#each data.images as image}
					<a
						href="{data.media_url}{image.id}/{image.fileName}"
						class="glightbox"
						data-gallery="gallery"
					>
						<img
							src="{data.media_url}{image.id}/conversions/{image.name}-gallery_thumbnails.jpg"
							alt={image.fileName}
						/>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}

{#if data?.audios.length}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">Аудио Галерия</h1>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			{#each data.audios as audio}
				<div class="col-lg-5" style="outline:solid red 1px">
					<h3>{audio.fileName}</h3>
					<audio controls style="width:100%">
						<source src="{data.media_url}{audio.id}/{audio.fileName}" type={audio.mime_type} />
						Your browser does not support the audio element.
					</audio>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.gallightbox {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
		padding: 20px;
	}

	.gallightbox a {
		display: block;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}

	.gallightbox a:hover {
		transform: scale(1.1);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	}

	.gallightbox img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		transition: opacity 0.3s;
	}

	.gallightbox img:hover {
		opacity: 0.8;
	}

	/* Lightbox image customization */
	.glightbox .gslide-image {
		width: auto !important;
		height: auto !important;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	img {
		width: auto !important;
		height: auto !important;
		max-width: 100%; /* Make the image responsive */
	}

	.blog-container {
		max-width: 760px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.blog-content {
		line-height: 1.7;
		font-size: 1.1rem;
	}

	.blog-content h1,
	.blog-content h2,
	.blog-content h3 {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.blog-content img {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 1.5rem 0;
	}
</style>
