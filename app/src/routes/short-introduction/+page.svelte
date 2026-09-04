<script>
	import Header from '$lib/components/Header.svelte';

	export let data;
</script>

<svelte:head>
	<title>Краткий обзор — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="page-hero-band">
	<img
		src="{data.media_url}upfiles/optimized/short-introduction.webp"
		class="page-hero-img"
		alt="Краткий обзор братства"
	/>
</div>

<Header title="Краткий обзор" />

<div class="container-xxl py-6">
	<div class="container">
		<div class="blog-content">
			{@html data.short_introduction_content}
		</div>
	</div>
</div>
