<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	export let data;
	const media_url: string = data?.media_url ?? '/';

	const contact = {
		name: 'Отдел библейского образования АО',
		email: 'bibleeducation@bratstvousa.com'
	};
	const downloads = [
		{
			lang: 'Русский',
			short: 'RUS',
			file: '/files/methodical-guide-brothers-1tim_rus.pdf'
		},
		{
			lang: 'Download Study Guide (English)',
			short: 'ENG',
			file: '/files/methodical-guide-brothers-1tim_eng.pdf'
		},
		{
			lang: 'Descarcă ghidul metodologic (Română)',
			short: 'ROM',
			file: '/files/methodical-guide-brothers-1tim_rom.pdf'
		}
	];
</script>

<svelte:head>
	<title>Братские беседы — методическое пособие | Библейское образование</title>
	<meta
		name="description"
		content="Методическое пособие для систематических братских бесед на основе 1-го Послания к Тимофею. Цель — духовный рост и укрепление братского общения."
	/>
</svelte:head>

<Header
	title="Ресурсы"
	subtitle="Практическое руководство для проведения систематических и регулярных встреч братьев в поместной церкви"
/>

<div class="container-fluid">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h2>Приветственное слово</h2>
					<p class="lead text-muted">
						"Чтобы … ты знал, как должно поступать в доме Божием ...” 1Тим 3:15
					</p>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-8">
				<p class="text-dark">
					Учитывая многообразие служений в поместной церкви и осознавая необходимость уделять
					внимание различным группам верующих, Отдел библейского образования Американского
					объединения ставит своей целью разработку и предоставление методических пособий,
					призванных содействовать проведению систематических и регулярных бесед с разными
					категориями членов поместной церкви.
				</p>
			</div>
			<div class="col-lg-4">
				<div class="leader-card" style="--leader-accent: var(--bs-accent-bible);">
					<img src="{media_url}upfiles/photos/Диакону.jpg" alt="Диакону Дмитрий" />
					<p class="leader-name">Диакону Дмитрий</p>
					<a href="mailto:bibleeducation@bratstvousa.com">bibleeducation@bratstvousa.com</a>
				</div>
			</div>
		</div>
		<!-- Intro -->
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-10">
				<div class="section-header mb-5 text-start" style="max-width: 860px;">
					<h2>О пособии</h2>
					<p class="lead text-muted">
						Отдел библейского образования Американского объединения предлагает методическое пособие
						для проведения систематических и регулярных бесед с братьями в церкви. Цель —
						содействовать духовно-назидательным встречам на постоянной основе, укрепляя взаимные
						связи и способствуя духовному росту.
					</p>
				</div>
			</div>
		</div>

		<!-- Two column: main text + contact -->
		<div class="row">
			<div class="col-lg-8">
				<div class="mb-4">
					<h3 class="h4">Структура и тематика</h3>
					<p class="text-dark">
						Пособие включает <strong>12 тем из Первого послания апостола Павла к Тимофею</strong>.
						Формат каждой встречи предполагает совместную подготовку материалов и рассуждение над
						одной из предложенных тем.
					</p>
				</div>

				<div class="mb-4">
					<h3 class="h4">Рекомендуемый график</h3>
					<div class="schedule-note" role="note">
						<p class="mb-2">
							По усмотрению каждой поместной церкви (начиная с сентября или января), выберите <strong
								>один вечер во второй неделе месяца</strong
							> — сразу после Вечери Господней — для проведения братской встречи.
						</p>
						<p class="mb-0">
							Такой ритм помогает сохранять темп, вовлечённость и преемственность обсуждений.
						</p>
					</div>
				</div>

				<div class="mb-4">
					<h3 class="h4">Рекомендации по организации</h3>
					<ol class="text-dark ps-3">
						<li class="mb-2">
							Ответственность за проведение братских общений несёт пресвитер или назначенный
							способный брат.
						</li>
						<li class="mb-2">
							Пособие рекомендуется <strong>лично подписать</strong> и вручить каждому брату.
						</li>
						<li class="mb-2">
							Поощрять участие всех братьев — новообращённых и зрелых, начинающих и опытных
							проповедников; поддерживать проект на братских и общих собраниях.
						</li>
						<li class="mb-2">
							При необходимости приглашать служителей из соседних церквей для более яркого раскрытия
							отдельных тем.
						</li>
					</ol>
				</div>

				<div class="mb-5">
					<h3 class="h4">Ожидаемые плоды</h3>
					<p class="text-dark">
						Уверены, что эти встречи станут благословением для <strong
							>личного духовного роста</strong
						>, а также послужат укреплению отношений между братьями — внутри поместной церкви, в
						регионах и в нашем объединении.
					</p>
				</div>
			</div>

			<div class="col-lg-4">
				<aside class="downloads-panel">
					<p class="eyebrow">Отдел библейского образования</p>
					<p class="downloads-contact">
						<a href="mailto:{contact.email}">{contact.email}</a>
					</p>

					<hr class="my-4" />

					<p class="eyebrow mb-3">Скачать пособие</p>
					<div class="download-links">
						{#each downloads as d}
							<a class="btn-quiet" href={d.file} rel="noopener" download>{d.lang}</a>
						{/each}
					</div>
					<small class="downloads-note d-block mt-3">
						Если файл недоступен, свяжитесь с нами по email.
					</small>
				</aside>
			</div>
		</div>
	</div>
</div>

<style>
	.schedule-note {
		padding: 1.25rem 1.5rem;
		background: var(--bs-paper-sunk);
		border-left: 2px solid var(--bs-secondary);
		color: var(--bs-body-color);
		line-height: 1.7;
	}
	.downloads-panel {
		padding: 1.75rem;
		background: var(--bs-paper-sunk);
		border: 1px solid var(--bs-rule);
		border-top: 2px solid var(--bs-accent-bible);
	}
	.downloads-panel :global(.eyebrow) {
		color: #655c52;
	}
	.downloads-contact a {
		color: #655c52;
		font-size: 0.95rem;
	}
	.downloads-contact a:hover {
		color: var(--bs-primary);
	}
	.download-links {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		align-items: flex-start;
	}
	.downloads-note {
		color: #655c52;
		font-size: 0.85rem;
	}
	hr {
		border-color: var(--bs-rule);
		opacity: 1;
	}
</style>
