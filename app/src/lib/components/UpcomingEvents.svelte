<script lang="ts">
	// Event type for upcoming events display
	interface UpcomingEvent {
		id: number;
		title: string;
		slug: string | null;
		region: string | null;
		featuredImage: string | null;
		startAtString?: string;
	}

	interface Region {
		key: string;
		label: string;
	}

	export let region: string | undefined = undefined;
	export let upcomingEvents: UpcomingEvent[] = [];
	export let title = 'События';
	export let subtitle: string | undefined = undefined;
	export let media_url = '/';
	export let show_filters = true;
	export let ministry_slug = 'general-event';

	// Only show filters if there are more than 6 events
	$: showFiltersComputed = show_filters && upcomingEvents.length > 6;

	const regions: Region[] = [
		{ key: 'all', label: 'Все Регионы' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];

	let selectedRegion: Region = { key: 'all', label: 'Все Регионы' };

	$: filteredUpcomingEvents = showFiltersComputed
		? selectedRegion.key === 'all'
			? upcomingEvents.filter((event) => !!event.region)
			: upcomingEvents.filter((event) => event.region === selectedRegion.key)
		: upcomingEvents.filter((event) => !!event.region);

	$: hasEventsInRegions = upcomingEvents.some((event) =>
		regions.some((r) => r.key === event.region)
	);

	function selectRegion(r: Region) {
		selectedRegion = r;
	}
</script>

{#if hasEventsInRegions}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="row g-0 gx-5 align-items-end">
				<div class="col-lg-5">
					<div class="section-header mb-5 text-start" style="max-width: 500px;">
						<h1 class="display-5 mb-3">{title}</h1>
						{#if subtitle}
							<p>{subtitle}</p>
						{/if}
						{#if region}
							{region}
						{/if}
					</div>
				</div>
				{#if showFiltersComputed}
					<div class="row g-0 gx-5">
						<div class="col-lg-12">
							<ul class="nav nav-pills d-inline-flex b-5 mb-5">
								{#each regions as r}
									<li class="nav-item me-2">
										<button
											class="btn btn-outline-primary border-2 {r.key === selectedRegion.key
												? 'active'
												: ''}"
											data-bs-toggle="pill"
											on:click={() => selectRegion(r)}>{r.label}</button
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
					{#each filteredUpcomingEvents as event (event.id)}
						<div class="col-xl-4 col-lg-4 col-md-6">
							<div class="product-item">
								<div class="position-relative bg-light overflow-hidden">
									{#if event.featuredImage}
										<img
											class="img-fluid w-100"
											src={`${media_url}${event.featuredImage}`}
											alt={event.title}
										/>
									{/if}
								</div>
								<div class="p-4 text-center">
									<a
										class="d-block h5 mb-2"
										style="min-height: calc(1.5em * 2)"
										href={`/${ministry_slug}/${event.slug}`}>{event.title}</a
									>
									{#if event.startAtString}
										<span class="text-primary me-1">{event.startAtString}</span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
