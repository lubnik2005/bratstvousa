<script lang="ts">
	// Props from +page.ts (optional)
	export let data: {
		media_url?: string;
		event?: {
			title?: string;
			date?: string; // ISO
			description?: string;
			featuredImage?: string;
			use_editorjs?: boolean;
			editorjs_rendered?: string;
			content?: string;
			registerUrl?: string;
			registerLabel?: string;
			location?: string;
		};
		registration_count?: number;
	} = {};

	// Schedule (keep your schedule data in ./schedule.ts and export `schedule`)
	import { schedule } from './schedule';

	// ---------- FALLBACK CONTENT ----------
	const fallbackMediaUrl = '';
	const eventData = {
		title: 'Молодёжный Лагерь СЗР ',
		date: '2025-10-16',
		description:
			'Расписание Молодёжного Лагеря СЗР АО • 16–19 октября, 2025. Американское Объединение МСЦ ЕХБ.',
		featuredImage: ''
	};

	type TimeBlock = {
		start?: string;
		end?: string;
		title: string;
		speaker?: string;
		notes?: string;
		inline?: boolean;
	};

	// Effective event values
	const mediaUrl = data.media_url ?? fallbackMediaUrl;
	const title = ' Молодёжный Лагерь СЗР АО 2025';
	const dateISO = data.event?.date || eventData.date;
	const description =
		data.event?.description ||
		'Американское Объединение МСЦ ЕХБ. Молодёжный Лагерь СЗР АО • 16–19 октября, 2025.';
	const featuredImage = data.event?.featuredImage || eventData.featuredImage;

	// Build a safe hero image src
	const heroSrc = `${mediaUrl}upfiles/page/north-west-youth-camp-2025-200.png`;

	// CTA
	const registerUrl =
		data.event?.registerUrl || '/youth-ministry/north-west-youth-camp-2025/registration';
	const registerLabel = data.event?.registerLabel || 'Зарегистрироваться';
	const location = data.event?.location || '';

	// ---- CAPACITY COUNTER (из 400) ----
	const CAPACITY = 400;
	const registeredRaw = Number(data.registration_count ?? 0);
	const registered = Math.max(
		0,
		Math.min(CAPACITY, Number.isFinite(registeredRaw) ? registeredRaw : 0)
	);
	const remaining = Math.max(0, CAPACITY - registered);
	const percent = Math.round((registered / CAPACITY) * 100);

	// Video embed
	const videoSrc = 'https://www.youtube.com/embed/lOJpVaNHg-Y?si=g8w_doDC1-Gc_IE0';

	// Helpers
	const fmtTime = (t?: string) => (t ? t : '');
	const hasTimes = (row: TimeBlock) => row.start || row.end;
</script>

