<script lang="ts">
	import GenericPage from '$lib/components/GenericPage.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/MainNav/Main.svelte';
	import { regionToLabel } from '$lib/helpers';

	export let data;
	const media_url: string = data?.media_url ?? '/';
	const ministry_slug = 'bible-school';

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
					<h1>Приветственное слово</h1>
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
				<div class="card border-0 p-4 text-center shadow-lg">
					<img
						class="img-fluid rounded shadow"
						src="{media_url}upfiles/photos/Диакону.jpg"
						alt="Диакону Дмитрий"
					/>
					<h5 class="fw-bold mt-3">Диакону Дмитрий</h5>
					<a href="mailto:bibleeducation@bratstvousa.com" class="text-muted"
						>bibleeducation@bratstvousa.com</a
					>
				</div>
			</div>
		</div>
		<!-- Intro -->
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-10">
				<div class="section-header mb-5 text-start" style="max-width: 860px;">
					<h1>О пособии</h1>
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
					<div class="alert alert-secondary border-0 shadow-sm" role="note">
						<div class="d-flex align-items-start">
							<div class="me-3">
								<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
									<path
										d="M7 2v2H5a2 2 0 0 0-2 2v1h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 7H3v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9Zm-9 3h2v6h-2v-6Zm-4 3h2v3H8v-3Zm8-5h2v8h-2V10Z"
									/>
								</svg>
							</div>
							<div>
								<p class="mb-1">
									По усмотрению каждой поместной церкви (начиная с сентября или января), выберите <strong
										>один вечер во второй неделе месяца</strong
									> — сразу после Вечери Господней — для проведения братской встречи.
								</p>
								<p class="mb-0">
									Такой ритм помогает сохранять темп, вовлечённость и преемственность обсуждений.
								</p>
							</div>
						</div>
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
				<div class="card border-0 p-4 text-center shadow-lg">
					<img
						class="img-fluid mb-3 rounded shadow"
						src="{media_url}upfiles/photos/brotherhood-placeholder.jpg"
						alt="Братское общение"
						on:error={(e: any) => (e.currentTarget.style.display = 'none')}
					/>
					<h5 class="fw-bold">{contact.name}</h5>
					<a href="mailto:{contact.email}" class="text-muted">{contact.email}</a>

					<hr class="my-4" />

					<!-- Optional CTA: replace href with actual file when ready -->
					<div class="d-grid gap-3">
						{#each downloads as d}
							<a class="btn btn-primary btn-lg" href={d.file} rel="noopener" download>
								{d.lang}
							</a>
						{/each}
					</div>
					<small class="text-muted d-block mt-2">
						Если файл недоступен, свяжитесь с нами по email.
					</small>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.section-header h1 {
		letter-spacing: 0.2px;
	}
	.alert svg path {
		fill: currentColor;
		opacity: 0.8;
	}
</style>
