<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	export let data;

	const members = [
		{
			last_name: 'Нейман',
			first_name: 'Константин Андреевич',
			role: 'Ответственный за АО, член Совета церквей МСЦ ЕХБ',
			image: 'upfiles/committee/committee-neyman-konstantin.jpg'
		},
		{
			last_name: 'Савченко',
			first_name: 'Андрей Михайлович',
			role: 'Ответственный за ВР, член Совета церквей МСЦ ЕХБ',
			image: 'upfiles/committee/committee-savchenko-andrey.jpg'
		},
		{
			last_name: 'Помазнюк',
			first_name: 'Виктор Владимирович',
			role: 'Ответственный за КР, сотрудник Совета церквей МСЦ ЕХБ',
			image: 'upfiles/committee/committee-pomaznyuk-viktor.jpg'
		},
		{
			last_name: 'Солохин',
			first_name: 'Вениамин Иванович',
			role: 'Ответственный за ЦР',
			image: 'upfiles/committee/committee-solokhin-veniamin.jpg'
		},
		{
			last_name: 'Власенко',
			first_name: 'Александр Мефодьевич',
			role: 'Ответственный за семейный отдел ВР',
			image: 'upfiles/committee/committee-vlasenko-aleksandr.jpg'
		},
		{
			last_name: 'Камке',
			first_name: 'Фёдор Васильевич',
			role: 'Ответственный за детский отдел АО, сотрудник Совета церквей МСЦ ЕХБ',
			image: 'upfiles/committee/committee-kamke-fyodor.jpg'
		},
		{
			last_name: 'Никита',
			first_name: 'Георгий Андреевич',
			role: 'Почётный член совета АО',
			image: 'upfiles/committee/committee-nikita-georgiy.jpg'
		},
		{
			last_name: 'Бровер',
			first_name: 'Александр Яковлевич',
			role: 'Почётный член совета АО, ответственный за семейный отдел АО',
			image: 'upfiles/committee/committee-brover-aleksandr.jpg'
		},
		{
			last_name: 'Бальжик',
			first_name: 'Вениамин Петрович',
			role: 'Ответственный за молодежный отдел АО, помощник ответственного за КР',
			image: 'upfiles/committee/committee-balzhik-veniamin.jpg'
		},
		{
			last_name: 'Павленко',
			first_name: 'Юрий Иванович',
			role: 'Ответственный за МХО АО',
			image: 'upfiles/committee/committee-pavlenko-yuriy.jpg'
		},
		{
			last_name: 'Озеров',
			first_name: 'Андрей Иванович',
			role: 'Ответственный за детский отдел СЗР',
			image: 'upfiles/committee/committee-ozerov-andrey.jpg'
		},
		{
			last_name: 'Станиславский',
			first_name: 'Николай Николаевич',
			role: 'Пресвитер одной из церквей КР',
			image: 'upfiles/committee/committee-stanislavskiy-nikolay.jpg'
		},
		{
			last_name: 'Деркач',
			first_name: 'Павел Владимирович',
			role: 'Пресвитер одной из церквей КР',
			image: 'upfiles/committee/committee-derkach-pavel.jpg'
		},
		{
			last_name: 'Кузнецов',
			first_name: 'Сергей Григорьевич',
			role: 'Пресвитер одной из церквей СЗР',
			image: 'upfiles/committee/committee-kuznetsov-sergey.jpg'
		},
		{
			last_name: 'Чепуренко',
			first_name: 'Василий Иванович',
			role: 'Пресвитер одной из церквей ВР',
			image: 'upfiles/committee/committee-chepurenko-vasiliy.jpg'
		},
		{
			last_name: 'Щербина',
			first_name: 'Борис Егорович',
			role: 'Заместитель ответственного за отдел образования АО, пресвитер одной из церквей ВР',
			image: 'upfiles/committee/committee-shcherbina-boris.jpg'
		},
		{
			last_name: 'Димитров',
			first_name: 'Виталий Борисович',
			role: 'Благовестник одной из церквей ВР',
			image: 'upfiles/committee/committee-dimitrov-vitaliy.jpg'
		},
		{
			last_name: 'Русавук',
			first_name: 'Леонид Андреевич',
			role: 'Помощник ответственного за ЦР и ответственный за МХО ЦР',
			image: 'upfiles/committee/committee-rusavuk-leonid.jpg'
		},
		{
			last_name: 'Диакону',
			first_name: 'Дмитрий Валерьевич',
			role: 'Ответственный за отдел библейского образования АО',
			image: 'upfiles/committee/committee-diakonu-dmitriy.jpg'
		},
		{
			last_name: 'Мисирук',
			first_name: 'Сергей Леонидович',
			role: 'Ответственный за отдел заступничества АО и за семейный отдел ЦР',
			image: 'upfiles/committee/committee-misiruk-sergey.jpg'
		}
	];
</script>

<svelte:head>
	<title>Состав Совета — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="page-hero-band">
	<img src="{data.media_url}img/committee-2818.webp" class="page-hero-img" alt="Состав Совета" />
</div>

<Header title="Состав Совета" />

<div class="container-xxl py-6">
	<div class="container">
		<div class="row g-4 g-lg-5">
			{#each members as member}
				<div class="col-md-6 col-lg-3">
					<figure class="member">
						<img
							class="member-img"
							src="{data.media_url}{member.image}"
							alt="{member.last_name} {member.first_name}"
						/>
						<figcaption>
							<p class="member-name">{member.last_name}<br />{member.first_name}</p>
							<p class="member-role">{member.role}</p>
						</figcaption>
					</figure>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.member {
		margin: 0;
		height: 100%;
	}
	.member-img {
		width: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		filter: saturate(0.95);
		margin-bottom: 1.1rem;
	}
	.member-name {
		font-family: var(--bs-font-serif);
		font-size: 1.1rem;
		line-height: 1.35;
		color: var(--bs-dark);
		margin-bottom: 0.5rem;
	}
	.member-role {
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--bs-ink-muted);
		margin: 0;
	}
</style>
