
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
      registerUrl?: string;   // <-- add this in your loader if you have it
      registerLabel?: string; // optional custom label
      location?: string;      // optional
    };
    registration_count?: number; // <-- added
  } = {};

  import '@splidejs/svelte-splide/css';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';

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
  type DaySchedule = { key: string; label: string; rows: TimeBlock[]; dateNote?: string };


	const schedule: DaySchedule[] = [
		{
			key: 'thu',
			label: 'Четверг',
			rows: [
				{ start: '12:00pm', end: '04:00pm', title: 'Заезд / Регистрация' },
				{ start: '06:00pm', end: '07:00pm', title: 'Ужин' },
				{ start: '07:30pm', end: '10:00pm', title: 'Общение в доме молитвы' },
				{ title: 'Правила лагеря', speaker: 'Заец Д.', inline: true },
				{ title: '“Всеобщее милосердие Бога” — Иона 1 глава', speaker: 'Антонюк А. С.', inline: true },
				{ title: 'Знакомство со служителем', speaker: 'Salem', inline: true },
				{ start: '10:00pm', end: '12:00am', title: 'Чай' },
				{ start: '12:00am', title: 'Отбой' }
			]
		},
		{
			key: 'fri',
			label: 'Пятница',
			rows: [
				{ start: '08:00am', end: '08:45am', title: 'Утренняя молитва' },
				{ title: '“Истинные свидетельства” — Ин. 5:31–35', inline: true },
				{ start: '09:00am', end: '10:00am', title: 'Завтрак' },
				{ start: '10:30am', end: '12:00pm', title: 'Утреннее служение' },
				{ title: '“Путь духовного восстановления” — 2 глава', speaker: 'Заец Д.', inline: true },
				{ start: '12:00pm', end: '12:30pm', title: 'Обсуждение темы по группам' },
				{ start: '12:30pm', end: '12:45pm', title: 'Общая фотография' },
				{ start: '12:45pm', end: '02:00pm', title: 'Свободное время: go karts, swing, activities' },
				{ start: '02:00pm', end: '03:00pm', title: 'Обед' },
				{ start: '03:00pm', end: '04:00pm', title: 'Беседа для братьев', speaker: 'Нейман К. А.' },
				{ start: '03:00pm', end: '05:00pm', title: 'Свободное время: go karts, swing, activities' },
				{ start: '05:30pm', end: '07:00pm', title: 'Общая тематическая беседа', speaker: 'Нейман К. А.' },
				{ title: '“Не передвигай межи давней, которую провели отцы твои”', inline: true },
				{ start: '07:00pm', end: '08:00pm', title: 'Ужин' },
				{
					start: '08:30pm',
					end: '10:30pm',
					title: 'Общение в доме молитвы (Молодёжь церкви “Слово Истины”)'
				},
				{ title: '“Исповедание — путь духовного обновления”', speaker: 'Антонюк А. С.', inline: true },
				{ start: '10:30pm', end: '12:00am', title: 'Чай' },
				{ start: '12:00am', title: 'Отбой' }
			]
		},
		{
			key: 'sat',
			label: 'Суббота',
			rows: [
				{ start: '08:00am', end: '08:45am', title: 'Утренняя молитва' },
				{ title: '“Истинные свидетельства” — Ин. 5:36–38', inline: true },
				{ start: '09:00am', end: '10:00am', title: 'Завтрак' },
				{ start: '10:30am', end: '12:00pm', title: 'Утреннее служение' },
				{ title: '“Истинное покаяние” — Иона, 3 глава', speaker: 'Антонюк А. С.', inline: true },
				{ start: '12:00pm', end: '12:30pm', title: 'Обсуждение темы по группам' },
				{ start: '12:30pm', end: '02:00pm', title: 'Свободное время: go karts, swing, activities' },
				{ start: '02:00pm', end: '03:00pm', title: 'Обед' },
				{ start: '03:00pm', end: '04:00pm', title: 'Беседа для сестёр', speaker: 'Антонюк А. С.' },
				{ start: '03:00pm', end: '05:00pm', title: 'Свободное время: go karts, swing, activities' },
				{ start: '05:30pm', end: '07:00pm', title: 'Общая тематическая беседа', speaker: 'Диакону Д.' },
				{ title: '“То, что вы не сможете делать на небесах”', inline: true },
				{ start: '07:00pm', end: '08:00pm', title: 'Ужин' },
				{
					start: '08:30pm',
					end: '10:00pm',
					title: 'Общение в доме молитвы (Молодёжь церкви Spokane)'
				},
				{ title: '“Надежда для усталого сердца”', speaker: 'Кузнецов С. Г.', inline: true },
				{ start: '10:00pm', end: '12:00am', title: 'Чай' },
				{ start: '12:00am', title: 'Отбой' }
			]
		},
		{
			key: 'sun',
			label: 'Воскресенье',
			rows: [
				{ start: '08:00am', end: '08:45am', title: 'Утренняя молитва' },
				{ title: '“Истинные свидетельства” — Ин. 5:39–47', inline: true },
				{ start: '09:00am', end: '10:00am', title: 'Завтрак' },
				{
					start: '10:30am',
					end: '12:00pm',
					title: 'Утреннее служение (и призыв)',
					speaker: 'Антонюк А. С.'
				},
				{ title: '“Индивидуальная работа Бога с человеком” — 4 глава', inline: true },
				{ start: '12:00pm', end: '01:00pm', title: 'Уборка комнат и территории' },
				{ start: '01:00pm', end: '02:00pm', title: 'Обед' },
				{ start: '02:00pm', title: 'Выезд' }
			]
		}
	];

  // Effective event values
  const mediaUrl = data.media_url ?? fallbackMediaUrl;
  const title = data.event?.title || eventData.title;
  const dateISO = data.event?.date || eventData.date;
  const description =
    data.event?.description ||
    'Американское Объединение МСЦ ЕХБ. Молодёжный Лагерь СЗР АО • 16–19 октября, 2025.';
  const featuredImage = data.event?.featuredImage || eventData.featuredImage;

  // Build a safe hero image src
  const heroSrc =
    featuredImage && /^https?:\/\//.test(featuredImage)
      ? featuredImage
      : (mediaUrl || '') + (featuredImage || '');

  // CTA
  const registerUrl =
    data.event?.registerUrl || '/youth-ministry/north-west-youth-camp-2025/registration'; // <— set your actual route or external form URL
  const registerLabel = data.event?.registerLabel || 'Зарегистрироваться';
  const location = data.event?.location || '';

  // ---- CAPACITY COUNTER (из 400) ----
  const CAPACITY = 400;
  const registeredRaw = Number(data.registration_count ?? 0);
  const registered = Math.max(0, Math.min(CAPACITY, Number.isFinite(registeredRaw) ? registeredRaw : 0));
  const remaining = Math.max(0, CAPACITY - registered);
  const percent = Math.round((registered / CAPACITY) * 100);

  // Helpers
  const fmtTime = (t?: string) => (t ? t : '');
  const hasTimes = (row: TimeBlock) => row.start || row.end;

  // Splide options
  const splideOptions = {
    type: 'slide',
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    pagination: true,
    arrows: true,
    breakpoints: {
      768: { gap: '0.5rem' }
    }
  };
