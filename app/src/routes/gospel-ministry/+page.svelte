<script lang="ts">
	import Events from '$lib/components/Events.svelte';
	import News from '$lib/components/News.svelte';
	export let data;
	export let ministry_slug = 'gospel-ministry';
</script>

<svelte:head>
	<title>Отдел Благовестия — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="ministry-gospel" style="--ministry-accent: var(--bs-accent-gospel);">
	<div class="container-fluid page-header">
		<div class="container">
			<p class="eyebrow ministry-eyebrow">Отделы</p>
			<h1 class="display-3">Отдел Благовестия</h1>
		</div>
	</div>

	<div class="scripture-band">
		<div class="container">
			<blockquote class="scripture measure-wide mx-auto text-center">
				«Идите по всему миру и проповедуйте Евангелие всей твари»
				<cite>От Марка 16:15</cite>
			</blockquote>
		</div>
	</div>

	<div class="container my-6">
		<div class="row g-5">
			<div class="col-lg-8">
				<p class="eyebrow ministry-eyebrow">Приветственное слово</p>
				<p>
					Мир вам, дорогие друзья! Перед Своим вознесением с этой земли Иисус Христос оставил
					повеление своим ученикам: «...Идите, научите все народы...» (Матфея 28:19–20). Благодарю
					Господа, что в нашем Американском объединении отдел Благовестия работает хорошо. Слава
					Богу за братьев и сестёр, что активно и с желанием трудятся.
				</p>
				<p>
					Если Бог позволит, планируем распахивать новые нивы и открыть кафедру для обучения новых
					миссионеров. Ваши вопросы и предложения можете написать нам. Мы будем рады вместе
					совершать Богом порученное служение. Да благословит вас Господь!
				</p>
				<footer class="blockquote-footer">Шуст Николай Иванович</footer>
			</div>
			<div class="col-lg-4">
				<div class="leader-card" style="--leader-accent: var(--bs-accent-gospel);">
					<img
						src="{data.media_url}upfiles/page/8663e9a5bd976030e6496270ee704dd849192844.jpg"
						alt="Шуст Николай Иванович"
					/>
					<p class="leader-name">Шуст <br />Николай Иванович</p>
					<a href="mailto:info@bratstvousa.com">info@bratstvousa.com</a>
				</div>
			</div>
		</div>
	</div>

	<div class="container">
		<Events events={data.events} {ministry_slug} />
	</div>

	<!-- Mission dispatches -->
	<div class="container my-6">
		<p class="eyebrow ministry-eyebrow text-center">Миссионерские нивы</p>
		<h2 class="mb-5 text-center" style="font-family: var(--bs-font-serif);">Где мы трудимся</h2>

		<article class="dispatch row g-5 align-items-center">
			<div class="col-lg-6">
				<img
					class="dispatch-img"
					src="{data.media_url}img/ministry-in-cuba.jpg"
					alt="Благовестие в Кубе"
				/>
			</div>
			<div class="col-lg-6">
				<h3 class="dispatch-title">Благовестие в Кубе</h3>
				<p>
					Христианская и благотворительная миссия «Пробуждение» с участием народа Божьего совершает
					благовестие на острове Куба с 2015 года. Основная цель миссии — приводить людей к Богу
					через евангелизацию и финансовую поддержку миссионеров.
				</p>
				<footer class="blockquote-footer mb-3">
					Михаил Брощан, представитель миссии «Пробуждение»
				</footer>
				<ul class="dispatch-contact list-unstyled">
					<li><a href="sms:+18883644483?body=ACM2015">ACM2015 на +1 (888) 364-4483</a></li>
					<li>
						<a href="https://www.awakeningmission.org" target="_blank" rel="noopener"
							>awakeningmission.org</a
						>
					</li>
					<li><a href="tel:+18553666656;ext=1">+1 (855) 366-6656 доб. 1</a></li>
					<li><a href="mailto:info@awakeningmission.org">info@awakeningmission.org</a></li>
				</ul>
				<a class="btn-quiet" target="_blank" rel="noopener" href="https://www.awakeningmission.org"
					>Сайт миссии</a
				>
			</div>
		</article>

		<article class="dispatch row g-5 align-items-center">
			<div class="col-lg-6 order-lg-2">
				<img
					class="dispatch-img"
					src="{data.media_url}img/awakening-international-ministry-in-mexico.jpg"
					alt="Благовестие в Мексике"
				/>
			</div>
			<div class="col-lg-6 order-lg-1">
				<h3 class="dispatch-title">Благовестие в Мексике</h3>
				<p>
					История нашего знакомства с мексиканским народом началась более пятнадцати лет назад.
					Первые поездки были сложными, но мы были движимы желанием поделиться Божьим Словом среди
					испаноговорящего населения.
				</p>
				<p>
					Сегодня наша работа сосредоточена на массовой евангелизации и основании новых церквей.
					Этот труд продолжается с Божьим благословением.
				</p>
			</div>
		</article>

		<article class="dispatch row g-5 align-items-center">
			<div class="col-lg-6">
				<img
					class="dispatch-img"
					src="{data.media_url}upfiles/optimized/first-trips-to-mexico.jpg"
					alt="Первые поездки в Мексику"
				/>
			</div>
			<div class="col-lg-6">
				<h3 class="dispatch-title">Первые поездки</h3>
				<p>
					Вспоминаю первую поездку: мобильных телефонов нет, транспорт слабенький, полное отсутствие
					знания языка. Но у нас было желание и побуждение реализовать себя среди испаноговорящего
					населения.
				</p>
				<p>
					Мы проводили служения везде, где могли: в больницах, на базарах, в парках и в сиротских
					домах. Бог благословлял эти труды покаяниями.
				</p>
			</div>
		</article>
	</div>

	<!-- Impact -->
	<div class="impact-band">
		<div class="container">
			<p class="eyebrow ministry-eyebrow text-center">Плоды служения</p>
			<h2 class="mb-5 text-center" style="font-family: var(--bs-font-serif);">Влияние служения</h2>
			<div class="row g-5">
				<div class="col-lg-4">
					<figure class="impact-entry">
						<img
							src="{data.media_url}upfiles/optimized/missionary-moving.jpg"
							alt="Переселение миссионеров"
						/>
						<figcaption>
							<h3 class="impact-title">Переселение миссионеров</h3>
							<p>
								Обучились и переселились в другие города пять миссионерских семей. Ещё семь семей
								готовы начать служение в новых местах.
							</p>
						</figcaption>
					</figure>
				</div>
				<div class="col-lg-4">
					<figure class="impact-entry">
						<img src="{data.media_url}upfiles/optimized/missionary-school.jpg" alt="Образование" />
						<figcaption>
							<h3 class="impact-title">Образование</h3>
							<p>
								При центральной церкви действует школа для детей до 6-го класса и библейская школа
								для будущих миссионеров.
							</p>
						</figcaption>
					</figure>
				</div>
				<div class="col-lg-4">
					<figure class="impact-entry">
						<img
							src="{data.media_url}upfiles/optimized/missionary-evangelism.jpg"
							alt="Массовая евангелизация"
						/>
						<figcaption>
							<h3 class="impact-title">Массовая евангелизация</h3>
							<p>
								Мероприятия проводятся на базах церквей и в новых местах, включая раздачу подарков и
								общие столы для посетителей.
							</p>
						</figcaption>
					</figure>
				</div>
			</div>
		</div>
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
	.scripture-band {
		background: var(--bs-paper-sunk);
		border-top: 1px solid var(--bs-rule);
		border-bottom: 1px solid var(--bs-rule);
		padding: 3rem 0;
	}
	.scripture-band .scripture {
		border-left: 0;
		padding-left: 0;
		text-align: center;
		font-size: 1.4rem;
	}
	.dispatch {
		padding: 2.5rem 0;
		border-bottom: 1px solid var(--bs-rule);
	}
	.dispatch:last-of-type {
		border-bottom: 0;
	}
	.dispatch-img {
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}
	.dispatch-title {
		font-family: var(--bs-font-serif);
		color: var(--bs-dark);
		margin-bottom: 1rem;
	}
	.dispatch-contact {
		margin-bottom: 1.5rem;
	}
	.dispatch-contact li {
		padding: 0.2rem 0;
		border-bottom: 1px solid var(--bs-rule);
	}
	.dispatch-contact li:last-child {
		border-bottom: 0;
	}
	.dispatch-contact a {
		color: var(--bs-body-color);
	}
	.dispatch-contact a:hover,
	.dispatch-contact a:focus-visible {
		color: var(--ministry-accent);
		text-decoration-color: currentColor;
	}
	.impact-band {
		background: var(--bs-paper-sunk);
		border-top: 1px solid var(--bs-rule);
		padding: 4rem 0;
		margin-top: 3rem;
	}
	.impact-entry img {
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		margin-bottom: 1.25rem;
	}
	.impact-title {
		font-family: var(--bs-font-serif);
		color: var(--bs-dark);
		margin-bottom: 0.75rem;
	}
</style>
