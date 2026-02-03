<script>
	import Header from '$lib/components/Header.svelte';
	export let data;
</script>

<svelte:head>
	<title>Библейская Школа АО</title>
	<meta property="og:title" content="Библейская Школа АО" />
	<meta name="twitter:title" content="Библейская Школа АО" />
	<meta
		property="og:image"
		content="https://bratstvo-usa.s3.us-west-2.amazonaws.com/logo_medium.png"
	/>
</svelte:head>

<Header title="Библейская Школа" />

<div class="container-fluid">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1 class="display-5 mb-3">Краткий Обзор</h1>
					<p>«Вникай в себя и в учение; занимайся сим постоянно...» 1Тим.4:16</p>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- First Column -->
			<div class="col-lg-12">
				<div class="alert alert-info mb-4">
					<strong>Учебный блок 2026 года</strong> — Библейская школа Американского объединения объявляет
					набор на второй год обучения. Программа состоит из четырёх независимых учебных блоков, что
					даёт возможность поступления в начале каждого учебного года.
				</div>
				<p>
					Библейская школа Американского объединения предназначена для твёрдого усвоения основных
					догматов Писания о Личности Бога, получения хороших навыков экзегетического исследования
					Писания, более глубокого изучения принципов проповеди Благой вести.
				</p>
				<p>
					Предполагаемый возраст студентов — от 20 до 40 лет. Учебный план школы включает 15
					предметов, которые изучаются в течение 4 лет. На каждый год запланированы 3 очные сессии,
					а также уроки в режиме онлайн. Таким образом, за 1 учебный год студенты школы проходят 75
					рабочих часов непосредственного обучения в классе, дополняется еженедельной
					самостоятельной работой (до 2 часов в неделю), что в общей сложности составляет 175
					учебных часов за год.
				</p>
				<p>
					Программа полного курса обучения состоит из 4 независимых блоков, что позволяет новым
					студентам поступать в школу в начале каждого года. Техническое обеспечение учебного
					процесса осуществляется на платформе Canvas, что обеспечивает удобство и доступность для
					всех студентов.
				</p>
			</div>
		</div>
		<div class="row mt-5">
			<div class="col-lg-12">
				<div class="ratio ratio-16x9 rounded-4 shadow-lg">
					<iframe
						src="https://www.youtube.com/embed/ns7FX08MlH4"
						title="YouTube video"
						allowfullscreen
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						class="rounded-4"
					></iframe>
				</div>
			</div>
		</div>

		<div class="row mt-5">
			<div class="col-lg-10 mx-auto">
				<div class="alert alert-primary" role="alert">
					<h5 class="alert-heading">О учебном блоке 2026 года</h5>
					<p class="mb-0">
						Учебная программа рассчитана на четыре года и состоит из четырёх независимых учебных
						блоков, что даёт возможность поступления в начале каждого учебного года.
						<strong>Учебный блок 2026 года соответствует второму году обучения.</strong>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="container my-5">
	<h2 class="mb-4 text-center">Краткая информация о библейской школе</h2>

	<p class="text-center">
		Каждый год обучения включает <strong>три очных сессии</strong> по 25 часов каждая и
		<strong>50 часов заочного обучения</strong>, дополняемых самостоятельной работой.
	</p>

	<div class="row text-center">
		<div class="col-md-4">
			<div class="rounded border p-3">
				<h5 class="fw-bold">1-я сессия</h5>
				<p>26 - 29 марта</p>
				<p><strong>Sacramento, CA</strong></p>
			</div>
		</div>
		<div class="col-md-4">
			<div class="rounded border p-3">
				<h5 class="fw-bold">2-я сессия</h5>
				<p>23 - 26 июля</p>
				<p><strong>Vancouver, WA</strong></p>
			</div>
		</div>
		<div class="col-md-4">
			<div class="rounded border p-3">
				<h5 class="fw-bold">3-я сессия</h5>
				<p>10 - 13 декабря</p>
				<p><strong>Philadelphia, PA</strong></p>
			</div>
		</div>
	</div>

	<p class="mt-4 text-center">
		Между сессиями студенты выполняют <strong>50 часов заочной работы</strong> на платформе
		<strong>Canvas</strong>, а также выделяют <strong>2 часа в неделю</strong> на самостоятельное изучение.
	</p>
	<h2 class="mb-4 text-center">Условия поступления</h2>

	<div class="row mb-5">
		<div class="col-lg-8 mx-auto">
			<div class="bg-light rounded border p-4">
				<h4>Поступление</h4>
				<p>
					<strong>Регистрация открыта с 1 по 28 февраля.</strong> После рассмотрения анкет кандидаты,
					соответствующие установленным требованиям, приглашаются к вступительному экзамену. По итогам
					экзамена принимается решение о зачислении.
				</p>

				<h5 class="mt-4">Требования к кандидатам:</h5>
				<ul>
					<li>Братья, имеющие базовую библейскую подготовку</li>
					<li>Опыт обучения на библейских курсах</li>
					<li>Стремление к духовному росту</li>
					<li>Готовность к систематическому обучению</li>
				</ul>
			</div>
		</div>
	</div>

	<h2 class="mt-5 text-center">Курсы по годам</h2>

	<div class="row">
		<div class="col-md-6">
			<div class="mb-3 rounded border p-3">
				<h4 class="fw-bold">Первый курс</h4>
				<ul>
					<li>Герменевтика: Практическая работа с текстом</li>
					<li>Экзегетика: Послание к Титу, Первое и Второе Тимофею</li>
					<li>Библиология</li>
					<li>Душепопечение</li>
					<li>Догматика: Учение о Боге</li>
				</ul>
			</div>
		</div>
		<div class="col-md-6">
			<div class="border-primary border-3 bg-light mb-3 rounded border p-3">
				<span class="badge bg-primary mb-2">Набор 2026</span>
				<h4 class="fw-bold">Второй курс</h4>
				<ul>
					<li>Христоцентричная проповедь (герменевтика)</li>
					<li>Экзегетика: Послание к Евреям</li>
					<li>Апологетика</li>
					<li>Пастырелогия</li>
					<li>Догматика: Учение о Христе</li>
				</ul>
			</div>
		</div>
		<div class="col-md-6">
			<div class="mb-3 rounded border p-3">
				<h4 class="fw-bold">Третий курс</h4>
				<ul>
					<li>Гомилетика: Текстовая и тематическая проповедь</li>
					<li>Экзегетика: Книга Пророка Исаии</li>
					<li>Аполгетика</li>
					<li>Принципы служения в Церкви</li>
					<li>Догматика: Учение о Духе Святом</li>
				</ul>
			</div>
		</div>
		<div class="col-md-6">
			<div class="mb-3 rounded border p-3">
				<h4 class="fw-bold">Четвёртый курс</h4>
				<ul>
					<li>Гомилетика: Экспозиционная проповедь</li>
					<li>Экзегетика: Послание к Римлянам</li>
					<li>Апологетика</li>
					<li>Благовестие</li>
					<li>Догматика: Учение о спасении</li>
				</ul>
			</div>
		</div>
	</div>

	<h2 class="mt-5 text-center">Финансовая информация</h2>
	<p class="text-center">
		Для покрытия текущих затрат школы курсантам необходимо платить <strong>$1,000 в год</strong>.
		Кроме того, обучение включает расходы на транспорт, которые рекомендуется покрывать из церковной
		кассы.
	</p>

	<h2 class="mt-5 text-center">Руководство школы</h2>
	<div class="row text-center">
		<div class="col-md-4">
			<div class="rounded border p-3">
				<!-- <img -->
				<!-- 	src="https://placehold.co/150x150" -->
				<!-- 	class="img-fluid rounded-circle mb-3" -->
				<!-- 	alt="Диакону Дмитрий" -->
				<!-- /> -->
				<h5 class="fw-bold">Ответственный за школу</h5>
				<p>Диакону Дмитрий</p>
			</div>
		</div>
		<div class="col-md-4">
			<div class="rounded border p-3">
				<!-- <img -->
				<!-- 	src="https://placehold.co/150x150" -->
				<!-- 	class="img-fluid rounded-circle mb-3" -->
				<!-- 	alt="Щербина Борис" -->
				<!-- /> -->
				<h5 class="fw-bold">Помощник по учебной части</h5>
				<p>Щербина Борис</p>
			</div>
		</div>
		<div class="col-md-4">
			<div class="rounded border p-3">
				<!-- <img -->
				<!-- 	src="https://placehold.co/150x150" -->
				<!-- 	class="img-fluid rounded-circle mb-3" -->
				<!-- 	alt="Бруяко Андрей" -->
				<!-- /> -->
				<h5 class="fw-bold">Помощник по технической части</h5>
				<p>Бруяко Андрей</p>
			</div>
		</div>
	</div>
	<div class="bg-light mt-5 rounded p-4 text-center">
		<h3 class="mb-3">Поступление в школу на 2026 год</h3>
		<p>
			Если вы приняли решение поступить в Библейскую Школу, пожалуйста, зарегистрируйтесь, заполнив
			анкету.
		</p>
		<p class="text-muted">
			<strong>Регистрация открыта с 1 по 28 февраля 2026 года.</strong>
		</p>
		<a href="/enroll" class="btn btn-primary btn-lg">Заполнить Анкету</a>
	</div>
</div>
