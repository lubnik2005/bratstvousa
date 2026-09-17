<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const badge: Record<string, string> = {
		held: 'bg-amber-100 text-amber-800',
		confirmed: 'bg-mint/60 text-primary-600',
		cancelled: 'bg-ink/10 text-ink-soft',
		refunded: 'bg-ink/10 text-ink-soft'
	};

	const btn =
		'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0';
	const card = 'rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5';
	const link = 'text-sm font-semibold text-primary-600 hover:text-primary';

	function longDate(s: string | null): string {
		if (!s) return '';
		const d = new Date(s.replace(' ', 'T') + 'Z');
		if (isNaN(d.getTime())) return '';
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	function dateRange(start: string | null, end: string | null): string {
		const a = longDate(start);
		const b = longDate(end);
		if (a && b) return `${a} – ${b}`;
		return a || b || '';
	}

	function dollars(cents: number): string {
		return `$${(cents / 100).toFixed(2)}`;
	}

	$: openCamps = data.open ?? [];
	$: healthForms = data.forms ?? [];

	function ageLabel(answers: unknown): string {
		const a = answers as { isMinor?: unknown } | null;
		if (a?.isMinor === 'true' || a?.isMinor === true) return 'Minor';
		if (a?.isMinor === 'false' || a?.isMinor === false) return 'Adult';
		return '—';
	}
</script>

<svelte:head>
	<title>My reservations · Camp Paradise</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 lg:py-14">
	<div class="mb-8 flex flex-wrap items-center justify-between gap-3">
		<div>
			<p class="eyebrow text-primary-600">My account</p>
			<h1 class="text-3xl lg:text-4xl">Hi, {data.camper.firstName}</h1>
			<p class="mt-1 text-sm text-ink-soft">{data.camper.email}</p>
		</div>
		<form method="post" action="?/signout">
			<button
				type="submit"
				class="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink/5"
			>
				Sign out
			</button>
		</form>
	</div>

	{#if openCamps.length > 0}
		<h2 class="mb-3 text-xl">Open camps</h2>
		<div class="mb-10 grid gap-4 sm:grid-cols-2">
			{#each openCamps as c (c.id)}
				<div class="{card} flex h-full flex-col">
					<h3 class="text-lg">{c.name}</h3>
					<p class="mb-2 text-sm text-ink-soft">{dateRange(c.startOn, c.endOn)}</p>
					{#if c.available > 0}
						<span
							class="mb-4 self-start rounded-full bg-mint/60 px-3 py-1 text-xs font-semibold text-primary-600"
						>
							{c.available} of {c.total} beds open
						</span>
					{:else}
						<span
							class="mb-4 self-start rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink-soft"
						>
							Full
						</span>
					{/if}
					<a
						href={`/${c.id}`}
						class="{btn} mt-auto self-start"
						class:pointer-events-none={c.available === 0}
						class:opacity-50={c.available === 0}
					>
						{c.available > 0 ? 'Register' : 'Sold out'}
					</a>
				</div>
			{/each}
		</div>
	{/if}

	<h2 class="mb-3 text-xl">My reservations</h2>

	{#if data.reservations.length === 0}
		<div class="{card} text-center">
			<i class="bi bi-calendar-heart text-4xl text-primary"></i>
			<p class="mt-3 mb-5 text-ink-soft">You don't have any reservations yet.</p>
			<a href="/camps" class={btn}>Browse camps</a>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			{#each data.reservations as r (r.id)}
				<div class={card}>
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div>
							<h3 class="text-lg">{r.eventName ?? 'Camp'}</h3>
							<p class="text-sm text-ink-soft">{dateRange(r.startOn, r.endOn)}</p>
							{#if r.roomName}
								<p class="mt-1 text-sm"><i class="bi bi-house-door mr-1"></i>{r.roomName}</p>
							{/if}
						</div>
						<div class="text-right">
							<span
								class="inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize {badge[
									r.status
								] ?? 'bg-ink/10 text-ink-soft'}"
							>
								{r.status}
							</span>
							<div class="mt-2 font-semibold">{dollars(r.price)}</div>
						</div>
					</div>
					{#if r.confirmationCode}
						<div class="mt-4 border-t border-ink/10 pt-4">
							<a href={`/reservation/${r.confirmationCode}`} class={link}>
								View reservation <i class="bi bi-arrow-right"></i>
							</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<h2 class="mt-12 mb-3 text-xl">Health forms</h2>

	{#if healthForms.length === 0}
		<div class="{card} text-center text-sm text-ink-soft">
			No forms signed yet. You'll sign the Health Form when you register for a camp.
		</div>
	{:else}
		<div class="overflow-hidden rounded-3xl bg-white shadow-xl shadow-ink/5 ring-1 ring-ink/5">
			<table class="w-full text-left text-sm">
				<thead class="bg-sand-warm text-xs tracking-wide text-ink-soft uppercase">
					<tr>
						<th class="px-4 py-3">Form</th>
						<th class="px-4 py-3">Camp</th>
						<th class="px-4 py-3">Age</th>
						<th class="px-4 py-3">Signed on</th>
						<th class="px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-ink/10">
					{#each healthForms as f (f.id)}
						<tr class="hover:bg-sand/60">
							<td class="px-4 py-3 font-semibold">{f.formName ?? 'Form'}</td>
							<td class="px-4 py-3">
								{f.eventName ?? 'Camp'}
								<div class="text-xs text-ink-soft">{dateRange(f.startOn, f.endOn)}</div>
							</td>
							<td class="px-4 py-3">{ageLabel(f.answers)}</td>
							<td class="px-4 py-3">{longDate(f.signedOn) || '—'}</td>
							<td class="px-4 py-3 text-right">
								<a href={`/account/forms/${f.id}`} class={link}>
									View <i class="bi bi-arrow-right"></i>
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<div class="mt-8">
		<a href="/camps" class={link}><i class="bi bi-arrow-left mr-1"></i>Back to camps</a>
	</div>
</div>
