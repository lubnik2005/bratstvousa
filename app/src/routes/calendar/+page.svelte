<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import listPlugin from '@fullcalendar/list';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import ruLocale from '@fullcalendar/core/locales/ru';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Define available regions and ministries
	const regions = [
		{ key: 'all', label: 'Все Регионы' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	];

	const ministries = [
		{ key: 'all', label: 'Все Отделы' },
		{ key: 'bibleEducationEvents', label: 'Отдел библейского образования' },
		{ key: 'familyEvents', label: 'Семейный отдел' },
		{ key: 'childrensEvents', label: 'Детский отдел' },
		{ key: 'gospelEvents', label: 'Отдел Благовестия' },
		{ key: 'musicEvents', label: 'Музыкально хоровой отдел' },
		{ key: 'youthEvents', label: 'Молодежный отдел' }
	];

	const headerToolbar = {
		left: 'prev,today,next',
		center: 'title',
		right: 'listYear,dayGridMonth'
	};

	const headerToolbarMobile = {
		left: '',
		center: 'title',
		right: 'prev,next,listYear,dayGridMonth'
	};

	let calendarIsLoading = true;
	let selectedRegion = 'all';
	let selectedMinistry = 'all';
	let calendar: Calendar;

	function getFilteredEvents() {
		return data.events
			.filter(
				(e) =>
					(selectedRegion === 'all' || e.region === selectedRegion) &&
					(selectedMinistry === 'all' || e.schemaName === selectedMinistry)
			)
			.map((e) => ({
				id: String(e.id),
				title: e.title,
				start: e.start ?? undefined,
				end: e.end ?? undefined,
				url: e.url,
				backgroundColor: e.backgroundColor,
				borderColor: e.borderColor
			}));
	}

	function updateURLParams(dateStr?: string, viewType?: string) {
		const params = new URLSearchParams(window.location.search);
		params.set('region', selectedRegion);
		params.set('ministry', selectedMinistry);
		if (dateStr) {
			params.set('date', dateStr);
		}
		// Persist the active view (list vs month) so returning from an event
		// (browser "back") restores the exact view the user was on.
		const view = viewType ?? calendar?.view?.type;
		if (view) {
			params.set('view', view);
		}

		goto(`${window.location.pathname}?${params.toString()}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	// Scroll the list view so today's row sits at the top. If today is not in
	// the rendered range (e.g. a different year), leave the scroller at the top.
	function scrollListToToday() {
		requestAnimationFrame(() => {
			const scroller = document.querySelector<HTMLElement>('#calendar .fc-scroller');
			const todayRow = document.querySelector<HTMLElement>('#calendar .fc-list-day.fc-day-today');
			if (!scroller) return;
			if (todayRow) {
				scroller.scrollTop = todayRow.offsetTop;
			} else {
				scroller.scrollTop = 0;
			}
		});
	}

	// One-shot key: when the user clicks an event from the list view we remember
	// the exact scroll position (plus the view + date it belongs to) so that,
	// after pressing browser Back, we can restore the precise pixel offset
	// instead of snapping to today.
	const LIST_SCROLL_KEY = 'calendar:listScroll';

	function saveListScroll(viewType: string) {
		if (!viewType.startsWith('list')) return;
		const scroller = document.querySelector<HTMLElement>('#calendar .fc-scroller');
		if (!scroller) return;
		const params = new URLSearchParams(window.location.search);
		try {
			sessionStorage.setItem(
				LIST_SCROLL_KEY,
				JSON.stringify({
					scrollTop: scroller.scrollTop,
					view: viewType,
					date: params.get('date') ?? ''
				})
			);
		} catch {
			// sessionStorage unavailable (private mode etc.) — non-fatal.
		}
	}

	// If a saved scroll entry matches the view+date we are restoring, apply the
	// exact pixel offset and consume it (one-shot). Returns true if applied.
	function restoreListScroll(viewType: string, dateStr: string): boolean {
		let raw: string | null = null;
		try {
			raw = sessionStorage.getItem(LIST_SCROLL_KEY);
			if (raw) sessionStorage.removeItem(LIST_SCROLL_KEY);
		} catch {
			return false;
		}
		if (!raw) return false;
		try {
			const saved = JSON.parse(raw) as { scrollTop: number; view: string; date: string };
			if (saved.view !== viewType || saved.date !== dateStr) return false;
			requestAnimationFrame(() => {
				const scroller = document.querySelector<HTMLElement>('#calendar .fc-scroller');
				if (scroller) scroller.scrollTop = saved.scrollTop;
			});
			return true;
		} catch {
			return false;
		}
	}

	function filterEvents() {
		// Use setOption to update events efficiently (no DOM churn)
		calendar.setOption('events', getFilteredEvents());
		updateURLParams();
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		// If URL contains filter values, use them
		if (params.has('region')) {
			selectedRegion = params.get('region') || 'all';
		}
		if (params.has('ministry')) {
			selectedMinistry = params.get('ministry') || 'all';
		}

		const isMobile = window.matchMedia('(max-width: 754px)').matches;
		const calendarEl = document.getElementById('calendar')!;

		// Restore the saved view from the URL (set when the user last interacted),
		// falling back to the mobile/desktop default.
		const savedView = params.get('view');
		const defaultView = isMobile ? 'listYear' : 'dayGridMonth';

		// Track the previous view so we can detect entering the list view.
		let prevViewType = savedView ?? defaultView;

		calendar = new Calendar(calendarEl, {
			plugins: [listPlugin, dayGridPlugin, timeGridPlugin],
			initialView: savedView ?? defaultView,
			initialDate: params.get('date') ?? undefined,
			firstDay: 0,
			defaultAllDay: true,
			datesSet(info) {
				const dateStr = info.view.currentStart.toISOString().slice(0, 10);
				const viewType = info.view.type;
				updateURLParams(dateStr, viewType);
				// Auto-scroll to today when entering the list view (not on every
				// paging within it, so navigating years doesn't yank the user back).
				if (viewType.startsWith('list') && !prevViewType.startsWith('list')) {
					scrollListToToday();
				}
				prevViewType = viewType;
			},
			headerToolbar: isMobile ? headerToolbarMobile : headerToolbar,
			locales: [ruLocale],
			buttonText: {
				list: 'График'
			},
			events: getFilteredEvents(),
			loading(isLoading) {
				calendarIsLoading = isLoading;
			}
		});

		// Before navigating away to an event, remember the exact list scroll
		// position so browser Back can restore it. Capture phase runs before the
		// link triggers navigation. FullCalendar renders events as <a> links.
		const onCalendarClick = (e: MouseEvent) => {
			// FullCalendar list events render as <a href> inside tr.fc-list-event
			// (the class is on the row, not the anchor), and month events as
			// a.fc-event. Match any event anchor with an href, or the row itself.
			const link = (e.target as HTMLElement)?.closest(
				'.fc-list-event a[href], .fc-list-event, a.fc-event, a[href].fc-event'
			);
			if (link) {
				saveListScroll(calendar.view.type);
			}
		};
		calendarEl.addEventListener('click', onCalendarClick, true);

		calendar.render();

		// If the calendar loads directly into the list view (default on mobile or
		// restored from the URL), first try to restore the exact scroll position
		// saved when the user clicked an event (browser Back). Otherwise fall back
		// to scrolling to today.
		const initialView = savedView ?? defaultView;
		if (initialView.startsWith('list')) {
			const dateStr = params.get('date') ?? '';
			if (!restoreListScroll(initialView, dateStr)) {
				scrollListToToday();
			}
		}

		return () => {
			calendarEl.removeEventListener('click', onCalendarClick, true);
			calendar.destroy();
		};
	});
</script>

<svelte:head>
	<title>Календарь — Американское Объединение МСЦ ЕХБ</title>
</svelte:head>

<Header title="Календарь" />

<div class="container-xxl py-6">
	<div class="container">
		{#if !calendarIsLoading}
			<div class="d-flex mb-3 flex-wrap gap-2">
				<select
					bind:value={selectedRegion}
					on:change={() => filterEvents()}
					class="custom-select"
					id="filter-region"
					aria-label="Фильтр по региону"
				>
					{#each regions as region}
						<option value={region.key}>{region.label}</option>
					{/each}
				</select>

				<select
					bind:value={selectedMinistry}
					on:change={() => filterEvents()}
					class="custom-select"
					id="filter-ministry"
					aria-label="Фильтр по отделу"
				>
					{#each ministries as ministry}
						<option value={ministry.key}>{ministry.label}</option>
					{/each}
				</select>
			</div>
		{:else}
			<div class="placeholder-glow my-4" id="calendar-skeleton">
				<span class="placeholder" style="width: 100%; aspect-ratio: 16/10;"></span>
			</div>
		{/if}

		<div id="calendar" class="my-4" style="min-height: 700px;"></div>
	</div>
</div>

<!-- FullCalendar theming is centralised in src/scss/main.scss (.fc). -->
<style>
	.custom-select {
		min-width: 200px;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--bs-rule);
		border-radius: 0;
		background-color: var(--bs-paper);
		color: var(--bs-body-color);
		font-size: 0.95rem;
	}
	.custom-select:focus {
		outline: none;
		border-color: var(--bs-secondary);
	}
</style>
