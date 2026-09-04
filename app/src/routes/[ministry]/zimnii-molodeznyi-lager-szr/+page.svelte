<script lang="ts">
	export let data;

	const heroImage = `${data.media_url}upfiles/page/north-west-youth-camp-2025-200.png`;
	const registerUrl = '/youth-ministry/zimnii-molodeznyi-lager-szr/registration';

	const facts = [
		{ label: 'Дата', value: '14 октября 2026' },
		{ label: 'Регион', value: 'Северо-Западный' },
		{ label: 'Возраст', value: 'Молодёжь 16+' },
		{ label: 'Стоимость', value: '$350' }
	];

	const program = [
		{
			day: 'День 1',
			title: 'Заезд и знакомство',
			text: 'Регистрация, размещение, вечернее общение у камина и молитвенное открытие лагеря.'
		},
		{
			day: 'День 2',
			title: 'Слово и служение',
			text: 'Утренние размышления над Писанием, семинары, командные игры и вечернее прославление.'
		},
		{
			day: 'День 3',
			title: 'Активности и отдых',
			text: 'Зимние активности на свежем воздухе, свидетельства, костёр и время в малых группах.'
		},
		{
			day: 'День 4',
			title: 'Завершение',
			text: 'Итоговое богослужение, хлебопреломление и отъезд.'
		}
	];

	const bring = [
		'Библию, блокнот и ручку',
		'Тёплую одежду и обувь по погоде',
		'Личные средства гигиены',
		'Спальные принадлежности',
		'Радостное сердце и молитвенный настрой'
	];
</script>

<svelte:head>
	<title>Зимний молодежный лагерь СЗР 2026</title>
	<meta
		name="description"
		content="Зимний молодежный лагерь Северо-Западного региона — 14 октября 2026. Регистрация открыта."
	/>
</svelte:head>

<section class="camp-hero" style="--hero-image: url('{heroImage}')">
	<div class="camp-hero__overlay"></div>
	<div class="camp-hero__content container">
		<p class="camp-hero__eyebrow">Северо-Западный регион · 2026</p>
		<h1 class="camp-hero__title">Зимний молодежный лагерь СЗР</h1>
		<p class="camp-hero__lead">
			Четыре дня общения, Слова Божьего и зимних приключений для молодёжи.
		</p>
		<div class="camp-hero__actions">
			<a class="btn btn-light btn-lg" href={registerUrl}>Зарегистрироваться</a>
			<span class="camp-hero__date">14 октября 2026</span>
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

		<!-- About -->
		<div class="row g-5 align-items-center camp-about">
			<div class="col-lg-6">
				<p class="eyebrow">О лагере</p>
				<h2 class="camp-section-title">Время, отделённое для Господа</h2>
				<p>
					Зимний молодежный лагерь Северо-Западного региона — это возможность отойти от
					повседневной суеты, укрепиться в вере и провести время в кругу единомышленников.
					Нас ждут вдохновляющие проповеди, живое общение и незабываемые зимние активности.
				</p>
				<p class="text-muted">
					Места ограничены — рекомендуем зарегистрироваться заранее.
				</p>
			</div>
			<div class="col-lg-6">
				<img class="camp-about__img" src={heroImage} alt="Зимний молодежный лагерь" />
			</div>
		</div>

		<!-- Program -->
		<div class="camp-program">
			<div class="text-center mb-5">
				<p class="eyebrow">Программа</p>
				<h2 class="camp-section-title">Что вас ждёт</h2>
			</div>
			<div class="row g-4">
				{#each program as item}
					<div class="col-md-6 col-lg-3">
						<div class="camp-day">
							<span class="camp-day__badge">{item.day}</span>
							<h3 class="camp-day__title">{item.title}</h3>
							<p class="camp-day__text">{item.text}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

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
	.camp-about__img {
		width: 100%;
		height: 100%;
		max-height: 420px;
		object-fit: cover;
	}

	.camp-program {
		margin-bottom: 4.5rem;
	}
	.camp-day {
		height: 100%;
		background: var(--bs-paper-sunk, #efe9df);
		border-top: 2px solid var(--bs-secondary, #a28c6a);
		padding: 1.5rem;
	}
	.camp-day__badge {
		display: inline-block;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.72rem;
		color: var(--bs-ink-muted, #736a5f);
		margin-bottom: 0.75rem;
	}
	.camp-day__title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.15rem;
		color: var(--bs-dark, #2c2b29);
		margin-bottom: 0.5rem;
	}
	.camp-day__text {
		font-size: 0.92rem;
		color: var(--bs-ink-muted, #736a5f);
		margin: 0;
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
