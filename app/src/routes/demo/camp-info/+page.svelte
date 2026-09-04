<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	// DEMO DATA — placeholder content for previewing the camp info page.
	const camp = {
		title: 'Зимний молодежный лагерь СЗР',
		region: 'Северо-Западный регион',
		dates: '2 — 5 января 2026 г.',
		location: 'База отдыха «Сосновый бор», штат Вашингтон',
		cost: '$350',
		description:
			'Приглашаем молодежь Северо-Западного региона на зимний лагерь — время общения, изучения Слова Божьего, совместных игр на снегу и духовного возрастания.',
		schedule: [
			{ day: 'День 1', items: ['Заезд и регистрация', 'Вечернее общение', 'Знакомство'] },
			{ day: 'День 2', items: ['Утренняя молитва', 'Библейский урок', 'Спортивные игры', 'Костер'] },
			{ day: 'День 3', items: ['Служение', 'Семинары по группам', 'Свободное время'] },
			{ day: 'День 4', items: ['Итоговое собрание', 'Разъезд'] }
		],
		bring: ['Тёплую одежду', 'Библию и блокнот', 'Личные принадлежности', 'Хорошее настроение']
	};
</script>

<svelte:head>
	<title>{camp.title} — Демо</title>
</svelte:head>

<Header title={camp.title} subtitle={camp.region} />

<div class="container-xxl py-6">
	<div class="container">
		<div class="measure-wide mx-auto">
			<p class="lead">{camp.description}</p>

			<dl class="row mt-4 mb-5">
				<dt class="col-sm-3">Даты</dt>
				<dd class="col-sm-9">{camp.dates}</dd>
				<dt class="col-sm-3">Место</dt>
				<dd class="col-sm-9">{camp.location}</dd>
				<dt class="col-sm-3">Стоимость</dt>
				<dd class="col-sm-9">{camp.cost}</dd>
			</dl>

			<h2 class="h4 mt-5 mb-3">Программа</h2>
			<div class="row g-4">
				{#each camp.schedule as block (block.day)}
					<div class="col-md-6">
						<h3 class="h6 text-uppercase">{block.day}</h3>
						<ul class="mb-0">
							{#each block.items as item}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<h2 class="h4 mt-5 mb-3">Что взять с собой</h2>
			<ul>
				{#each camp.bring as item}
					<li>{item}</li>
				{/each}
			</ul>

			<a class="btn btn-primary mt-4" href="/demo/camp-registration">Зарегистрироваться</a>
		</div>
	</div>
</div>
