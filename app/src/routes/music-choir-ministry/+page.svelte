<script>
	export let data;
	import News from '$lib/components/News.svelte';
	import Events from '$lib/components/Events.svelte';
</script>

<svelte:head>
	<title>Музыкально-хоровой отдел — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="ministry-music" style="--ministry-accent: var(--bs-accent-music);">
	<div class="container-fluid page-header">
		<div class="container">
			<p class="eyebrow ministry-eyebrow">Отделы</p>
			<h1 class="display-3">Музыкально-хоровой отдел</h1>
		</div>
	</div>

	<figure class="ministry-scripture measure mx-auto text-center">
		<blockquote class="scripture scripture-centered">
			«Приидите, воспоём Господу, воскликнем Богу, твердыне спасения нашего»
			<cite>Псалом 94:1</cite>
		</blockquote>
	</figure>

	<div class="container my-6">
		<div class="row justify-content-center">
			<div class="col-lg-7 text-center">
				<p class="eyebrow ministry-eyebrow">Приветственное слово</p>
				<p>
					Дорогие друзья! Музыкально-хоровой отдел МСЦ ЕХБ имеет благодарность Богу и радость за
					благословения в этом служении — за пройденный путь и за то, что молодое поколение
					проявляет в нём усердие и ревность. Благослови вас Бог, чтобы каждый человек послужил Ему
					в своей жизни, и чтобы через музыкальное служение ещё больше прославился наш Великий Бог!
				</p>
				<footer class="blockquote-footer">Павленко Юрий Иванович</footer>
				<div class="mt-4">
					<a class="btn-quiet" target="_blank" rel="noopener" href="https://mscmusic.org/"
						>MSC Music</a
					>
				</div>
			</div>
		</div>

		<div class="row justify-content-center mt-5">
			<div class="col-lg-4 col-md-6">
				<div class="leader-card" style="--leader-accent: var(--bs-accent-music);">
					<img
						src="{data.media_url}upfiles/optimized/music-choir-portrait.jpg"
						alt="Юрий Иванович Павленко"
					/>
					<p class="leader-name">Павленко <br />Юрий Иванович</p>
					<a href="mailto:info@bratstvousa.com">info@bratstvousa.com</a>
				</div>
			</div>
		</div>
	</div>

	<div class="container">
		<Events events={data.events} ministry_slug="music-choir-ministry" />
	</div>

	<News articles={data.articles} media_url={data.media_url} />
</div>

<style>
	.ministry-eyebrow {
		color: var(--ministry-accent);
	}
	.page-header {
		border-bottom-color: var(--ministry-accent);
	}
	.ministry-scripture {
		margin-top: 3.5rem;
	}
	.scripture-centered {
		border-left: 0;
		padding-left: 0;
		font-size: 1.4rem;
	}
	.scripture-centered :global(cite) {
		color: var(--ministry-accent);
	}
</style>
