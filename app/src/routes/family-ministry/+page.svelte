<script>
	export let data;
	import GenericPage from '$lib/components/GenericPage.svelte';
	import Header from '$lib/components/Header.svelte';
	import News from '$lib/components/News.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
</script>

<Header title="Семейный отдел" />
<!-- Page Header Start -->
<div class="container-fluid pb-5">
	<div class="container">
		<!-- 📖 Section Title -->
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1>Приветственное слово</h1>
				</div>
			</div>
		</div>

		<!-- 📝 Two-Column Layout (Text + Leader Info) -->
		<div class="row">
			<div class="col-lg-8">
				«А я и дом мой будем служить Господу» И. Нав. 24:15 Эти слова произнес Иисус Навин, вождь
				народа Израильского, которого Бог поставил после Моисея. Каждая поместная церковь состоит из
				семей, поэтому очень важно, чтобы семьи были крепкие, богобоязненые и служили Господу. На
				протяжении нескольких лет, в Американском объединении, совершается служение семейного
				отдела. Во всех четырёх регионах есть ответственные за это служение братья, которые проводят
				семейные лагеря, общения для сестёр, общения для отцов и сыновей, мам и дочерей, общения для
				семей в которых есть дети с ограниченными возможностями, а также для вдов и одиноких.
				Совершаются молитвы над детьми. Слава Господу! Молимся, чтобы Бог сохранил наши семьи для
				неба. Хранил от разрушений. Да будет имя Господа нашего прославленно вовеки. Слава Ему.
			</div>
			<div class="col-lg-4">
				<div class="card border-0 p-4 text-center shadow-lg">
					<img
						class="img-fluid rounded shadow"
						src="{data.media_url}upfiles/page/e76ed1bc8553f6df3a8dff8e774622c926341736.jpg"
						alt="Виктор Владимирович Помазнюк"
					/>
					<h5 class="fw-bold mt-3">Помазнюк <br />Виктор Владимирович</h5>

					<a href="mailto:info@bratstvousa.com" class="text-muted">info@bratstvousa.com</a>
				</div>
			</div>
		</div>
		<GenericPage media_url={data.media_url} {data} ministry_slug="family-ministry" />
	</div>
</div>
