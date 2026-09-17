<script lang="ts">
	import { schedule, lessons, theme } from './schedule';
	import type { Block } from './schedule';

	let { data } = $props();

	const heroImage = `${data.media_url}upfiles/page/north-west-youth-camp-2025-200.png`;
	const registerUrl = '/youth-ministry/osennii-molodeznyi-lager-szr-2026/registration';
	const schedulePdf = `${data.media_url}upfiles/page/szr-camp-2026-schedule.pdf`;
	const video = {
		mp4: `${data.media_url}video/szr-camp-2026.mp4`,
		webm: `${data.media_url}video/szr-camp-2026.webm`,
		poster: `${data.media_url}video/szr-camp-2026-poster.webp`
	};

	const facts = [
		{ label: 'Дата', value: '15–18 октября 2026' },
		{ label: 'Регион', value: 'Северо-Западный' },
		{ label: 'Возраст', value: 'Молодёжь 16+' },
		{ label: 'Стоимость', value: '$350' }
	];

	let activeDay = $state(schedule[0].key);

	function timeRange(b: Block): string {
		return b.end ? `${b.start}–${b.end}` : b.start;
	}

	function onTabKey(e: KeyboardEvent, index: number) {
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
		e.preventDefault();
		const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + schedule.length) % schedule.length;
		activeDay = schedule[next].key;
		(e.currentTarget as HTMLElement).parentElement
			?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
			[next]?.focus();
	}

	const bring = [
		'Библию, блокнот и ручку',
		'Тёплую одежду и обувь по погоде',
		'Личные средства гигиены',
		'Спальные принадлежности',
		'Радостное сердце и молитвенный настрой'
	];
</script>

<svelte:head>
	<title>Осенний молодежный лагерь СЗР 2026</title>
	<meta
		name="description"
		content="Осенний молодежный лагерь Северо-Западного региона — 15–18 октября 2026. Регистрация открыта."
	/>
</svelte:head>

<section class="camp-hero" style="--hero-image: url('{heroImage}')">
	<div class="camp-hero__overlay"></div>
	<div class="camp-hero__content container">
		<p class="camp-hero__eyebrow">Северо-Западный регион · 2026</p>
		<h1 class="camp-hero__title">Осенний молодежный лагерь СЗР</h1>
		<p class="camp-hero__lead">
			Четыре дня общения, Слова Божьего и осенних приключений для молодёжи.
		</p>
		<div class="camp-hero__actions">
			<a class="btn btn-light btn-lg" href={registerUrl}>Зарегистрироваться</a>
			<span class="camp-hero__date">15–18 октября 2026</span>
		</div>
	</div>
</section>

