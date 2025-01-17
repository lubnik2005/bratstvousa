<script lang="ts">
	import type { Event as E } from '$lib/server/db/schema';
	import { bindIfParam } from 'drizzle-orm';
	export let region;
	export let upcomingEvents: (typeof E)[] | undefined = [];
	export let title = 'События';
	export let subtitle;
	export let media_url = '/';
	export let show_filters = true;
  export let ministry_slug = 'general-event';

	interface Region {
		key: string;
		label: string;
	}

	export const regions: Region[] = [
		{ key: 'all', label: 'Все Ригионы' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];

	let filteredUpcomingEvents = upcomingEvents;
	let selectedRegion = { key: 'all', label: 'Все Ригионы' };

	function filterResources(region: Region) {
		filteredUpcomingEvents = upcomingEvents.filter(
			(event) => event.region?.toString() === region.key
		);
	}
	filterResources(selectedRegion);
</script>

{#if upcomingEvents.some( (event) => regions.some((region) => region.key === event.region?.toString()) )}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">{title}</h1>
						<p>{subtitle}</p>
						{region}
					</div>
				</div>
				{#if show_filters}
					<div class="row g-0 gx-5">
						<div class="col-lg-12">
							<ul class="nav nav-pills d-inline-flex b-5 mb-5">
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
				{/if}
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
											src={`${media_url}${event.featuredImage}`}
											alt=""
										/>
									{/if}
								</div>
								<div class="p-4 text-center">
									<a
										class="d-block h5 mb-2"
										style="min-height: calc(1.5em * 2)"
										href={`/${ministry_slug}/${event.slug}`}}>{event.title}</a
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
	<!-- Product End -->
{/if}

<!-- This is the button for more -->
<!-- 			<div class="col-12 text-center pt-4"> -->
<!-- 	<a class="btn btn-primary rounded-pill px-5 py-3" href="">Browse More Products</a> -->
<!-- </div> -->
