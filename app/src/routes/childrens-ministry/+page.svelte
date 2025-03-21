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
<Files files={data.childrens_files} media_url={data.media_url} />
<News articles={data.articles} media_url={data.media_url} />
