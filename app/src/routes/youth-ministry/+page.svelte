<script lang="ts">
	export let data;

	import '@splidejs/svelte-splide/css';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import Header from '$lib/components/Header.svelte';
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte';
	import News from '$lib/components/News.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	// Resources data
	// Filtered resources
</script>

<Header title="Молодежный отдел" />

<div class="container-fluid">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-8">
				<div class="section-header mb-5 text-start" style="max-width: 700px;">
					<h1 class="display-5 mb-3">Приветственное слово</h1>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- First Column -->
			<div class="col-lg-9">
				<p>
					Юноши... вы сильны, слово Божие в вас пребывает и вы победили лукавого. Это вдохновляющее
					слово было сказано Апостолом Иоанном. Именно таковой является христианская молодежь
					проживающая в США. На протяжении вот уже более 20 лет, в объединении совершаются различные
					служения призывающие молодёжь к следованию за Господом. Моя молитва о том, чтобы Господь
					благословлял и дальше молодое поколение. Да будет имя Его благословенно вовеки!
				</p>

				<footer class="blockquote-footer">Бальжик Вениамин Петрович</footer>
			</div>

			<!-- Second Column -->
			<div class="col-lg-3">
				<img
					style="width: 100%;"
					src="{data.media_url}upfiles/page/7ad94a8d166594fb80685eb336010bd455812011.jpg"
					alt=""
				/>
			</div>
		</div>
	</div>
</div>

{#if data?.upcomingEvents.length}
	<UpcomingEvents upcomingEvents={data.upcomingEvents} media_url={data.media_url} />
	<Calendar upcomingEvents={data.allEvents} />
{/if}

<UpcomingEvents title="Архив" upcomingEvents={data.archivedEvents} media_url={data.media_url} />
