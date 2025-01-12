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
			slideEffect: 'slide',
		});
    console.log("Lightbox initialized: ", lightbox);
	});
</script>

<div class="container p-0">
	<img
		src="{data.media_url}{data.news_article.featured_image}"
		class="img-fluid w-100"
		alt="Top Image"
	/>
</div>

<Header title={data.news_article.title} />

<div class="container">
	{@html data.news_article.content}
</div>

{#if data?.images?.length}
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

		<div class="container">
			<div class="gallightbox">
				{#each data.images as image}
					<a 
            href="{data.media_url}{image.id}/{image.fileName}" 
            class="glightbox" 
            data-gallery="gallery">
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

{#if data?.audios}
  {#each data.audios as audio}
    <audio controls>
      <source src="{data.media_url}{audio.id}/{audio.fileName}" type="{audio.mime_type}">
      Your browser does not support the audio element.
    </audio>
  {/each}
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
		transition: transform 0.3s, box-shadow 0.3s;
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
</style>
