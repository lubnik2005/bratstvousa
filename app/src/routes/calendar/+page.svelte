<script lang="ts">
	import { tick } from 'svelte';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		dateKey,
		eventDateLabel,
		filterEvents,
		localDate,
		ministries,
		calendarWeeks,
		occursOn,
		regions
	} from '$lib/calendar';
	import ArrowIcon from '$lib/components/ArrowIcon.svelte';
	import type { PageData, Snapshot } from './$types';

	export let data: PageData;
	let region = $page.url.searchParams.get('region') || 'all';
	let ministry = $page.url.searchParams.get('ministry') || 'all';
	let query = $page.url.searchParams.get('q') || '';
	let ready = false;
	let calendarPanel: HTMLElement;
	let view = $page.url.searchParams.get('view') === 'month' ? 'month' : 'list';
	const initialDay = $page.url.searchParams.get('day');
	let selectedDay =
		initialDay &&
		/^\d{4}-\d{2}-\d{2}$/.test(initialDay) &&
		!Number.isNaN(localDate(initialDay).getTime())
			? initialDay
			: dateKey(new Date());
	let selectedMonth = selectedDay.slice(0, 7);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	type CalendarState = {
		region: string;
		ministry: string;
		query: string;
		view: string;
		selectedDay: string;
		scrollY: number;
		anchor?: string;
		anchorOffset?: number;
	};

	export const snapshot: Snapshot<CalendarState> = {
		capture: () => {
			const anchor = [...document.querySelectorAll<HTMLElement>('[data-event-key]')].find(
				(element) => element.getBoundingClientRect().bottom > 0
			);
			return {
				region,
				ministry,
				query,
				view,
				selectedDay,
				scrollY: window.scrollY,
				anchor: anchor?.dataset.eventKey,
				anchorOffset: anchor?.getBoundingClientRect().top
			};
		},
		restore: (saved) => {
			region = saved.region;
			ministry = saved.ministry;
			query = saved.query;
			view = saved.view;
			selectedDay = saved.selectedDay;
			selectedMonth = selectedDay.slice(0, 7);
			void restoreScroll(saved);
		}
	};

	$: matching = filterEvents(data.events, region, ministry, query);
	$: filtered = matching.filter(
		(event) =>
			localDate(event.start) >= today ||
			localDate(event.end || event.start).getTime() - 86400000 >= today.getTime()
	);
	$: displayed =
		view === 'month' ? matching.filter((event) => occursOn(event, selectedDay)) : filtered;
	$: groups =
		view === 'month'
			? [{ key: selectedMonth, events: displayed }]
			: [...new Set(displayed.map((event) => event.start.slice(0, 7)))].map((month) => ({
					key: month,
					events: displayed.filter((event) => event.start.startsWith(month))
				}));
	$: weeks = calendarWeeks(selectedMonth, matching);
	// Only user actions write URL state; restoring history must not rewrite it.
	async function syncUserAction(): Promise<void> {
		await tick();
		if (ready) syncFilters(region, ministry, query, view, selectedDay);
	}

	function syncFilters(r: string, m: string, q: string, mode: string, day: string): void {
		const url = new URL(window.location.href);
		for (const [key, value] of Object.entries({
			region: r,
			ministry: m,
			q,
			view: mode === 'month' ? mode : '',
			day
		})) {
			if (value && value !== 'all') url.searchParams.set(key, value);
			else url.searchParams.delete(key);
		}
		replaceState(url, $page.state);
	}

	afterNavigate(() => {
		ready = true;
	});

	async function restoreScroll(saved: CalendarState): Promise<void> {
		// SvelteKit restores snapshots after its own scroll handling. Wait for the
		// restored tab and rows to render before correcting the visible anchor.
		await tick();
		requestAnimationFrame(() => {
			const anchor = [...document.querySelectorAll<HTMLElement>('[data-event-key]')].find(
				(element) => element.dataset.eventKey === saved.anchor
			);
			const top =
				anchor && saved.anchorOffset !== undefined
					? window.scrollY + anchor.getBoundingClientRect().top - saved.anchorOffset
					: saved.scrollY;
			window.scrollTo({ top: top ?? 0, behavior: 'instant' });
		});
	}

	async function goToToday(): Promise<void> {
		selectedDay = dateKey(new Date());
		selectedMonth = selectedDay.slice(0, 7);
		await syncUserAction();
		await tick();
		calendarPanel
			?.querySelector<HTMLButtonElement>('.calendar-day.selected')
			?.focus({ preventScroll: true });
		const target = calendarPanel;
		target?.scrollIntoView({
			block: 'start',
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
		});
	}

	function changeMonth(direction: number): void {
		const date = localDate(`${selectedMonth}-01`);
		date.setMonth(date.getMonth() + direction);
		selectedDay = dateKey(date);
		selectedMonth = selectedDay.slice(0, 7);
		void syncUserAction();
	}
