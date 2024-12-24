<script>
	import Header from '$lib/components/Header.svelte';
	export let data;
</script>

<Header title={data.news_article.title} />

<div class="container">
	{@html data.news_article.content}
</div>
