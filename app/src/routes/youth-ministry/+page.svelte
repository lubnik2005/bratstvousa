<script lang="ts">
	export let data;
	import { onMount } from 'svelte';
	import YouthCalendar from '$lib/components/YouthCalendar.svelte';

	const greetings = {
		all: {
			greeting:
				'Юноши... вы сильны, слово Божие в вас пребывает и вы победили лукавого. Это вдохновляющее слово было сказано Апостолом Иоанном...',
			image_url: 'upfiles/page/7ad94a8d166594fb80685eb336010bd455812011.jpg',
			first_name: 'Вениамин Петрович',
			last_name: 'Бальжик',
			email: 'youth@bratstvousa.com'
		},
		east: {
			greeting:
				'Юноши... вы сильны, слово Божие в вас пребывает и вы победили лукавого. Это вдохновляющее слово было сказано Апостолом Иоанном...',
			image_url: 'upfiles/page/7ad94a8d166594fb80685eb336010bd455812011.jpg',
			first_name: 'Вениамин Петрович',
			last_name: 'Бальжик',
			email: 'youth@bratstvousa.com'
		}
	};

	interface Region {
		key: string;
		label: string;
	}

	const regions: Region[] = [
		{ key: 'all', label: 'Американское Объединение' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];

	let filteredUpcomingEvents = data.upcomingEvents;
	let filteredArchivedEvents = data.archivedEvents;
	let selectedRegion = regions.find((r) => r.key === 'all');
	let greeting = greetings.all;

	function filterResources(region: Region) {
		selectedRegion = region; // Keep as an object
		filteredUpcomingEvents = data.upcomingEvents.filter((event) => event.region === region.key);
		filteredArchivedEvents = data.archivedEvents.filter((event) => event.region === region.key);
		greeting = greetings[region.key] ?? greetings.all;
	}

	onMount(() => {
		if (selectedRegion) filterResources(selectedRegion);
	});
</script>

<!-- Page Header Start -->
<div class="container-fluid page-header">
	<div class="container">
		<h1 class="display-3 mb-3">Молодежный отдел</h1>

		<select
			class="d-lg-none form-select m-3"
			bind:value={selectedRegion}
			on:change={() => filterResources(selectedRegion)}
		>
			{#each regions as region}
				<option value={region}>{region.label}</option>
			{/each}
		</select>

		<ul class="nav nav-pills d-none d-lg-inline-flex b-5 mt-5">
			{#each regions as region}
				<li class="nav-item me-2">
					<button
						class="btn btn-outline-primary border-2 {region.key === selectedRegion.key
							? 'active'
							: ''}"
						data-bs-toggle="pill"
						on:click={() => filterResources(region)}>{region.label}</button
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
<!-- Page Header End -->

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
					{greeting.greeting}
				</p>

				<footer class="blockquote-footer">{greeting.last_name} {greeting.first_name}</footer>
			</div>

			<!-- Second Column -->
			<div class="col-lg-3">
				<div class="team-wrap rounded border p-3">
					<div class="team-member text-center">
						<div class="team-img mb-3">
							<img
								src="{data.media_url}{greeting.image_url}"
								alt={greeting.last_name}
								class="img-fluid"
							/>
						</div>
						<h5 class="team-title">{greeting.last_name}<br /> {greeting.first_name}</h5>
						<div class="social">
							<a href="mailto:{greeting.email}">{greeting.email}</a>
						</div>
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

{#if filteredUpcomingEvents.length}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">События</h1>
					</div>
				</div>
			</div>
			<div class="tab-content">
				<div class="row g-4">
					{#each filteredUpcomingEvents as event}
						<div class="col-xl-4 col-lg-4 col-md-6">
							<div class="product-item">
								<div class="position-relative bg-light overflow-hidden">
									{#if event.featuredImage}
										<img
											class="img-fluid w-100"
											src={`${data.media_url}${event.featuredImage}`}
											alt=""
										/>
									{/if}
								</div>
								<div class="p-4 text-center">
									<a class="d-block h5 mb-2" style="min-height: calc(1.5em * 2)" href={event.slug}
										>{event.title}</a
									>
									<span class="text-primary me-1">{event.startAt}</span>
									<!-- <span class="text-body text-decoration-line-through">$29.00</span> -->
								</div>
								<!-- This would be the registration button -->
								<!-- <div class="d-flex border-top"> -->
								<!-- 	<small class="w-100 border-end py-2 text-center"> -->
								<!-- 		<a class="text-body" href="" -->
								<!-- 			><i class="fa fa-eye text-primary me-2"></i>Регистрация</a -->
								<!-- 		> -->
								<!-- 	</small> -->
								<!-- </div> -->
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<YouthCalendar events={filteredUpcomingEvents} />
{/if}

{#if filteredArchivedEvents.length}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">Архив</h1>
					</div>
				</div>
			</div>
			<div class="tab-content">
				<div class="row g-4">
					{#each filteredArchivedEvents as event}
						<div class="col-xl-4 col-lg-4 col-md-6">
							<div class="product-item">
								<div class="position-relative bg-light overflow-hidden">
									{#if event.featuredImage}
										<img
											class="img-fluid w-100"
											src={`${data.media_url}${event.featuredImage}`}
											alt=""
										/>
									{/if}
								</div>
								<div class="p-4 text-center">
									<a class="d-block h5 mb-2" style="min-height: calc(1.5em * 2)" href={event.slug}
										>{event.title}</a
									>
									<span class="text-primary me-1">{event.startAt}</span>
									<!-- <span class="text-body text-decoration-line-through">$29.00</span> -->
								</div>
								<!-- This would be the registration button -->
								<!-- <div class="d-flex border-top"> -->
								<!-- 	<small class="w-100 border-end py-2 text-center"> -->
								<!-- 		<a class="text-body" href="" -->
								<!-- 			><i class="fa fa-eye text-primary me-2"></i>Регистрация</a -->
								<!-- 		> -->
								<!-- 	</small> -->
								<!-- </div> -->
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
