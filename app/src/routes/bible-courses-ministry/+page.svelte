<script>
	import Calendar from '$lib/components/Calendar.svelte';
	import Header from '$lib/components/Header.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	export let data;
</script>

<Header
	title="Библейские Курсы"
	subtitle="Задача, поставленная апостолом Павлом перед Тимофеем - «вникай в себя и в учение» - остаётся важной необходимостью и христианина нашего времени. Для успешного достижения этой цели и предназначен наш отдел."
/>

<div class="container-fluid">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1 class="display-5 mb-3">Приветственное слово</h1>
					<p>«Вникай в себя и в учение; занимайся сим постоянно...» 1Тим.4:16</p>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- First Column -->
			<div class="col-lg-9">
				<p>
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
				<p>
					Атмосфера погружения в знания о Библии дополняется запоминающимся братским общением и
					возможностью найти для себя ответы на интересующие вопросы о Слове Божьем.
				</p>
				<p>
					Библейские курсы дают основу для всестороннего изучения Библии и открывают возможность для
					поступления в Библейскую Школу АО.
				</p>
			</div>

			<!-- Second Column -->
			<div class="col-lg-3">
				<div class="team-wrap rounded border p-3">
					<div class="team-member text-center">
						<div class="team-img mb-3">
							<img
								style="width: 100%;"
								src="{data.media_url}upfiles/photos/Диакон.jpg"
								alt=""
							/>
						</div>

						<h5 class="team-title">Диакону<br /> Дмитрий </h5>
						<div class="social">
							<a href="mailto:bibleeducation@bratstvousa.com">bibleeducation@bratstvousa.com</a>
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
	ministry_slug="bible-courses-ministry"
	show_filters={false}
	upcomingEvents={data.upcomingEvents}
	media_url={data.media_url}
/>
<Calendar
	ministry_slug="bible-courses-ministry"
	upcomingEvents={data.allEvents}
	media_url={data.media_url}
/>
<UpcomingEvents
	ministry_slug="bible-courses-ministry"
	title="Архив"
	show_filters={false}
	upcomingEvents={data.archivedEvents}
	media_url={data.media_url}
/>
