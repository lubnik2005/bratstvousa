<script>
	import Header from '$lib/components/Header.svelte';
	export let data;
	const media_url = data.media_url;
	const ministry_slug = 'bible-school';
</script>

<Header
	title="Библейские Курсы"
	subtitle="
Задача, поставленная апостолом Павлом перед Тимофеем - «вникай в себя и в учение» - остаётся важной необходимостью и христианина нашего времени. Для успешного достижения этой цели и предназначен наш отдел.
  "
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

		<!-- 📝 Two-Column Layout (Text + Leader Info) -->
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

		<!-- 🔥 Featured Event Section -->
		{#if data.news_articles.length}
			<section class="row my-5">
				<div class="col-lg-10 mx-auto">
					<div class="card overflow-hidden border-0 shadow-lg">
						<div class="position-relative">
							<img
								class="img-fluid w-100 object-fit-cover"
								style="max-height: 450px;"
								src="{media_url}{data.news_articles[0].featuredImage}"
								alt={data.news_articles[0].title}
							/>
							<div class="position-absolute text-light bottom-0 start-0 p-4">
								<h2 class="fw-bold">{data.news_articles[0].title}</h2>
								<p class="lead">{data.news_articles[0].description}</p>
								<span class="fw-bold">{data.news_articles[0].startAtString}</span>
								<div class="mt-3">
									<a href="/news/{data.news_articles[0].slug}" class="btn btn-light">Подробнее</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		{/if}
		<!-- 🎭 Events -->
		<section class="row">
			<h2 class="fw-bold mb-4 text-center">События</h2>
			<div class="col-lg-12">
				<div class="row g-4">
					{#each data.events as event}
						<div class="col-md-4">
							<div class="card event-card d-flex align-items-stretch flex-row border-0 shadow-sm">
								<!-- 📅 Full-Height Date Block -->
								<div class="event-date">
									<div class="event-day">{event.startAtString.split('/')[0]}</div>
									<div class="event-divider">/</div>
									<div class="event-month">{event.startAtString.split('/')[1]}</div>
									<div class="event-divider">/</div>
									<div class="event-year">{event.startAtString.split('/')[2]}</div>
								</div>

								<!-- 📝 Event Details -->
								<div class="event-details flex-grow-1 p-3">
									<h5 class="fw-bold mb-1">{event.title}</h5>
									<p class="text-muted small mb-2">{event.location || 'Место не указано'}</p>
									<p class="text-dark small">{event.description || 'Описание отсутствует'}</p>
									{#if event.content}
										<a
											href={`/${ministry_slug}/${event.slug}`}
											class="btn btn-sm btn-outline-primary mt-2">Подробнее</a
										>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- 📰 News Section -->

		<section class="row my-5">
			<h2 class="fw-bold mb-4 text-center">Новости</h2>
			<div class="col-lg-12">
				<div class="row g-3">
					{#each data.news_articles as article}
						<div class="col-md-6 col-lg-4">
							<div class="news-card position-relative overflow-hidden">
								<!-- 📸 News Image -->
								{#if article.featuredImage}
									<img
										class="news-image w-100 object-fit-cover"
										src={`${media_url}${article.featuredImage}`}
										alt={article.title}
									/>
								{/if}

								<!-- 📝 Overlayed Content -->
								<div class="news-overlay">
									<h5 class="news-title">{article.title}</h5>
									<span class="news-date">{article.date}</span>
									<a href={`/news/${article.slug}`} class="btn btn-sm btn-light mt-2">Читать</a>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- <div class="text-center mt-4"> -->
		<!-- 	<a href="/news" class="btn btn-outline-secondary btn-lg">Загрузить еще</a> -->
		<!-- </div> -->
	</div>
</div>

<style>
	:root {
		--bs-primary: #2c3e50;
		--bs-dark: #1a252f;
	}

	.card {
		border-radius: 12px;
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
	}

	/* 📅 Event Date Block */
	.event-date {
		background: var(--bs-dark);
		color: #ffffff;
		min-width: 70px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 1.4rem;
		font-weight: bold;
		padding: 15px 0;
		border-radius: 12px 0 0 12px;
	}

	.event-divider {
		font-size: 1rem;
		opacity: 0.6;
		margin: 2px 0;
	}

	.event-details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* 📰 News Cards */
	.news-card {
		height: 350px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.news-image {
		height: 70%;
		object-fit: cover;
	}

	/* 🎭 News Overlay */
	.bg-dark.opacity-50 {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 30%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		backdrop-filter: blur(4px);
	}

	:root {
		--bs-primary: #2c3e50;
		--bs-dark: #1a252f;
	}

	.news-card {
		height: 350px;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease-in-out;
	}

	.news-card:hover {
		transform: translateY(-3px);
		box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
	}

	/* 📸 Ensure News Images Fit */
	.news-image {
		height: 100%;
		object-fit: cover;
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}

	/* 📝 Overlay Content */
	.news-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 15px;
		backdrop-filter: blur(4px);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border-radius: 0 0 12px 12px;
	}

	.news-title {
		color: white;
		font-size: 1.1rem;
		margin-bottom: 5px;
	}

	.news-date {
		font-size: 0.85rem;
		opacity: 0.8;
	}
</style>
