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

<!-- Main Content Wrapper -->
<div class="container-fluid py-5">
	<div class="container">
		<!-- 2026 Enrollment Alert -->
		<div class="row mb-5">
			<div class="col-lg-10 mx-auto">
				<div class="alert alert-info border-0 shadow-sm" role="alert">
					<h5 class="alert-heading fw-bold">
						<i class="fas fa-graduation-cap me-2"></i>Учебный блок 2026 года
					</h5>
					<p class="mb-0">
						Библейская школа Американского объединения объявляет набор на второй год обучения.
						Программа состоит из четырёх независимых учебных блоков, что даёт возможность
						поступления в начале каждого учебного года.
					</p>
				</div>
			</div>
		</div>

		<!-- Overview Section -->
		<div class="row mb-5">
			<div class="col-lg-10 mx-auto">
				<div class="section-header mb-4">
					<h2 class="display-6 fw-bold">Краткий Обзор</h2>
					<p class="lead text-muted fst-italic">
						«Вникай в себя и в учение; занимайся сим постоянно...» 1Тим.4:16
					</p>
				</div>

				<div class="content-text">
					<p>
						Библейская школа Американского объединения объявляет набор на учебный блок 2026 года.
						Школа является частью отдела библейского образования объединения и направлена на
						углублённую подготовку братьев для изучения Священного Писания и практического служения
						в Церкви.
					</p>

					<p>
						Учебная программа рассчитана на <strong>четыре года</strong> и состоит из
						<strong>четырёх независимых учебных блоков</strong>, что даёт возможность поступления в
						начале каждого учебного года. Учебный блок 2026 года соответствует
						<strong>второму году обучения.</strong>
					</p>
				</div>
			</div>
		</div>

		<!-- Video Section -->
		<div class="row mb-5">
			<div class="col-lg-10 mx-auto">
				<div class="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg">
					<iframe
						src="https://www.youtube.com/embed/ns7FX08MlH4"
						title="Видео о Библейской школе"
						allowfullscreen
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						class="border-0"
					></iframe>
				</div>
			</div>
		</div>

		<!-- 2026 Block Info -->
		<div class="row mb-5">
			<div class="col-lg-10 mx-auto">
				<div class="alert alert-primary border-0 shadow-sm" role="alert">
					<h5 class="alert-heading fw-bold">О учебном блоке 2026 года</h5>
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

<!-- Sessions Section - Gray Background -->
<div class="bg-light py-5">
	<div class="container">
		<div class="row">
			<div class="col-lg-10 mx-auto">
				<h2 class="fw-bold mb-4 text-center">Расписание сессий 2026 года</h2>

				<div class="row g-4 mb-5">
					<div class="col-md-4">
						<div class="card h-100 border-0 text-center shadow-sm">
							<div class="card-body p-4">
								<div class="badge bg-primary mb-3" style="font-size: 1rem;">1-я сессия</div>
								<h4 class="fw-bold mb-3">26-29 марта</h4>
								<p class="text-muted mb-0">
									<i class="fas fa-map-marker-alt me-2"></i><strong>Sacramento, CA</strong>
								</p>
							</div>
						</div>
					</div>
					<div class="col-md-4">
						<div class="card h-100 border-0 text-center shadow-sm">
							<div class="card-body p-4">
								<div class="badge bg-primary mb-3" style="font-size: 1rem;">2-я сессия</div>
								<h4 class="fw-bold mb-3">23-26 июля</h4>
								<p class="text-muted mb-0">
									<i class="fas fa-map-marker-alt me-2"></i><strong>Vancouver, WA</strong>
								</p>
							</div>
						</div>
					</div>
					<div class="col-md-4">
						<div class="card h-100 border-0 text-center shadow-sm">
							<div class="card-body p-4">
								<div class="badge bg-primary mb-3" style="font-size: 1rem;">3-я сессия</div>
								<h4 class="fw-bold mb-3">10-13 декабря</h4>
								<p class="text-muted mb-0">
									<i class="fas fa-map-marker-alt me-2"></i><strong>Philadelphia, PA</strong>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Admission Requirements Section -->
