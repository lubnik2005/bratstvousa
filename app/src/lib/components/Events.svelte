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

<style>
	:root {
		--bs-primary: #2c3e50;
		--bs-dark: #1a252f;
	}

	.card {
		border-radius: 12px;
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
	}

	/* 📅 Event Date Block */
	.event-date {
		background: var(--bs-dark);
		color: #ffffff;
		min-width: 70px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 1.4rem;
		font-weight: bold;
		padding: 15px 0;
		border-radius: 12px 0 0 12px;
	}

	.event-divider {
		font-size: 1rem;
		opacity: 0.6;
		margin: 2px 0;
	}

	.event-details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* 📰 News Cards */
	.news-card {
		height: 350px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.news-image {
		height: 70%;
		object-fit: cover;
	}

	/* 🎭 News Overlay */
	.bg-dark.opacity-50 {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 30%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		backdrop-filter: blur(4px);
	}

	:root {
		--bs-primary: #2c3e50;
		--bs-dark: #1a252f;
	}

	.news-card {
		height: 350px;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease-in-out;
	}

	.news-card:hover {
		transform: translateY(-3px);
		box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
	}

	/* 📸 Ensure News Images Fit */
	.news-image {
		height: 100%;
		object-fit: cover;
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}

	/* 📝 Overlay Content */
	.news-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 15px;
		backdrop-filter: blur(4px);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border-radius: 0 0 12px 12px;
	}

	.news-title {
		color: white;
		font-size: 1.1rem;
		margin-bottom: 5px;
	}

	.news-date {
		font-size: 0.85rem;
		opacity: 0.8;
	}
	.text-outline {
		color: white;
		-webkit-text-stroke: 1px black; /* Black outline */
	}
</style>
