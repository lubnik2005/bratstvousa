<script>
	import News from '$lib/components/News.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	export let data;

	const programs = [
		{
			title: 'Библейская школа',
			href: '/bible-school-ministry',
			description:
				'Четыре года глубокого изучения догматов Писания, экзегетики и принципов проповеди.'
		},
		{
			title: 'Библейские курсы',
			href: '/bible-courses-ministry',
			description: 'Четырёхгодичные курсы, дающие основу для начального уровня проповедования.'
		},
		{
			title: 'Ресурсы',
			href: '/resources',
			description: 'Материалы для самостоятельного изучения Священного Писания.'
		}
	];
</script>

<svelte:head>
	<title>Отдел библейского образования — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="ministry-bible" style="--ministry-accent: var(--bs-accent-bible);">
	<div class="container-fluid page-header">
		<div class="container">
			<p class="eyebrow ministry-eyebrow">Отделы</p>
			<h1 class="display-3">Отдел библейского образования</h1>
		</div>
	</div>

	<div class="container my-6">
		<div class="row g-5">
			<div class="col-lg-8">
				<p class="eyebrow ministry-eyebrow">Приветственное обращение</p>
				<figure class="bible-scripture">
					<blockquote class="scripture">
						«Вникай в себя и в учение; занимайся сим постоянно»
						<cite>1 Тимофею 4:16</cite>
					</blockquote>
				</figure>
				<p>
					Апостол Павел призывает Тимофея к постоянному исследованию Писания. Это остаётся важной
					необходимостью и для христиан нашего времени.
				</p>
				<p>
					Задача Отдела библейского образования — повышать уровень познания Священного Писания,
					сформировать верное понимание основ христианской веры, а также развивать навыки изучения и
					интерпретации Библии у студентов объединения.
				</p>
				<p>
					Первое знакомство с Библией в семьях продолжается в Библейской школе для подростков,
					которая на постоянной основе проходит в регионах нашего объединения. Этот важный этап
					помогает подросткам заложить фундамент для дальнейшего духовного роста и понимания
					Священного Писания.
				</p>
				<p>
					Затем молодёжь имеет возможность изучать библейские дисциплины на четырёхгодичных
					библейских курсах, которые дают основу для начального уровня проповедования. Пройдя через
					последовательные этапы библейского образования, верующие могут глубже понимать Писание,
					укрепить свою веру и быть готовыми к служению.
				</p>
			</div>
			<div class="col-lg-4">
				<div class="leader-card" style="--leader-accent: var(--bs-accent-bible);">
					<img src="{data.media_url}upfiles/photos/Диакону.jpg" alt="Диакону Дмитрий" />
					<p class="leader-name">Диакону <br />Дмитрий</p>
					<a href="mailto:bibleeducation@bratstvousa.com">bibleeducation@bratstvousa.com</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Learning pathway -->
	<div class="pathway-band">
		<div class="container">
			<p class="eyebrow ministry-eyebrow">Программы обучения</p>
			<h2 class="mb-4" style="font-family: var(--bs-font-serif);">Ступени образования</h2>
			<ol class="pathway list-unstyled">
				{#each programs as program, i}
					<li class="pathway-item">
						<a href={program.href} class="pathway-link">
							<span class="pathway-num">{String(i + 1).padStart(2, '0')}</span>
							<span class="pathway-body">
								<span class="pathway-title">{program.title}</span>
								<span class="pathway-desc">{program.description}</span>
							</span>
							<span class="pathway-arrow" aria-hidden="true">&rarr;</span>
						</a>
					</li>
				{/each}
			</ol>
		</div>
	</div>

	<UpcomingEvents
		ministry_slug="bible-courses-ministry"
		show_filters={false}
		upcomingEvents={data.events}
		media_url={data.media_url}
	/>
	<News articles={data.articles} media_url={data.media_url} />
</div>

<style>
	.ministry-eyebrow {
		color: var(--ministry-accent);
	}
	.page-header {
		border-bottom-color: var(--ministry-accent);
	}
	.bible-scripture {
		margin: 1.5rem 0 2.5rem;
	}
	.bible-scripture .scripture {
		border-left-color: var(--ministry-accent);
	}
	.pathway-band {
		background: var(--bs-paper-sunk);
		border-top: 1px solid var(--bs-rule);
		border-bottom: 1px solid var(--bs-rule);
		padding: 4rem 0;
		margin: 3rem 0;
	}
	.pathway {
		margin: 0;
	}
	.pathway-item {
		border-top: 1px solid var(--bs-rule);
	}
	.pathway-item:last-child {
		border-bottom: 1px solid var(--bs-rule);
	}
	.pathway-link {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
		padding: 1.5rem 0.5rem;
		text-decoration: none;
		transition: background-color 0.2s ease;
	}
	.pathway-link:hover {
		background-color: rgba(0, 0, 0, 0.02);
	}
	.pathway-num {
		font-family: var(--bs-font-serif);
		font-size: 1.5rem;
		color: var(--ministry-accent);
		min-width: 2.5rem;
	}
	.pathway-body {
		flex: 1;
	}
	.pathway-title {
		display: block;
		font-family: var(--bs-font-serif);
		font-size: 1.35rem;
		color: var(--bs-dark);
		margin-bottom: 0.35rem;
	}
	.pathway-desc {
		display: block;
		color: #655c52;
	}
	.pathway-arrow {
		color: var(--ministry-accent);
		font-size: 1.25rem;
		align-self: center;
		opacity: 0;
		transition: opacity 0.2s ease;
	}
	.pathway-link:hover .pathway-arrow {
		opacity: 1;
	}
</style>