<div class="container py-5">
	<div class="row">
		<div class="col-lg-10 mx-auto">
			<h2 class="fw-bold mb-5 text-center">Условия поступления</h2>

			<div class="card border-0 shadow-sm">
				<div class="card-body p-5">
					<h4 class="fw-bold mb-4">Процесс поступления</h4>
					<p class="lead">
						<strong>Регистрация открыта с 1 по 28 февраля 2026 года.</strong>
					</p>
					<p>
						После рассмотрения анкет кандидаты, соответствующие установленным требованиям,
						приглашаются к вступительному экзамену. По итогам экзамена принимается решение о
						зачислении.
					</p>

					<h5 class="fw-bold mb-3 mt-5">Требования к кандидатам:</h5>
					<ul class="list-unstyled">
						<li class="mb-2">
							<i class="fas fa-check-circle text-primary me-2"></i>Братья, имеющие базовую
							библейскую подготовку
						</li>
						<li class="mb-2">
							<i class="fas fa-check-circle text-primary me-2"></i>Опыт обучения на библейских
							курсах
						</li>
						<li class="mb-2">
							<i class="fas fa-check-circle text-primary me-2"></i>Стремление к духовному росту
						</li>
						<li class="mb-2">
							<i class="fas fa-check-circle text-primary me-2"></i>Готовность к систематическому
							обучению
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Curriculum & Financial Section - Gray Background -->
<div class="bg-light py-5">
	<div class="container">
		<div class="row">
			<div class="col-lg-10 mx-auto">
				<!-- Curriculum -->
				<h2 class="fw-bold mb-5 text-center">Учебная программа</h2>

				<div class="row g-4 mb-5">
					<!-- Year 1 -->
					<div class="col-md-6">
						<div class="card h-100 border-0 shadow-sm">
							<div class="card-body p-4">
								<h4 class="fw-bold mb-4">Первый курс</h4>
								<ul class="list-unstyled">
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Герменевтика: Практическая работа с
										текстом
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Экзегетика: Послание к Титу, Первое
										и Второе Тимофею
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Библиология
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Душепопечение
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Догматика: Учение о Боге
									</li>
								</ul>
							</div>
						</div>
					</div>

					<!-- Year 2 - Highlighted -->
					<div class="col-md-6">
						<div class="card h-100 border-primary border-3 shadow">
							<div class="card-body bg-white p-4">
								<div class="d-flex justify-content-between align-items-center mb-4">
									<h4 class="fw-bold mb-0">Второй курс</h4>
									<span class="badge bg-primary">Набор 2026</span>
								</div>
								<ul class="list-unstyled">
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Христоцентричная проповедь
										(герменевтика)
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Экзегетика: Послание к Евреям
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Апологетика
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Пастырелогия
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Догматика: Учение о Христе
									</li>
								</ul>
							</div>
						</div>
					</div>

					<!-- Year 3 -->
					<div class="col-md-6">
						<div class="card h-100 border-0 shadow-sm">
							<div class="card-body p-4">
								<h4 class="fw-bold mb-4">Третий курс</h4>
								<ul class="list-unstyled">
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Гомилетика: Текстовая и
										тематическая проповедь
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Экзегетика: Книга Пророка Исаии
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Апологетика
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Принципы служения в Церкви
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Догматика: Учение о Духе Святом
									</li>
								</ul>
							</div>
						</div>
					</div>

					<!-- Year 4 -->
					<div class="col-md-6">
						<div class="card h-100 border-0 shadow-sm">
							<div class="card-body p-4">
								<h4 class="fw-bold mb-4">Четвёртый курс</h4>
								<ul class="list-unstyled">
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Гомилетика: Экспозиционная
										проповедь
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Экзегетика: Послание к Римлянам
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Апологетика
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Благовестие
									</li>
									<li class="mb-2">
										<i class="fas fa-book text-primary me-2"></i>Догматика: Учение о спасении
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<!-- Financial Info -->
				<h2 class="fw-bold mb-4 mt-5 text-center">Финансовая информация</h2>
				<div class="row g-4">
					<div class="col-md-6">
						<div class="card h-100 border-0 bg-white shadow-sm">
							<div class="card-body p-4 text-center">
								<div
									class="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3 bg-opacity-10"
									style="width: 80px; height: 80px;"
								>
									<i class="fas fa-dollar-sign fa-2x text-success"></i>
								</div>
								<h5 class="fw-bold mb-3">Стоимость обучения</h5>
								<p class="display-6 text-success fw-bold mb-2">$1,000</p>
								<p class="text-muted small mb-0">в год</p>
							</div>
						</div>
					</div>
					<div class="col-md-6">
						<div class="card h-100 border-0 bg-white shadow-sm">
							<div class="card-body p-4 text-center">
								<div
									class="rounded-circle bg-info d-inline-flex align-items-center justify-content-center mb-3 bg-opacity-10"
									style="width: 80px; height: 80px;"
								>
									<i class="fas fa-bus fa-2x text-info"></i>
								</div>
								<h5 class="fw-bold mb-3">Транспортные расходы</h5>
								<p class="mb-0">
									Рекомендуется покрывать из церковной кассы для снижения финансовой нагрузки на
									студентов
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- CTA Section -->
<div class="cta-section py-5">
	<div class="container">
		<div class="row">
			<div class="col-lg-8 mx-auto">
				<div class="card border-0 shadow-lg">
					<div class="card-body p-5 text-center">
						<h2 class="display-6 fw-bold mb-4">Поступление в школу на 2026 год</h2>
						<p class="lead text-muted mb-4">
							Если вы приняли решение поступить в Библейскую Школу, пожалуйста, зарегистрируйтесь,
							заполнив анкету.
						</p>
						<div class="alert alert-primary mb-4">
							<i class="fas fa-calendar-alt me-2"></i>
							<strong>Регистрация открыта с 1 по 28 февраля 2026 года</strong>
						</div>
						<a href="/enroll" class="btn btn-primary btn-lg px-5 py-3">
							<i class="fas fa-edit me-2"></i>Заполнить Анкету
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.content-text p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1.25rem;
	}

	/* Only animate curriculum cards */
	.bg-light .card {
		transition: transform 0.2s ease-in-out;
	}

	.bg-light .card:hover {
		transform: translateY(-5px);
	}

	.section-header h2 {
		color: #2c3e50;
	}

	.lead {
		font-size: 1.15rem;
	}

	.cta-section {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	}
</style>