<div class="container-xxl py-6">
	<div class="container">
		<!-- Quick facts -->
		<div class="camp-facts">
			{#each facts as fact}
				<div class="camp-fact">
					<span class="camp-fact__label">{fact.label}</span>
					<span class="camp-fact__value">{fact.value}</span>
				</div>
			{/each}
		</div>

		<!-- About + video -->
		<div class="row g-5 align-items-center camp-about">
			<div class="col-lg-7">
				<p class="eyebrow">О лагере</p>
				<h2 class="camp-section-title">Время, отделённое для Господа</h2>
				<p>
					Осенний молодежный лагерь Северо-Западного региона — это возможность отойти от
					повседневной суеты, укрепиться в вере и провести время в кругу единомышленников. Нас ждут
					вдохновляющие проповеди, живое общение и незабываемые осенние активности.
				</p>
				<p>
					Тема лагеря — молитва <em>«{theme.title}»</em>: шесть уроков, по одному прошению за раз, с
					обсуждением по группам.
				</p>
				<p class="text-muted">Места ограничены — рекомендуем зарегистрироваться заранее.</p>
			</div>
			<div class="col-lg-5">
				<figure class="camp-video">
					<!-- svelte-ignore a11y_media_has_caption -->
					<video controls preload="metadata" poster={video.poster} playsinline>
						<source src={video.webm} type="video/webm" />
						<source src={video.mp4} type="video/mp4" />
						Ваш браузер не поддерживает видео.
					</video>
					<figcaption class="camp-video__caption">Приглашение на лагерь</figcaption>
				</figure>
			</div>
		</div>

		<!-- Theme / lessons overview -->
		<div class="camp-theme">
			<div class="camp-theme__head">
				<p class="eyebrow">Тема лагеря</p>
				<h2 class="camp-section-title">«{theme.title}»</h2>
				<p class="camp-theme__sub">{theme.subtitle}</p>
			</div>
			<ol class="camp-lessons">
				{#each lessons as l (l.n)}
					<li class="camp-lesson">
						<span class="camp-lesson__n">{l.n}</span>
						<span class="camp-lesson__title">{l.title}</span>
						{#if l.speaker}<span class="camp-lesson__speaker">{l.speaker}</span>{/if}
					</li>
				{/each}
			</ol>
		</div>

		<!-- Schedule -->
		<section class="camp-schedule" id="schedule">
			<div class="camp-schedule__head">
				<div>
					<p class="eyebrow">Расписание</p>
					<h2 class="camp-section-title">Программа по дням</h2>
				</div>
				<a class="camp-schedule__pdf" href={schedulePdf} target="_blank" rel="noopener">
					Скачать PDF
				</a>
			</div>

			<div class="camp-tabs" role="tablist" aria-label="Дни лагеря">
				{#each schedule as d, i (d.key)}
					<button
						type="button"
						role="tab"
						id="tab-{d.key}"
						class="camp-tab"
						class:is-active={d.key === activeDay}
						aria-selected={d.key === activeDay}
						aria-controls="panel-{d.key}"
						tabindex={d.key === activeDay ? 0 : -1}
						onclick={() => (activeDay = d.key)}
						onkeydown={(e) => onTabKey(e, i)}
					>
						<span class="camp-tab__short">{d.short}</span>
						<span class="camp-tab__label">{d.label}</span>
						<span class="camp-tab__date">{d.date}</span>
					</button>
				{/each}
			</div>

			{#each schedule as d (d.key)}
				<div
					class="camp-day"
					class:is-active={d.key === activeDay}
					id="panel-{d.key}"
					role="tabpanel"
					aria-labelledby="tab-{d.key}"
				>
					<h3 class="camp-day__heading">
						{d.label} <span class="camp-day__date">· {d.date}</span>
					</h3>
					<ol class="camp-timeline">
						{#each d.blocks as b}
							<li class="camp-block camp-block--{b.kind}">
								<time class="camp-block__time">{timeRange(b)}</time>
								<div class="camp-block__body">
									<div class="camp-block__title">
										{b.title}
										{#if b.note}<span class="camp-block__note">{b.note}</span>{/if}
									</div>
									{#if b.lessons?.length || b.after}
										<ul class="camp-block__lessons">
											{#each b.lessons ?? [] as l}
												<li class="camp-block__lesson">
													{#if l.n}<span class="camp-block__lesson-n">Урок {l.n}</span>{/if}
													<span class="camp-block__lesson-title">{l.title}</span>
													{#if l.speaker}
														<span class="camp-block__lesson-speaker">{l.speaker}</span>
													{/if}
												</li>
											{/each}
											{#if b.after}
												<li class="camp-block__lesson camp-block__lesson--after">{b.after}</li>
											{/if}
										</ul>
									{/if}
								</div>
							</li>
						{/each}
					</ol>
				</div>
			{/each}
		</section>

		<!-- What to bring -->
		<div class="row g-5 camp-bring">
			<div class="col-lg-5">
				<p class="eyebrow">Сборы</p>
				<h2 class="camp-section-title">Что взять с собой</h2>
			</div>
			<div class="col-lg-7">
				<ul class="camp-bring__list">
					{#each bring as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- CTA -->
		<div class="camp-cta">
			<h2 class="camp-cta__title">Готовы присоединиться?</h2>
			<p class="camp-cta__text">
				Заполните короткую форму и оплатите участие — и место будет забронировано за вами.
			</p>
			<a class="btn btn-primary btn-lg" href={registerUrl}>Зарегистрироваться · $350</a>
		</div>
	</div>
</div>

<style>
	.camp-hero {
		position: relative;
		min-height: clamp(360px, 60vh, 560px);
		display: flex;
		align-items: flex-end;
		background-image: var(--hero-image);
		background-size: cover;
		background-position: center;
		margin-top: calc(-1 * var(--nav-offset, 0px));
	}
	.camp-hero__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(44, 43, 41, 0.35) 0%,
			rgba(44, 43, 41, 0.55) 60%,
			rgba(44, 43, 41, 0.85) 100%
		);
	}
	.camp-hero__content {
		position: relative;
		z-index: 1;
		color: #f6f2ea;
		padding-bottom: 3.5rem;
		padding-top: 8rem;
	}
	.camp-hero__eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.22em;
		font-size: 0.8rem;
		margin-bottom: 0.75rem;
		color: rgba(246, 242, 234, 0.85);
	}
	.camp-hero__title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: clamp(2.25rem, 5vw, 4rem);
		font-weight: 600;
		margin: 0 0 1rem;
		color: #f6f2ea;
		text-shadow: 0 2px 14px rgba(0, 0, 0, 0.5);
	}
	.camp-hero__lead {
		max-width: 34rem;
		font-size: 1.1rem;
		color: rgba(246, 242, 234, 0.92);
		text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
	}
	.camp-hero__actions {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-top: 1.5rem;
	}
	.camp-hero__date {
		font-size: 0.95rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(246, 242, 234, 0.9);
	}

	.camp-facts {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		background: var(--bs-rule, #ddd5c8);
		border: 1px solid var(--bs-rule, #ddd5c8);
		margin-bottom: 4.5rem;
	}
	.camp-fact {
		background: var(--bs-paper, #f6f2ea);
		padding: 1.5rem 1rem;
		text-align: center;
	}
	.camp-fact__label {
		display: block;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.72rem;
		color: var(--bs-ink-muted, #736a5f);
		margin-bottom: 0.4rem;
	}
	.camp-fact__value {
		display: block;
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.35rem;
		color: var(--bs-dark, #2c2b29);
	}
	@media (max-width: 575.98px) {
		.camp-facts {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.camp-section-title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		color: var(--bs-dark, #2c2b29);
		margin-bottom: 1rem;
	}
	.camp-about {
		margin-bottom: 4.5rem;
	}
	.camp-video {
		margin: 0 auto;
		max-width: 320px;
	}
	.camp-video video {
		display: block;
		width: 100%;
		aspect-ratio: 9 / 16;
		object-fit: cover;
		background: var(--bs-dark, #2c2b29);
		border: 1px solid var(--bs-rule-strong, #c9bfae);
		box-shadow: 0 18px 40px -24px rgba(44, 43, 41, 0.55);
	}
	.camp-video__caption {
		margin-top: 0.75rem;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.72rem;
		color: var(--bs-ink-muted, #736a5f);
	}

	/* Theme / lessons */
	.camp-theme {
		margin-bottom: 4.5rem;
		padding: 2.5rem 2rem;
		background: var(--bs-dark, #2c2b29);
		color: #f6f2ea;
	}
	.camp-theme__head {
		text-align: center;
		margin-bottom: 2rem;
	}
	.camp-theme .eyebrow {
		color: rgba(246, 242, 234, 0.7);
	}
	.camp-theme .camp-section-title {
		color: #f6f2ea;
		margin-bottom: 0.35rem;
	}
	.camp-theme__sub {
		margin: 0;
		color: rgba(246, 242, 234, 0.75);
	}
	.camp-lessons {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: rgba(246, 242, 234, 0.15);
	}
	.camp-lesson {
		background: var(--bs-dark, #2c2b29);
		padding: 1.25rem 1rem 1.25rem 1.25rem;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		column-gap: 0.85rem;
		align-items: baseline;
	}
	.camp-lesson__n {
		grid-row: 1 / span 2;
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 2rem;
		line-height: 1;
		color: var(--bs-secondary, #a28c6a);
	}
	.camp-lesson__title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.02rem;
		line-height: 1.35;
	}
	.camp-lesson__speaker {
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		color: rgba(246, 242, 234, 0.65);
		margin-top: 0.25rem;
	}
	@media (max-width: 991.98px) {
		.camp-lessons {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 575.98px) {
		.camp-theme {
			padding: 2rem 1.25rem;
		}
		.camp-lessons {
			grid-template-columns: 1fr;
		}
	}

	/* Schedule */
	.camp-schedule {
		margin-bottom: 4.5rem;
	}
	.camp-schedule__head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.75rem;
	}
	.camp-schedule__head .camp-section-title {
		margin-bottom: 0;
	}
	.camp-schedule__pdf {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--bs-dark, #2c2b29);
		text-decoration: none;
		border-bottom: 1px solid var(--bs-secondary, #a28c6a);
		padding-bottom: 0.15rem;
	}
	.camp-schedule__pdf:hover {
		color: var(--bs-secondary, #a28c6a);
	}

	.camp-tabs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		background: var(--bs-rule, #ddd5c8);
		border: 1px solid var(--bs-rule, #ddd5c8);
		margin-bottom: 2rem;
	}
	.camp-tab {
		appearance: none;
		border: 0;
		background: var(--bs-paper, #f6f2ea);
		padding: 1rem 0.75rem 0.9rem;
		text-align: center;
		cursor: pointer;
		color: var(--bs-ink-muted, #736a5f);
		position: relative;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}
	.camp-tab:hover {
		background: var(--bs-paper-sunk, #efe9df);
	}
	.camp-tab:focus-visible {
		outline: 2px solid var(--bs-secondary, #a28c6a);
		outline-offset: -2px;
	}
	.camp-tab.is-active {
		background: var(--bs-dark, #2c2b29);
		color: #f6f2ea;
	}
	.camp-tab.is-active::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -1px;
		transform: translate(-50%, 100%);
		border: 7px solid transparent;
		border-top-color: var(--bs-dark, #2c2b29);
	}
	.camp-tab__short {
		display: none;
	}
	.camp-tab__label {
		display: block;
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.1rem;
		line-height: 1.2;
	}
	.camp-tab__date {
		display: block;
		margin-top: 0.2rem;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.8;
	}

	.camp-day {
		display: none;
	}
	.camp-day.is-active {
		display: block;
	}
	.camp-day__heading {
		display: none;
	}

	.camp-timeline {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--bs-rule, #ddd5c8);
	}
	.camp-block {
		display: grid;
		grid-template-columns: 8.5rem 1fr;
		gap: 1.25rem;
		padding: 0.9rem 0;
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		position: relative;
	}
	.camp-block::before {
		content: '';
		position: absolute;
		left: 7.25rem;
		top: 1.35rem;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--bs-rule-strong, #c9bfae);
	}
	.camp-block__time {
		font-variant-numeric: tabular-nums;
		font-size: 0.9rem;
		color: var(--bs-ink-muted, #736a5f);
		padding-top: 0.15rem;
		white-space: nowrap;
	}
	.camp-block__title {
		color: var(--bs-dark, #2c2b29);
		line-height: 1.4;
	}
	.camp-block__note {
		display: inline-block;
		margin-left: 0.5rem;
		font-size: 0.85rem;
		color: var(--bs-ink-muted, #736a5f);
	}
	.camp-block__note::before {
		content: '— ';
	}

	/* kinds */
	.camp-block--service .camp-block__title,
	.camp-block--talk .camp-block__title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.1rem;
		font-weight: 600;
	}
	.camp-block--service::before {
		background: var(--bs-accent-youth, var(--bs-secondary, #a28c6a));
	}
	.camp-block--talk::before {
		background: var(--bs-secondary, #a28c6a);
	}
	.camp-block--meal .camp-block__title,
	.camp-block--free .camp-block__title {
		color: var(--bs-ink-muted, #736a5f);
	}
	.camp-block--meal::before,
	.camp-block--free::before {
		background: transparent;
		border: 1px solid var(--bs-rule-strong, #c9bfae);
	}

	.camp-block__lessons {
		list-style: none;
		margin: 0.6rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.4rem;
	}
	.camp-block__lesson {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem 0.75rem;
		padding: 0.6rem 0.9rem;
		background: var(--bs-paper-sunk, #efe9df);
		border-left: 3px solid var(--bs-secondary, #a28c6a);
	}
	.camp-block__lesson-n {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--bs-secondary, #a28c6a);
	}
	.camp-block__lesson-title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		color: var(--bs-dark, #2c2b29);
	}
	.camp-block__lesson-speaker {
		margin-left: auto;
		font-size: 0.85rem;
		color: var(--bs-ink-muted, #736a5f);
	}
	.camp-block__lesson--after {
		background: transparent;
		border-left-color: var(--bs-rule-strong, #c9bfae);
		color: var(--bs-ink-muted, #736a5f);
		font-size: 0.9rem;
		padding-top: 0.35rem;
		padding-bottom: 0.35rem;
	}

	@media (max-width: 767.98px) {
		.camp-tab {
			padding: 0.75rem 0.25rem;
		}
		.camp-tab__short {
			display: block;
			font-family: var(--bs-font-serif, 'Lora'), serif;
			font-size: 1.1rem;
		}
		.camp-tab__label {
			display: none;
		}
		.camp-tab__date {
			font-size: 0.62rem;
		}
		.camp-block {
			grid-template-columns: 1fr;
			gap: 0.25rem;
			padding-left: 1.25rem;
		}
		.camp-block::before {
			left: 0;
			top: 0.4rem;
		}
		.camp-block__time {
			font-size: 0.78rem;
			text-transform: uppercase;
			letter-spacing: 0.08em;
		}
		.camp-block__lesson-speaker {
			margin-left: 0;
			flex-basis: 100%;
		}
	}

	@media print {
		.camp-hero,
		.camp-about,
		.camp-tabs,
		.camp-schedule__pdf,
		.camp-bring,
		.camp-cta {
			display: none !important;
		}
		.camp-day {
			display: block;
			break-inside: avoid;
			margin-bottom: 1.5rem;
		}
		.camp-day__heading {
			display: block;
			font-family: var(--bs-font-serif, 'Lora'), serif;
			font-size: 1.25rem;
			margin: 0 0 0.5rem;
		}
		.camp-day__date {
			font-weight: 400;
			color: #666;
		}
	}

	.camp-bring {
		margin-bottom: 4.5rem;
	}
	.camp-bring__list {
		list-style: none;
		padding: 0;
		margin: 0;
		columns: 1;
	}
	.camp-bring__list li {
		padding: 0.85rem 0 0.85rem 1.75rem;
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		position: relative;
	}
	.camp-bring__list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 1.2rem;
		width: 0.5rem;
		height: 0.5rem;
		background: var(--bs-secondary, #a28c6a);
	}

	.camp-cta {
		text-align: center;
		background: var(--bs-dark, #2c2b29);
		color: #f6f2ea;
		padding: 4rem 1.5rem;
	}
	.camp-cta__title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		margin-bottom: 0.75rem;
	}
	.camp-cta__text {
		max-width: 34rem;
		margin: 0 auto 1.75rem;
		color: rgba(246, 242, 234, 0.85);
	}
</style>
