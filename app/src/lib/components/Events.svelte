<script lang="ts">
	import { regionToLabel, hasEventContent } from '$lib/helpers';
	export let events;
	export let ministry_slug;
</script>

{#if events?.length}
	<section class="events my-6">
		<p class="eyebrow mb-2 text-center">Календарь</p>
		<h2 class="mb-5 text-center">События</h2>
		<div class="measure-wide mx-auto">
			<ul class="event-list list-unstyled mb-0">
				{#each events as event}
					<li class="event-item">
						<div class="event-when">
							<span class="event-day">{Number(event.startAt?.split('-')[2] ?? '')}</span>
							<span class="event-rest">
								{event.dateRange ?? event.startAtString}
							</span>
						</div>
						<div class="event-body">
							<h3 class="event-title h5 mb-1">{event.title}</h3>
							<p class="event-meta mb-1">
								{regionToLabel(event.region) || 'Место не указано'}
							</p>
							{#if event.description}
								<p class="event-desc mb-2">{event.description}</p>
							{/if}
							{#if hasEventContent(event)}
								<a href={`/${ministry_slug}/${event.slug}`} class="btn-quiet">Подробнее →</a>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.event-list {
		border-top: 1px solid var(--bs-rule, #ddd5c8);
	}

	.event-item {
		display: grid;
		grid-template-columns: 8rem 1fr;
		gap: 1.5rem;
		padding: 1.75rem 0;
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
	}

	.event-when {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-top: 0.15rem;
	}

	.event-day {
		font-family: 'Lora', serif;
		font-size: 2rem;
		line-height: 1;
		color: var(--bs-dark, #2c2b29);
	}

	.event-rest {
		margin-top: 0.4rem;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--bs-ink-muted, #736a5f);
	}

	.event-title {
		font-family: 'Lora', serif;
		color: var(--bs-dark, #2c2b29);
	}

	.event-meta {
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--bs-ink-muted, #736a5f);
	}

	.event-desc {
		color: var(--bs-body-color, #3a352f);
		max-width: 34rem;
	}

	@media (max-width: 575.98px) {
		.event-item {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		.event-when {
			flex-direction: row;
			align-items: baseline;
			gap: 0.6rem;
		}
		.event-day {
			font-size: 1.4rem;
		}
		.event-rest {
			margin-top: 0;
		}
	}
</style>
