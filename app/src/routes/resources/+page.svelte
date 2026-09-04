<script lang="ts">
	const cards = [
		{
			href: '/brothers-guide',
			title: 'Методическое пособие для братских общений',
			subtitle:
				'12 тем из 1-го Послания к Тимофею. Встречи раз в месяц, укрепляющие духовный рост и братское общение.',
			badge: 'PDF • RUS / ENG / ROM'
		}
		// add more resources here later…
	];
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Ресурсы — Отдел библейского образования</title>
	<meta property="og:title" content="Ресурсы" />
	<meta name="twitter:title" content="Ресурсы" />
	<meta
		property="og:image"
		content="https://bratstvo-usa.s3.us-west-2.amazonaws.com/logo_medium.png"
	/>

	<meta
		name="description"
		content="«Чтобы … ты знал, как должно поступать в доме Божием …» (1Тим 3:15)"
	/>
</svelte:head>

<Header
	title="Ресурсы"
	subtitle="«Чтобы … ты знал, как должно поступать в доме Божием …» (1Тим 3:15)"
/>

<div class="container-xxl py-6">
	<div class="container">
		<section class="mb-4">
			<p class="text-dark">
				Учитывая многообразие служений в поместной церкви и осознавая необходимость уделять внимание
				различным группам верующих, Отдел библейского образования Американского объединения ставит
				своей целью разработку и предоставление методических пособий, призванных содействовать
				проведению систематических и регулярных бесед с разными категориями членов поместной церкви.
			</p>
		</section>

		<section class="row g-4 g-lg-5">
			{#each cards as c}
				<div class="col-md-6 col-lg-4">
					<a class="resource-entry" href={c.href}>
						<p class="eyebrow resource-badge">{c.badge}</p>
						<h2 class="resource-title">{c.title}</h2>
						<p class="resource-desc">{c.subtitle}</p>
						<span class="btn-quiet">Подробнее</span>
					</a>
				</div>
			{/each}
		</section>
	</div>
</div>

<style>
	.resource-entry {
		display: block;
		padding: 1.75rem;
		background: var(--bs-paper-sunk);
		border: 1px solid var(--bs-rule);
		border-top: 2px solid var(--bs-secondary);
		text-decoration: none;
		height: 100%;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.resource-entry:hover,
	.resource-entry:focus-visible {
		border-color: var(--bs-rule-strong);
		border-top-color: var(--bs-primary);
		background: var(--bs-paper);
	}
	.resource-entry:hover .resource-title,
	.resource-entry:focus-visible .resource-title {
		color: var(--bs-primary);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}
	.resource-entry:hover .btn-quiet,
	.resource-entry:focus-visible .btn-quiet {
		color: var(--bs-dark);
		border-bottom-color: var(--bs-dark);
	}
	.resource-badge {
		color: var(--bs-ink-muted);
		margin-bottom: 0.75rem;
	}
	.resource-title {
		font-family: var(--bs-font-serif);
		font-size: 1.3rem;
		color: var(--bs-dark);
		margin-bottom: 0.75rem;
	}
	.resource-desc {
		color: var(--bs-body-color);
		margin-bottom: 1.25rem;
	}
</style>
