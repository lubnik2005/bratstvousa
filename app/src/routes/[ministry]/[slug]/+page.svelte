<script lang="ts">
	export let data;
	import '@splidejs/svelte-splide/css';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
</script>

<svelte:head>
	<meta property="og:title" content={data.event?.title} />
	{#if data.event?.featuredImage}
		<meta property="og:image" content="{data.media_url}{data.event?.featuredImage}" />
	{/if}
	<meta property="og:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:type" content="article" />
	{#if data.event?.date}
		<meta property="article:published_time" content={data.event?.date} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.event?.title} />
	<meta name="twitter:description" content="Американское Объединение МСЦ ЕХБ" />
	{#if data.event?.featuredImage}
		<meta name="twitter:image" content="{data.media_url}/{data.event?.featuredImage}" />
	{/if}

	<!-- LinkedIn Support -->
	<meta property="og:site_name" content="Bratstvo USA" />
	<meta name="linkedin:owner" content="Bratstvo USA" />
</svelte:head>

{#if data.event?.featuredImage}
	<div class="container p-0">
		<img src="{data.media_url}{data.event.featuredImage}" class="img-fluid w-100" alt="Top Image" />
	</div>
{/if}

<div class="container-xxl pb-6">
	<div class="container">
		<div class="section-header mx-auto mt-5 text-center" style="max-width: 1000px;">
			<h1 class="display-5 mb-3">{data.event.title}</h1>
			<p>
				{data.event.description}
			</p>
		</div>
	</div>
</div>

<div class="container">
	<div class="blog-content">
		{@html data.event.content}
	</div>
</div>
