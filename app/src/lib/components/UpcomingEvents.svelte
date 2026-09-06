<script lang="ts">
	import { hasEventContent } from '$lib/helpers';

	// Event type for upcoming events display
	interface UpcomingEvent {
		id: number;
		title: string;
		slug: string | null;
		region: string | null;
		featuredImage: string | null;
		startAtString?: string | null;
		dateRange?: string | null;
		description?: string | null;
		content?: string | null;
		editorjs?: unknown;
		use_editorjs?: unknown;
	}

	export let region: string | undefined = undefined;
	export let upcomingEvents: UpcomingEvent[] = [];
	export let title = 'События';
	export let subtitle: string | undefined = undefined;
	export let media_url = '/';
	export let show_filters = true;
	export let ministry_slug = 'general-event';

	// Region labels for the per-event badge. Events with an unknown/null region
	// simply render no badge.
	const regionLabels: Record<string, string> = {
		central: 'Центральный регион',
		east: 'Восточный регион',
		california: 'Калифорнийский регион',
		'north-west': 'Северо-Западный регион'
	};

	// Show ALL upcoming events (no region-selection UI); each card carries a
	// region badge instead.
	$: displayedEvents = upcomingEvents;
</script>

{#if displayedEvents.length > 0}
	<section class="my-6">
		<div class="container">
			<div class="section-header mb-4 text-start">
				<p class="eyebrow">Календарь</p>
				<h2 class="mb-2">{title}</h2>
				{#if subtitle}
					<p class="text-muted mb-0">{subtitle}</p>
				{/if}
			</div>

			<div class="row g-4 g-lg-5">
				{#each displayedEvents as event (event.id)}
					<div class="col-md-6 col-lg-4">
						<article class="event-entry">
							{#if event.featuredImage}
								{#if hasEventContent(event)}
									<a class="event-figure d-block" href={`/${ministry_slug}/${event.slug}`}>
										<img
											src={`${media_url}${event.featuredImage}`}
											alt={event.title}
											loading="lazy"
											decoding="async"
										/>
									</a>
								{:else}
									<span class="event-figure d-block">
										<img
											src={`${media_url}${event.featuredImage}`}
											alt={event.title}
											loading="lazy"
											decoding="async"
										/>
									</span>
								{/if}
							{/if}
							<div class="event-meta mt-3">
								{#if event.dateRange ?? event.startAtString}
									<span class="eyebrow mb-0">{event.dateRange ?? event.startAtString}</span>
								{/if}
								{#if event.region && regionLabels[event.region]}
									<span class="event-region">{regionLabels[event.region]}</span>
								{/if}
							</div>
							<h3 class="event-title h5 mt-2">{event.title}</h3>
							{#if hasEventContent(event)}
								<a class="btn-quiet event-cta" href={`/${ministry_slug}/${event.slug}`}>
									Подробнее →
								</a>
							{/if}
						</article>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.event-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.75rem;
	}
	.event-region {
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--bs-ink-muted);
		background: var(--bs-paper-sunk);
		border: 1px solid var(--bs-rule);
		padding: 0.15rem 0.5rem;
		white-space: nowrap;
	}
	.event-figure img {
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		transition: opacity 0.4s ease;
	}
	.event-figure:hover img {
		opacity: 0.92;
	}
	.event-title {
		display: block;
		font-family: var(--bs-font-serif, 'Lora', serif);
		font-size: 1.15rem;
		line-height: 1.35;
		color: var(--bs-dark);
		margin: 0;
	}
	.event-cta {
		display: inline-block;
		margin-top: 0.6rem;
	}
</style>
