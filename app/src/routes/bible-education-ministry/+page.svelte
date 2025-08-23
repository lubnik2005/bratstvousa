<script>
	import Header from '$lib/components/Header.svelte';
	import News from '$lib/components/News.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	export let data;
</script>

<style>
.equal-btn {
  display: inline-block;
  width: 100%;
}

</style>

<Header title="Отдел библейского образования" />

<div class="container-fluid">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1 class="display-5 mb-3">Приветственное обращение</h1>
					<p>«Вникай в себя и в учение; занимайся сим постоянно...» 1Тим.4:16</p>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- First Column -->
			<div class="col-lg-9">
				<p>
					Апостол Павел призывает Тимофея к постоянному исследованию Писания. Это остаётся важной
					необходимостью и для христиан нашего времени.
				</p>
				<p>
					Задача Отдела Библейского образования (ОБО) – повышать уровень познания Священного
					Писания, сформировать верное понимание основ христианской веры, а также развитие навыков
					изучения и интерпретации Библии у студентов объединения.
				</p>
				<p>
					Первое знакомство с Библией в семьях продолжается в Библейской школе для подростков,
					которая на постоянной основе проходит в регионах нашего объединения. Этот важный этап
					помогает подросткам заложить фундамент для дальнейшего духовного роста и понимания
					Священного Писания.
				</p>
				<p>
					Затем молодёжь имеет возможность изучать Библейские дисциплины на четырехгодичных
					Библейских курсах, которые дают основу для начального уровня проповедования. Эти курсы
					предлагают всестороннее изучение Библии и помогают студентам подготовиться к более
					глубокому исследованию и обучению в Библейской школе объединения.
				</p>
				<p>
					Четыре года обучения в Библейской Школе предназначены для глубокого изучения основных
					догматов Писания о личности Бога, получения хроших навыков экзегетического исследования
					Писания, принципов проповеди Благой вести. Выпускники этой школы смогут не только
					обогатить свои знания, но и приобрести практические умения, необходимые для активного
					служения в церкви. Таким образом, пройдя через последовательные этапы Библейского
					образования, верующие могут глубже понимать Писание, укрепить свою веру и быть готовыми к
					служению. Наставление апостола Павла остаётся маяком для всех христиан, стремящихся к
					духовному росту и зрелости в вере.
				</p>
			</div>

			<!-- Second Column -->
			<div class="col-lg-3">
				<div class="team-wrap rounded border p-3">
					<div class="team-member text-center">
						<div class="team-img mb-3">
							<img style="width: 100%;" src="{data.media_url}upfiles/photos/Диакону.jpg" alt="" />
						</div>

						<h5 class="team-title">Диакону<br /> Дмитрий</h5>
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
		<!-- Cool Buttons Section -->

    <div class="row mt-5">
  <div class="col-lg-4 mb-3 text-center">
    <a
      href="/bible-school-ministry"
      class="btn btn-primary btn-lg rounded-pill shadow-lg equal-btn"
      style="padding: 15px 30px; font-size: 1.25rem;"
    >
      Региональные Библейские курсы
    </a>
  </div>
  <div class="col-lg-4 mb-3 text-center">
    <a
      href="/bible-courses-ministry"
      class="btn btn-primary btn-lg rounded-pill shadow-lg equal-btn"
      style="padding: 15px 30px; font-size: 1.25rem;"
    >
      Библейская школа
    </a>
  </div>
  <div class="col-lg-4 mb-3 text-center">
    <a
      href="/resources"
      class="btn btn-primary btn-lg rounded-pill shadow-lg equal-btn"
      style="padding: 15px 30px; font-size: 1.25rem;"
    >
      Ресурсы
    </a>
  </div>
</div>


	</div>
</div>

<UpcomingEvents
	ministry_slug="bible-courses-ministry"
	show_filters={false}
	upcomingEvents={data.events}
	media_url={data.media_url}
/>
<News articles={data.articles} media_url={data.media_url} />
