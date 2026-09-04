<script>
	export let data;
	import GenericPage from '$lib/components/GenericPage.svelte';
</script>

<svelte:head>
	<title>Семейный отдел — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="ministry-family" style="--ministry-accent: var(--bs-accent-family);">
	<div class="container-fluid page-header">
		<div class="container">
			<p class="eyebrow ministry-eyebrow">Отделы</p>
			<h1 class="display-3">Семейный отдел</h1>
		</div>
	</div>

	<div class="container my-6">
		<div class="row g-5">
			<div class="col-lg-7">
				<p class="eyebrow ministry-eyebrow">Приветственное слово</p>
				<figure class="family-scripture">
					<blockquote class="scripture">
						«А я и дом мой будем служить Господу»
						<cite>Иисуса Навина 24:15</cite>
					</blockquote>
				</figure>
				<p>
					Эти слова произнёс Иисус Навин, вождь народа Израильского, которого Бог поставил после
					Моисея. Каждая поместная церковь состоит из семей, поэтому очень важно, чтобы семьи были
					крепкие, богобоязненные и служили Господу.
				</p>
				<p>
					На протяжении нескольких лет, в Американском объединении, совершается служение семейного
					отдела. Во всех четырёх регионах есть ответственные за это служение братья, которые
					проводят семейные лагеря, общения для сестёр, общения для отцов и сыновей, мам и дочерей,
					общения для семей в которых есть дети с ограниченными возможностями, а также для вдов и
					одиноких. Совершаются молитвы над детьми.
				</p>
				<p>
					Слава Господу! Молимся, чтобы Бог сохранил наши семьи для неба, хранил от разрушений. Да
					будет имя Господа нашего прославлено вовеки. Слава Ему.
				</p>
			</div>
			<div class="col-lg-4 offset-lg-1">
				<div class="leader-card" style="--leader-accent: var(--bs-accent-family);">
					<img
						src="{data.media_url}upfiles/page/e76ed1bc8553f6df3a8dff8e774622c926341736.jpg"
						alt="Виктор Владимирович Помазнюк"
					/>
					<p class="leader-name">Помазнюк <br />Виктор Владимирович</p>
					<a href="mailto:info@bratstvousa.com">info@bratstvousa.com</a>
				</div>
			</div>
		</div>
	</div>

	<GenericPage media_url={data.media_url} {data} ministry_slug="family-ministry" />
</div>

<style>
	.ministry-eyebrow {
		color: var(--ministry-accent);
	}
	.page-header {
		border-bottom-color: var(--ministry-accent);
	}
	.family-scripture {
		margin: 1.5rem 0 2.5rem;
	}
	.family-scripture .scripture {
		border-left-color: var(--ministry-accent);
	}
</style>