</script>

<svelte:head><title>События — Братство США</title></svelte:head>

<div class="agenda">
	<header class="agenda-heading">
		<div>
			<p class="kicker">Встречаемся. Общаемся. Возрастаем.</p>
			<h1>События</h1>
		</div>
	</header>
	<div class="view-switch" role="group" aria-label="Вид событий">
		<button
			aria-pressed={view === 'list'}
			on:click={() => {
				view = 'list';
				void syncUserAction();
			}}>Список</button
		>
		<button
			aria-pressed={view === 'month'}
			on:click={() => {
				view = 'month';
				void syncUserAction();
			}}>Месяц</button
		>
	</div>
	<div class="agenda-filters">
		<div class="search-heading">
			<label for="event-search">Найти событие</label>
			<span class="result-count" role="status"
				>Найдено{view === 'month' ? ' на день' : ''}: {displayed.length}</span
			>
		</div>
		<input
			id="event-search"
			type="search"
			placeholder="Название события…"
			bind:value={query}
			on:input={syncUserAction}
		/>
		<div class="filter-row">
			<label
				><span>Регион</span><select bind:value={region} on:change={syncUserAction}
					>{#each regions as item}<option value={item.key}>{item.label}</option>{/each}</select
				></label
			>
			<label
				><span>Отдел</span><select bind:value={ministry} on:change={syncUserAction}
					>{#each ministries as item}<option value={item.key}>{item.label}</option>{/each}</select
				></label
			>
		</div>
	</div>
	{#if view === 'month'}
		<section bind:this={calendarPanel} class="month-calendar" aria-label="Календарь событий">
			<div class="month-controls">
				<button
					aria-label="Предыдущий месяц"
					disabled={selectedMonth <= data.rangeStart.slice(0, 7)}
					on:click={() => changeMonth(-1)}><ArrowIcon kind="left" /></button
				>
				<div class="month-title">
					<h2 aria-live="polite">
						{new Intl.DateTimeFormat('ru', { month: 'long', year: 'numeric' }).format(
							localDate(`${selectedMonth}-01`)
						)}
					</h2>
					<button
						class="today-button"
						on:click={goToToday}
						disabled={selectedDay === dateKey(today)}>Сегодня</button
					>
				</div>
				<button
					aria-label="Следующий месяц"
					disabled={selectedMonth >= data.rangeEnd.slice(0, 7)}
					on:click={() => changeMonth(1)}><ArrowIcon kind="right" /></button
				>
			</div>
			<div class="month-grid">
				{#each ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as weekday}<span class="weekday"
						>{weekday}</span
					>{/each}
			</div>
			{#each weeks as week, weekIndex (`${selectedMonth}:${weekIndex}`)}
				<div class="calendar-week" style={`--lanes: ${week.lanes}`}>
					{#each week.dates as cell, column (cell.day ?? `empty-${column}`)}
						{#if cell.day}
							<button
								class="calendar-day"
								style={`grid-column: ${column + 1}; grid-row: 1`}
								data-date={cell.day}
								class:selected={cell.day === selectedDay}
								class:today={cell.day === dateKey(today)}
								aria-pressed={cell.day === selectedDay}
								aria-current={cell.day === dateKey(today) ? 'date' : undefined}
								aria-label={`${new Intl.DateTimeFormat('ru', { dateStyle: 'long' }).format(localDate(cell.day))}, событий: ${cell.count}`}
								on:click={() => {
									selectedDay = cell.day!;
									void syncUserAction();
								}}
							>
								<span>{localDate(cell.day).getDate()}</span>
							</button>
						{:else}<span style={`grid-column: ${column + 1}; grid-row: 1`}></span>{/if}
					{/each}
					{#each week.bars as bar (`${bar.event.schemaName}:${bar.event.id}`)}
						<button
							class="event-span"
							class:span-start={bar.starts}
							class:span-end={bar.ends}
							style={`grid-column: ${bar.first + 1} / ${bar.last + 2}; grid-row: ${bar.lane + 2}; background: ${bar.event.backgroundColor}`}
							aria-label={`${bar.event.title}, ${eventDateLabel(bar.event)}`}
							title={`${bar.event.title}, ${eventDateLabel(bar.event)}`}
							on:click={() => {
								selectedDay = week.dates[bar.first].day!;
								void syncUserAction();
							}}
						></button>
					{/each}
				</div>
			{/each}
			<p class="calendar-hint">
				Цветная полоса — событие и его продолжительность. Выберите день или полосу.
			</p>
		</section>
	{/if}
	{#each groups as group (group.key)}
		<section class="month-group">
			<h2>
				{new Intl.DateTimeFormat(
					'ru',
					view === 'month' ? { day: 'numeric', month: 'long' } : { month: 'long', year: 'numeric' }
				).format(localDate(view === 'month' ? selectedDay : `${group.key}-01`))}
			</h2>
			{#each group.events as event (`${event.schemaName}:${event.id}`)}
				<a class="event-card" href={event.url} data-event-key={`${event.schemaName}:${event.id}`}>
					<div class="date-tile">
						<strong>{localDate(event.start).getDate()}</strong><span
							>{new Intl.DateTimeFormat('ru', { weekday: 'short' }).format(
								localDate(event.start)
							)}</span
						>
					</div>
					<div class="event-copy">
						<span class="event-category" style={`--category: ${event.backgroundColor}`}
							>{ministries.find((item) => item.key === event.schemaName)?.label}</span
						>
						<h3>{event.title}</h3>
						<p>
							{eventDateLabel(event)}{event.region !== 'all'
								? ` · ${regions.find((item) => item.key === event.region)?.label ?? event.region}`
								: ''}
						</p>
					</div>
					<span class="event-arrow"><ArrowIcon kind="chevron" /></span>
				</a>
			{/each}
			{#if view === 'month' && !displayed.length}<p class="agenda-note">
					На этот день событий нет. Выберите дату с полосой или другой месяц.
				</p>{/if}
		</section>
	{:else}
		<div class="empty">
			<h2>Пока нет событий</h2>
			<p>Попробуйте другой регион или отдел.</p>
			<button
				on:click={() => {
					region = 'all';
					ministry = 'all';
					query = '';
					void syncUserAction();
				}}>Сбросить фильтры</button
			>
		</div>
	{/each}
	<p class="agenda-note">
		Выберите событие, чтобы узнать подробности. Вернувшись назад, вы продолжите с того же места.
	</p>
</div>

<style>
	.month-calendar {
		scroll-margin-top: 18px;
	}
	.month-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.month-controls .today-button {
		min-height: 32px;
		font-size: 12px;
		padding: 4px 12px;
		border: 1px solid #d9d2c4;
		border-radius: 20px;
	}
	.month-controls button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.calendar-week {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		grid-template-rows: 44px repeat(var(--lanes), 12px);
		row-gap: 4px;
		padding-bottom: 12px;
	}
	.event-span {
		min-width: 0;
		height: 10px;
		border: 0;
		padding: 0;
		border-radius: 0;
		margin-inline: 0;
	}
	.event-span.span-start {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		margin-left: 3px;
	}
	.event-span.span-end {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		margin-right: 3px;
	}
	.event-span:focus-visible {
		outline: 2px solid #302f29;
		outline-offset: 2px;
	}

	.view-switch {
		display: flex;
		padding: 4px;
		gap: 4px;
		background: #eae6dc;
		border-radius: 12px;
		margin-bottom: 16px;
	}
	.view-switch button {
		flex: 1;
		min-height: 44px;
		border: 0;
		border-radius: 9px;
		background: transparent;
		color: #665f52;
	}
	.view-switch button[aria-pressed='true'] {
		background: #fffdf8;
		color: #354f41;
		box-shadow: 0 1px 4px #302f2910;
		font-weight: 600;
	}
	.month-calendar {
		padding: 16px 10px;
		border: 1px solid #d8d1c3;
		border-radius: 18px;
		margin-top: 20px;
		background: #fffdf8;
	}
	.month-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 16px;
	}
	.month-controls h2 {
		font-size: 19px;
		margin: 0;
		text-transform: capitalize;
		text-align: center;
	}
	.month-controls button {
		border: 0;
		background: transparent;
		min-width: 44px;
		min-height: 44px;
		color: #354f41;
	}
	.month-grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 0;
	}
	.weekday {
		text-align: center;
		font-size: 11px;
		color: #746e61;
		padding-bottom: 8px;
	}
	.calendar-day {
		min-height: 44px;
		border: 1px solid transparent;
		border-radius: 10px;
		background: transparent;
		color: #302f29;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		font-size: 14px;
	}
	.calendar-day.today {
		border-color: #8c9a83;
	}
	.calendar-day.selected {
		background: #354f41;
		color: #fffdf8;
	}
	.calendar-hint {
		font-size: 11px;
		color: #746e61;
		text-align: center;
		margin: 16px 0 0;
	}
	.agenda {
		max-width: 880px;
		padding: 34px 24px 48px;
		margin: auto;
		color: #302f29;
	}
	.agenda-heading {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: center;
		margin-bottom: 26px;
	}
	.kicker {
		font-size: 11px;
		color: #746e61;
		letter-spacing: 0.07em;
		margin-bottom: 10px;
	}
	h1 {
		font-size: clamp(34px, 7vw, 48px);
		margin: 0;
	}
	.today-button {
		border: 1px solid #d9d2c4;
		border-radius: 24px;
		background: transparent;
		padding: 10px 16px;
		white-space: nowrap;
		color: #354f41;
	}
	.agenda-filters {
		padding: 18px;
		background: #eae6dc;
		border-radius: 18px;
	}
	.search-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 8px;
	}
	.search-heading label {
		font-size: 11px;
		font-weight: 600;
		color: #665f52;
	}
	.result-count {
		font-size: 11px;
		color: #58684e;
		background: #f8f6ee;
		padding: 3px 8px;
		border-radius: 20px;
		white-space: nowrap;
	}
	label span {
		display: block;
		font-size: 11px;
		font-weight: 600;
		margin-bottom: 6px;
		color: #665f52;
	}
	input[type='search'],
	select {
		display: block;
		width: 100%;
		min-height: 46px;
		border: 1px solid #d8d1c3;
		border-radius: 10px;
		background: #fffdf8;
		padding: 10px 12px;
		color: #302f29;
		font-size: 16px;
	}
	.filter-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 12px;
	}
	.filter-row label {
		min-width: 0;
	}
	select {
		text-overflow: ellipsis;
	}
	.month-group {
		margin-top: 24px;
		margin-bottom: 30px;
	}
	.month-group h2 {
		text-transform: capitalize;
		font-size: 22px;
		padding-bottom: 14px;
		border-bottom: 1px solid #d8d1c3;
	}
	.event-card {
		display: flex;
		align-items: flex-start;
		gap: 15px;
		padding: 20px 0;
		border-bottom: 1px solid #e2dccf;
		text-decoration: none;
		color: inherit;
	}
	.event-card:hover h3 {
		color: #48684e;
	}
	.date-tile {
		flex: 0 0 49px;
		text-align: center;
		background: #e9ecdf;
		border-radius: 12px;
		padding: 9px 4px;
		color: #354f41;
	}
	.date-tile strong {
		display: block;
		font-size: 26px;
		line-height: 1.1;
		font-weight: 500;
	}
	.date-tile span {
		font-size: 11px;
	}
	.event-copy {
		flex: 1;
		min-width: 0;
	}
	.event-category {
		color: var(--category);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-weight: 700;
	}
	h3 {
		font-size: 18px;
		margin: 6px 0 8px;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}
	.event-copy p {
		font-size: 12px;
		margin: 0;
		color: #746e61;
	}
	.event-arrow {
		color: #746e61;
		padding-top: 22px;
	}
	.agenda-note {
		font-size: 12px;
		color: #746e61;
		line-height: 1.7;
	}
	.empty {
		text-align: center;
		padding: 36px 12px;
	}
	.empty button {
		border: 0;
		padding: 12px 18px;
		background: #354f41;
		color: white;
		border-radius: 10px;
	}
	@media (max-width: 480px) {
		.agenda {
			padding: 24px 18px 32px;
		}
		.agenda-filters {
			padding: 14px;
		}
		.kicker {
			max-width: 190px;
			line-height: 1.6;
		}
	}
</style>
