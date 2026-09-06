<script lang="ts">
	import Files from '$lib/components/Files.svelte';
	import News from '$lib/components/News.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	export let data;
</script>

<svelte:head>
	<title>Детский отдел — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="ministry-children" style="--ministry-accent: var(--bs-accent-children);">
	<div class="container-fluid page-header">
		<div class="container">
			<p class="eyebrow ministry-eyebrow">Отделы</p>
			<h1 class="display-3 mb-0">Детский отдел</h1>
		</div>
	</div>

	<div class="container">
		<figure class="ministry-scripture measure mx-auto text-center">
			<blockquote class="scripture scripture-centered">
				Вот наследие от Господа: дети; награда от Него — плод чрева.
			</blockquote>
			<figcaption class="eyebrow mt-3">Псалом 126:3</figcaption>
		</figure>

		<div class="row gx-5 gy-5 align-items-start my-6">
			<div class="col-lg-8">
				<p class="eyebrow mb-2">Приветственное слово</p>
				<h2 class="mb-4">Наставь юношу при начале пути его</h2>
				<p>
					Бог благословил наше объединение Своим наследием – хорошими семьями, добрыми родителями и
					прекрасными детьми! Радует, что в каждом регионе Американского Объединения есть
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
					Да поможет нам Господь, сознавая всю ответственность этого служения, повторить слова,
					сказанные великим Божьим мужем Моисеем: «Да явится на рабах Твоих дело Твое и на сынах их
					слава Твоя; и да будет благоволение Господа Бога нашего на нас, и в деле рук наших
					споспешествуй нам, в деле рук наших споспешествуй.» (Пс.89:16,17)
				</p>
				<footer class="blockquote-footer mt-3">Камке Фёдор Васильевич</footer>
			</div>

			<div class="col-lg-4">
				<div class="leader-card" style="--leader-accent: var(--bs-accent-children);">
					<img
						src="{data.media_url}upfiles/optimized/childrens-ministry-portrait.jpg"
						alt="Камке Фёдор Васильевич"
					/>
					<p class="leader-name">Камке Фёдор Васильевич</p>
					<p class="leader-role">Ответственный за отдел</p>
					<a href="mailto:kids@bratstvousa.com">kids@bratstvousa.com</a>
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
			title={'Темы и расписание лагерей'}
			files={data.childrens_camp_files}
			media_url={data.media_url}
		/>
	{/if}
	{#if data.childrens_files}
		<Files title={'Материалы отдела'} files={data.childrens_files} media_url={data.media_url} />
	{/if}

	<News articles={data.articles} media_url={data.media_url} />
</div>

<style>
	.ministry-eyebrow {
		color: var(--ministry-accent);
	}
	.page-header {
		border-bottom-color: var(--ministry-accent);
	}
	.ministry-scripture {
		margin-top: 3.5rem;
	}
	.scripture-centered {
		border-left: 0;
		padding-left: 0;
		font-size: 1.4rem;
	}
</style>
