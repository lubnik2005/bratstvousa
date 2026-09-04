<script lang="ts">
	import { hasEventContent } from '$lib/helpers';

	export let data;

	interface Greeting {
		greeting: string;
		image_url: string;
		first_name: string;
		last_name: string;
		email: string;
	}

	const greeting: Greeting = {
		greeting:
			'Юноши... вы сильны, слово Божие в вас пребывает и вы победили лукавого. Это вдохновляющее слово было сказано Апостолом Иоанном...',
		image_url: 'upfiles/optimized/youth-ministry-portrait.jpg',
		first_name: 'Вениамин Петрович',
		last_name: 'Бальжик',
		email: 'youth@bratstvousa.com'
	};

	const regionLabels: Record<string, string> = {
		central: 'Центральный регион',
		east: 'Восточный регион',
		california: 'Калифорнийский регион',
		'north-west': 'Северо-Западный регион'
	};
</script>

<svelte:head>
	<title>Молодежный отдел — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<div class="ministry-youth" style="--ministry-accent: var(--bs-accent-youth);">
	<div class="container-fluid page-header">
		<div class="container">
			<p class="eyebrow ministry-eyebrow">Отделы</p>
			<h1 class="display-3 mb-0">Молодежный отдел</h1>
		</div>
	</div>

	<div class="scripture-band">
		<div class="container">
			<blockquote class="scripture measure-wide mx-auto">
				Юноши, вы победили лукавого. Юноши, вы сильны, и слово Божие пребывает в вас.
				<cite>1 Иоанна 2:14</cite>
			</blockquote>
		</div>
	</div>

	<div class="container my-6">
		<div class="row gx-5 gy-5 align-items-start">
			<div class="col-lg-8">
				<p class="eyebrow mb-2">Приветственное слово</p>
				<h2 class="mb-4">Слово к молодежи</h2>
				<p>{greeting.greeting}</p>
				<footer class="blockquote-footer mt-3">
					{greeting.last_name}
					{greeting.first_name}
				</footer>
			</div>

			<div class="col-lg-4">
				<div class="leader-card" style="--leader-accent: var(--bs-accent-youth);">
					<img src="{data.media_url}{greeting.image_url}" alt={greeting.last_name} />
					<p class="leader-name">{greeting.last_name} {greeting.first_name}</p>
					<p class="leader-role">Ответственный за отдел</p>
					<a href="mailto:{greeting.email}">{greeting.email}</a>
				</div>
			</div>
		</div>
	</div>

	{#if data.upcomingEvents.length}
		<div class="container my-6">
			<div class="section-header mb-5 text-start">
				<p class="eyebrow">Календарь</p>
				<h2 class="mb-0">События</h2>
			</div>
			<div class="row g-4 g-lg-5">
				{#each data.upcomingEvents as event}
					<div class="col-md-6 col-lg-4">
						<article class="event-entry">
							{#if event.featuredImage}
								{#if hasEventContent(event)}
									<a class="event-figure d-block" href={`/youth-ministry/${event.slug}`}>
										<img src={`${data.media_url}${event.featuredImage}`} alt="" />
									</a>
								{:else}
									<span class="event-figure d-block">
										<img src={`${data.media_url}${event.featuredImage}`} alt="" />
									</span>
								{/if}
							{/if}
							<div class="event-meta mt-3">
								<span class="eyebrow mb-0">{event.startAtString}</span>
								{#if event.region && regionLabels[event.region]}
									<span class="event-region">{regionLabels[event.region]}</span>
								{/if}
							</div>
							<h3 class="event-title h5 mt-2">{event.title}</h3>
							{#if hasEventContent(event)}
								<a class="btn-quiet event-cta" href={`/youth-ministry/${event.slug}`}>
									Подробнее →
								</a>
							{/if}
						</article>
					</div>
				{/each}
			</div>
		</div>
	{/if}

</div>

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
	.ministry-eyebrow {
		color: var(--ministry-accent);
	}
	.page-header {
		border-bottom-color: var(--ministry-accent);
	}
	.scripture-band {
		background: var(--bs-paper-sunk);
		border-top: 1px solid var(--bs-rule);
		border-bottom: 1px solid var(--bs-rule);
		padding: 3rem 0;
	}
	.scripture-band .scripture {
		border-left-color: var(--ministry-accent);
		margin-bottom: 0;
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
