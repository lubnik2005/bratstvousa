<script lang="ts">
	import { regionToLabel } from '$lib/helpers';
	export let events;
	export let ministry_slug;
</script>

<section class="row">
	<h2 class="fw-bold mb-4 text-center">События</h2>
	<div class="col-lg-12">
		<div class="row g-4">
			{#each events as event}
				<div class="col-md-4">
					<div class="card event-card d-flex align-items-stretch flex-row border-0 shadow-sm">
						<!-- 📅 Full-Height Date Block -->
						<div class="event-date">
							<div class="event-day">{event.startAtString.split('/')[0]}</div>
							<div class="event-divider">/</div>
							<div class="event-month">{event.startAtString.split('/')[1]}</div>
							<div class="event-divider">/</div>
							<div class="event-year">{event.startAtString.split('/')[2]}</div>
						</div>

						<!-- 📝 Event Details -->
						<div class="event-details flex-grow-1 p-3">
							<h5 class="fw-bold mb-1">{event.title}</h5>
							<!-- <p class="text-muted small mb-2">{event.description ?? ' '}</p> -->
							<p class="text-muted small mb-2">
								{regionToLabel(event.region) || 'Место не указано'}
							</p>
							<p class="text-dark small">{event.description || 'Описание отсутствует'}</p>
							{#if event.content}
								<a
									href={`/${ministry_slug}/${event.slug}`}
									class="btn btn-sm btn-outline-primary mt-2">Подробнее</a
								>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
