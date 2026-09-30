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
		const d = new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');
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

	$: activeReservations = data.reservations.filter(
		(r) => r.status === 'confirmed' || r.status === 'held'
	);
	$: pastReservations = data.reservations.filter(
		(r) => r.status !== 'confirmed' && r.status !== 'held'
	);
	$: healthForms = data.forms ?? [];
	$: ledger = data.ledger ?? [];
	const kindLabel: Record<string, string> = {
		topup: 'Top-up',
		debit: 'Bed reserved',
		refund: 'Refund',
		reversal: 'Zeffy reversal',
		adjustment: 'Adjustment'
	};

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

	<h2 class="mb-3 text-xl">Wallet</h2>
	<div class="mb-10 rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<p class="text-sm text-ink-soft">Current balance</p>
				<p class="font-display text-3xl text-primary-600">{dollars(data.balanceCents)}</p>
			</div>
			<p class="max-w-xs text-xs text-ink-soft">
				Add funds on Zeffy using <strong>{data.camper.email}</strong> — your balance updates
				automatically once the payment goes through. The Zeffy contribution at checkout is optional
				— choose
				<strong>"Other"</strong> and enter <strong>$0</strong> to avoid extra charges.
			</p>
		</div>
		{#if ledger.length === 0}
			<p class="mt-4 text-sm text-ink-soft">No transactions yet.</p>
		{:else}
			<table class="mt-4 w-full text-sm">
				<tbody class="divide-y divide-ink/10">
					{#each ledger as row (row.id)}
						<tr>
							<td class="py-2 pr-3">
								<div class="font-medium">{kindLabel[row.kind] ?? row.kind}</div>
								{#if row.note}<div class="text-xs text-ink-soft">{row.note}</div>{/if}
							</td>
							<td class="py-2 pr-3 text-xs text-ink-soft">{longDate(row.createdAt)}</td>
							<td
								class="py-2 text-right font-semibold {row.amountCents < 0
									? 'text-ink-soft'
									: 'text-primary-600'}"
							>
								{row.amountCents < 0 ? '−' : '+'}{dollars(Math.abs(row.amountCents))}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<h2 class="mb-3 text-xl">My reservations</h2>

	{#if activeReservations.length === 0}
		<div class="{card} text-center">
			<i class="bi bi-calendar-heart text-4xl text-primary"></i>
			<p class="mt-3 mb-5 text-ink-soft">You don't have any active reservations.</p>
			<a href="/camps" class={btn}>Browse camps</a>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			{#each activeReservations as r (r.id)}
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
							<p class="mt-1 text-xs text-ink-soft">
								Reserved {longDate(
									r.createdAt
								)}{#if r.status === 'cancelled' || r.status === 'refunded'}
									· Cancelled {longDate(r.updatedAt ?? r.createdAt)}{/if}
							</p>
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

	{#if pastReservations.length > 0}
		<details class="mt-4 rounded-2xl bg-sand-warm/60 px-4 py-3 text-sm">
			<summary class="cursor-pointer font-semibold text-ink-soft">
				Cancelled reservations ({pastReservations.length})
			</summary>
			<div class="mt-4 flex flex-col gap-4">
				{#each pastReservations as r (r.id)}
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
								<p class="mt-1 text-xs text-ink-soft">
									Reserved {longDate(
										r.createdAt
									)}{#if r.status === 'cancelled' || r.status === 'refunded'}
										· Cancelled {longDate(r.updatedAt ?? r.createdAt)}{/if}
								</p>
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
		</details>
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
