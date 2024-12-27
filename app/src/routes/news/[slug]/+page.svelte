<script>
	import Header from '$lib/components/Header.svelte';
	export let data;
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
