<script lang="ts">
	export let upcomingEvents = [];
	export let title = 'События';
	export let subtitle;
	export let media_url = '/';

	interface Region {
		key: string;
		label: string;
	}

	const regions: Region[] = [
		{ key: 'all', label: 'Все Ригионы' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-east', label: 'Северо-Западный регион' }
	];

	let filteredUpcomingEvents = upcomingEvents;
	let selectedRegion = 'all';

	function filterResources(region: Region) {
		filteredUpcomingEvents =
			region.key === 'all'
				? upcomingEvents
				: upcomingEvents.filter((event) => event.region === region.key);
	}
</script>

<div class="container-xxl py-5">
	<div class="container">
		<div class="row g-0 gx-5 align-items-end">
			<div class="col-lg-5">
				<div class="section-header mb-5 text-start" style="max-width: 500px;">
					<h1 class="display-5 mb-3">{title}</h1>
					<p>{subtitle}</p>
				</div>
			</div>
			<div class="row g-0 gx-5">
				<div class="col-lg-12">
					<ul class="nav nav-pills d-inline-flex b-5 mb-5">
						{#each regions as region}
							<li class="nav-item me-2">
								<button
									class="btn btn-outline-primary border-2 {region.key === selectedRegion
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
		</div>
		<div class="tab-content">
			<div class="row g-4">
				{#each filteredUpcomingEvents as event}
					<div class="col-xl-4 col-lg-4 col-md-6">
						<div class="product-item">
							<div class="position-relative bg-light overflow-hidden">
								{#if event.featured_image}
									<img class="img-fluid w-100" src={`${media_url}${event.featured_image}`} alt="" />
								{/if}
							</div>
							<div class="p-4 text-center">
								<a class="d-block h5 mb-2" style="min-height: calc(1.5em * 2)" href={event.slug}
									>{event.title}</a
								>
								<span class="text-primary me-1">{event.region}</span>
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
<!-- Product End -->

<!-- This is the button for more -->
<!-- 			<div class="col-12 text-center pt-4"> -->
<!-- 	<a class="btn btn-primary rounded-pill px-5 py-3" href="">Browse More Products</a> -->
<!-- </div> -->
