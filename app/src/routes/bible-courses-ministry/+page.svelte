<script>
	import GenericPage from '$lib/components/GenericPage.svelte';
	import Header from '$lib/components/Header.svelte';
	export let data;
	const media_url = data.media_url;
	const ministry_slug = 'bible-courses-ministry';
</script>

<svelte:head>
	<title>Библейские курсы — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<Header
	title="Библейские Курсы"
	subtitle="Задача, поставленная апостолом Павлом перед Тимофеем - «вникай в себя и в учение» - остаётся важной необходимостью и христианина нашего времени. Для успешного достижения этой цели и предназначен наш отдел. "
/>

<div class="container-fluid">
	<div class="container">
		<!-- 📖 Section Title -->
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1>Приветственное слово</h1>
					<p class="lead text-muted">
						«Вникай в себя и в учение; занимайся сим постоянно...» 1Тим.4:16
					</p>
				</div>
			</div>
		</div>

		<!-- Two-column layout: text + leader info -->
		<div class="row">
			<div class="col-lg-8">
				<p class="text-dark">
					Региональные Библейские курсы - хорошая возможность для начального систематического
					изучения Священного Писания и расширения познания Библейских дисциплин, которые являются
					добрыми помощниками всякому, кто желает вникнуть в Учение Христа. Программа курсов
					рассчитана на 4 года обучения, с одной 10-дневной сессией, которая обычно проходит в
					январе и на которой изучаются 8 предметов за 64 учебных часа. Основными базовыми
					предметами являются: Догматика, Герменевтика, Гомилетика, Экзегетика. Студенты также
					получают знания по Риторике, Географии, знакомятся с каждой книгой Ветхого и Нового
					Заветов. Таким образом, за полный курс обучения студенты проходят 16 предметов, сдают
					выпускной экзамен и получают сертификат об окончании курсов. Теоретическое изучение
					материала чередуется с его обсуждением и рассмотрением практических вопросов.
				</p>

				<p class="text-dark">
					Атмосфера погружения в знания о Библии дополняется запоминающимся братским общением и
					возможностью найти для себя ответы на интересующие вопросы о Слове Божьем.
				</p>

				<p class="text-dark">
					Библейские курсы дают основу для всестороннего изучения Библии и открывают возможность для
					поступления в Библейскую Школу АО.
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

		<GenericPage {media_url} {data} {ministry_slug} />

		<!-- <div class="text-center mt-4"> -->
		<!-- 	<a href="/news" class="btn btn-outline-secondary btn-lg">Загрузить еще</a> -->
		<!-- </div> -->
	</div>
</div>