</script>

<svelte:head>
  <meta property="og:title" content={title} />
  {#if heroSrc}
    <meta property="og:image" content={heroSrc} />
  {/if}
  <meta property="og:description" content="Американское Объединение МСЦ ЕХБ" />
  <meta property="og:type" content="article" />
  {#if dateISO}
    <meta property="article:published_time" content={dateISO} />
  {/if}
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

{#if heroSrc}
  <div class="container p-0">
    <img src={heroSrc} class="img-fluid w-100" alt="Top Image" />
  </div>
{/if}

<!-- HERO / DESCRIPTION + CTA -->
<div class="container-xxl pb-4">
  <div class="container">
    <div class="section-header mx-auto mt-5 text-center" style="max-width: 900px;">
      <h1 class="display-5 mb-2">{title}</h1>

      <!-- Dates / Location line -->
      <p class="text-muted mb-3">
        <strong>16–19 октября, 2025</strong>{location ? ` • ${location}` : ''}
      </p>

      <!-- Description -->
      <p class="lead">
        {data.event?.description ?? 'Иметь общение с христианской молодежью вокруг Слова Божьего — значит переживать совместное духовное единение, делиться опытом познания Бога и поддерживать друг друга в стремлении жить по вере.'}
      </p>

      <!-- CAPACITY COUNTER -->
      <div class="mx-auto mt-3" style="max-width: 520px;">
        <div class="d-flex justify-content-between align-items-center mb-1 small text-muted">
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
      <div class="d-flex gap-3 justify-content-center mt-4 flex-wrap">
        <a class="btn btn-primary btn-lg" href={registerUrl} rel="noopener">
          {registerLabel}
        </a>
      </div>
    </div>
  </div>
</div>

<!-- Optional extra content block from CMS -->
{#if data.event?.use_editorjs || data.event?.content}
  <div class="container mb-5">
    <div class="blog-content">
      {#if data.event?.use_editorjs}
        {@html data.event?.editorjs_rendered ?? ''}
      {:else}
        {@html data.event?.content}
      {/if}
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
  <div class="container pb-4 mb-4">
    <div class="blog-content">
      <div class="printable">
        {#each schedule as day}
          <h3 class="mt-5">{day.label}</h3>
          <table class="table table-striped align-middle">
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
                    <td>
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
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .schedule-card { border-radius: 1rem; }
  .time { white-space: nowrap; font-variant-numeric: tabular-nums; }
  tr.inline-row td { border-top: none; padding-top: 0; padding-bottom: 0.25rem; }
  .inline-title { padding-left: 0.75rem; border-left: 3px solid currentColor; }

  @media (max-width: 576px) {
    .mobile-cta {
      position: sticky;
      bottom: 0;
      z-index: 1020;
      background: var(--bs-body-bg, #fff);
      border-top: 1px solid rgba(0,0,0,.08);
      padding: .75rem;
    }
  }

  @media print {
    .splide,
    .container-xxl.pb-4 .lead,
    .container-xxl.pb-4 .btn { display: none !important; }
    h1, h2, h3 { page-break-after: avoid; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
  }
</style>