<svelte:head>
	<meta property="og:title" content={title} />
	{#if heroSrc}
		<meta property="og:image" content={heroSrc} />
	{/if}
	<meta property="og:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:type" content="article" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content="Американское Объединение МСЦ ЕХБ" />
	{#if heroSrc}
		<meta name="twitter:image" content={heroSrc} />
	{/if}
	<meta property="og:site_name" content="Bratstvo USA" />
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<!-- HERO IMAGE -->
<!-- {#if heroSrc} -->
<!--   <div class="hero-image-wrap"> -->
<!--     <img src={heroSrc} class="img-fluid w-100 hero-image" alt="Изображение лагеря" /> -->
<!--   </div> -->
<!-- {/if} -->

<!-- HERO / DESCRIPTION + CTA -->
<section class="container-xxl pb-4">
	<div class="container">
		<div class="section-header mx-auto mt-5 text-center" style="max-width: 900px;">
			<h1 class="display-5 mb-2">{title}</h1>

			<!-- Dates / Location line -->
			<p class="text-muted mb-3">
				<strong>16–19 октября, 2025</strong>{location ? ` • ${location}` : ''}
			</p>

			<!-- Description -->
			<p class="lead">
				{data.event?.description ??
					'Иметь общение с христианской молодежью вокруг Слова Божьего — значит переживать совместное духовное единение, делиться опытом познания Бога и поддерживать друг друга в стремлении жить по вере.'}
			</p>

			<!-- CAPACITY COUNTER -->
			<div class="capacity mx-auto mt-3">
				<div class="d-flex justify-content-between align-items-center small text-muted mb-1">
					<div>Зарегистрировано: <strong>{registered}</strong> из <strong>{CAPACITY}</strong></div>
					<div>{percent}%</div>
				</div>
				<div class="progress" style="height: 10px;" aria-label="Заполненность регистрации">
					<div
						class="progress-bar"
						role="progressbar"
						aria-valuenow={registered}
						aria-valuemin="0"
						aria-valuemax={CAPACITY}
						style:width={percent + '%'}
					/>
				</div>
				{#if remaining > 0}
					<div class="text-muted small mt-1">Осталось мест: {remaining}</div>
				{:else}
					<div class="text-danger small mt-1">Регистрация заполнена.</div>
				{/if}
			</div>

			<!-- CTA Buttons -->
			<div class="d-flex justify-content-center mt-4 flex-wrap gap-3">
				<a class="btn btn-primary btn-lg shadow-sm" href={registerUrl} rel="noopener">
					{registerLabel}
				</a>
			</div>
		</div>
	</div>
</section>

<!-- VIDEO -->
<section id="video" class="pt-2">
	<div class="container-xxl pb-2">
		<div class="container">
			<div class="video-wrap mx-auto">
				<iframe
					src={videoSrc}
					title="Видео лагеря"
					loading="lazy"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
					referrerpolicy="strict-origin-when-cross-origin"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Optional extra content block from CMS -->
{#if data.event?.use_editorjs || data.event?.content}
	<div class="container mb-5">
		<div class="blog-content card border-0 shadow-sm">
			<div class="card-body p-md-5 p-4">
				{#if data.event?.use_editorjs}
					{@html data.event?.editorjs_rendered ?? ''}
				{:else}
					{@html data.event?.content}
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- SCHEDULE -->
<section id="schedule" class="pt-4">
	<div class="container-xxl pb-2">
		<div class="container">
			<h2 class="text-center">Расписание</h2>
		</div>
	</div>
	<div class="container mb-5 pb-4">
		<div class="blog-content">
			<div class="printable">
				{#each schedule as day}
					<h3 class="mt-5">{day.label}</h3>
					<div class="table-responsive">
						<table class="table-striped schedule-table table align-middle shadow-sm">
							<thead>
								<tr>
									<th style="width: 170px;">Время</th>
									<th>Событие</th>
									<th style="width: 220px;">Докладчик</th>
								</tr>
							</thead>
							<tbody>
								{#each day.rows as row}
									{#if row.inline}
										<tr class="inline-row">
											<td></td>
											<td><div class="inline-title">{row.title}</div></td>
											<td>{row.speaker ?? ''}</td>
										</tr>
									{:else}
										<tr>
											<td class="time">
												{#if hasTimes(row)}
													{fmtTime(row.start)}{row.end ? ' – ' + fmtTime(row.end) : ''}
												{/if}
											</td>
											<td>
												<strong>{row.title}</strong>
												{#if row.notes}<div class="text-muted small">{row.notes}</div>{/if}
											</td>
											<td>{row.speaker ?? ''}</td>
										</tr>
									{/if}
								{/each}
							</tbody>
						</table>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* HERO look */
	.hero-image-wrap {
		overflow: clip;
		max-height: 460px;
	}
	.hero-image {
		object-fit: cover;
		display: block;
	}
	.hero {
		background:
			radial-gradient(1200px 400px at 50% -120px, rgba(13, 110, 253, 0.12), transparent),
			linear-gradient(180deg, rgba(33, 37, 41, 0.02), transparent 40%);
	}

	/* Capacity card sizing */
	.capacity {
		max-width: 520px;
	}

	/* Video */
	.video-wrap {
		max-width: 900px;
		width: 100%;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}
	.video-wrap iframe {
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 0;
		display: block;
	}

	/* Schedule table polishing */
	.schedule-table {
		border-radius: 0.75rem;
		overflow: hidden;
	}
	.time {
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	tr.inline-row td {
		border-top: none;
		padding-top: 0;
		padding-bottom: 0.25rem;
	}
	.inline-title {
		padding-left: 0.75rem;
		border-left: 3px solid currentColor;
	}

	/* Print-friendly */
	@media print {
		.video-wrap,
		.container-xxl.hero .lead,
		.container-xxl.hero .btn {
			display: none !important;
		}
		h1,
		h2,
		h3 {
			page-break-after: avoid;
		}
		table {
			page-break-inside: auto;
		}
		tr {
			page-break-inside: avoid;
			page-break-after: auto;
		}
		.card,
		.shadow-sm {
			box-shadow: none !important;
		}
		.hero {
			background: none !important;
		}
	}
</style>
