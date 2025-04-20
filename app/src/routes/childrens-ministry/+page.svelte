<script lang="ts">
	import Files from '$lib/components/Files.svelte';
	import News from '$lib/components/News.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	import { onMount } from 'svelte';
	export let data;

	// Categories and resources
</script>

<div class="container-fluid page-header">
	<div class="container">
		<h1 class="display-3 mb-3">Детский Отдел</h1>
		<!-- </nav> -->
	</div>
</div>

<div class="container-fluid">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1 class="display-5 mb-3">Приветственное слово</h1>
					<p>«Вот наследие от Господа: дети...» (Пс.126:3)</p>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- First Column -->
			<div class="col-lg-9">
				<p>
					Бог благословил наше объединение Своим наследием – хорошими семьями, добрыми родителями и
					прекрасными детьми! Радует, что в каждом регионе Американского Объединения, есть
					ответственные за детское служение братья, а также детские руководители, которые ревнуют в
					славном служении с детьми, стараясь быть отрадными сотрудниками для Царствия Божия.
				</p>
				<p>
					Понимаем, что родители не смогут снять с себя ответственность воспитывать своих детей в
					учении и наставлении Господнем или переложить её на детских руководителей или церковь, но
					стараемся быть в помощь родителям, передавая детям Библейскую истину на детских собраниях,
					общениях, курсах и в лагерях, помня текст Писания: «Наставь юношу при начале пути его: он
					не уклонится от него, когда и состарится.» (Прит.22:6)
				</p>
				<p>
					Папка «Детского отдела» размещает некоторые материалы и информацию в помощь детским
					руководителям и родителям проводить с детьми занятия.
				</p>

				<p>
					Да поможет нам Господь, сознавая всю ответственность этого служения повторить слова
					сказанные великим Божьим мужем Моисеем: «Да явится на рабах Твоих дело Твое и на сынах их
					слава Твоя; и да будет благоволение Господа Бога нашего на нас, и в деле рук наших
					споспешествуй нам, в деле рук наших споспешествуй. (Пс.89:16,17)
				</p>

				<footer class="blockquote-footer">Камке Фёдор Васильевич</footer>
			</div>

			<!-- Second Column -->
			<div class="col-lg-3">
				<div class="team-wrap rounded border p-3">
					<div class="team-member text-center">
						<div class="team-img mb-3">
							<img
								style="width: 100%;"
								src="{data.media_url}upfiles/page/2110baeef15c81cd594268c9bffe0af139777496.jpg"
								alt=""
							/>
						</div>

						<h5 class="team-title">Камке<br /> Фёдор Васильевич</h5>
						<div class="social">
							<a href="mailto:kids@bratstvousa.com">kids@bratstvousa.com</a>
							<!-- <div class="social"> -->
							<!-- 	<a href="tel:{member.phone}" class="phone" title="Phone" style="width: 20px;" -->
							<!-- 		><i class="fas fa-phone"></i></a -->
							<!-- 	> -->
							<!-- 	<a href={member.whatsapp} class="whatsapp" title="WhatsApp" style="width: 20px;" -->
							<!-- 		><i class="fab fa-whatsapp"></i></a -->
							<!-- 	> -->
							<!-- 	<a href={member.viber} title="Viber"> -->
							<!-- 		<img src="{data.media_url}img/viber.svg" alt="Viber" style="width: 20px;" /> -->
							<!-- 	</a> -->
							<!-- </div> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<UpcomingEvents
	ministry_slug="childrens-ministry"
	upcomingEvents={data.events}
	media_url={data.media_url}
/>

{#if data.childrens_camp_files}
	<Files
		title={'Темы и Расписание лагерей'}
		files={data.childrens_camp_files}
		media_url={data.media_url}
	/>
{/if}
{#if data.childrens_files}
	<Files files={data.childrens_files} media_url={data.media_url} />
{/if}

<div class="container-fluid">
	<div class="container">
		<section class="row my-5">
			<h2 class="fw-bold mb-4 text-center">Новости</h2>
			<div class="col-lg-12">
				<div class="row g-3">
					{#each data.articles as article}
						<div class="col-md-6 col-lg-4">
							<div class="news-card position-relative overflow-hidden">
								<!-- 📸 News Image -->
								{#if article.featuredImage}
									<img
										class="news-image w-100 object-fit-cover"
										src={`${data.media_url}${article.featuredImage}`}
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
	.text-outline {
		color: white;
		-webkit-text-stroke: 1px black; /* Black outline */
	}
</style>
