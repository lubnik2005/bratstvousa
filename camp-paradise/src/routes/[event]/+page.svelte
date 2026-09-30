<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import HealthForm from '$lib/components/HealthForm.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let submitting = false;

	// Sign-in sub-step: 'email' -> 'code' -> ('profile' for new campers).

	const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

	$: identity = data.identity;
	$: existing = data.existing;
	$: selectedRoom = data.rooms.find((r) => r.id === data.roomId) ?? null;

	type FormQuestion = {
		key: string;
		label: string;
		type?: 'text' | 'textarea' | 'select' | 'checkbox' | 'date';
		options?: string[];
		required?: boolean;
	};

	// A form's `questions` JSON may be an object with read-only rules { body: string[] }
	// and/or an array of interactive questions. Normalize both shapes.
	function parseForm(q: unknown): { body: string[]; questions: FormQuestion[] } {
		let body: string[] = [];
		let questions: FormQuestion[] = [];
		if (Array.isArray(q)) {
			questions = q as FormQuestion[];
		} else if (q && typeof q === 'object') {
			const obj = q as { body?: unknown; questions?: unknown };
			if (Array.isArray(obj.body))
				body = obj.body.filter((x): x is string => typeof x === 'string');
			if (Array.isArray(obj.questions)) questions = obj.questions as FormQuestion[];
		}
		return { body, questions };
	}

	// Bed confirmed -> go to the reservation page.
	$: if (form && 'confirmed' in form && form.confirmed && form.code) {
		void goto(`/reservation/${form.code}`);
	}

	const btn =
		'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0';
	const card = 'rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5 sm:p-8';
	const chip = 'rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white';
	const chipMuted = 'rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink-soft';
	type RoomRow = (typeof data.rooms)[number];
	let roomFilter = 'all';
	let availableOnly = false;
	let roomSearch = '';
	const typeLabel = (t: string | null | undefined): string => {
		const v = (t ?? '').toLowerCase();
		if (v === 'rv') return 'RV';
		if (v === 'vip') return 'VIP';
		return v ? v.charAt(0).toUpperCase() + v.slice(1) : 'Room';
	};
	$: typeOptions = [
		'all',
		...Array.from(new Set(data.rooms.map((r) => (r.type ?? '').toLowerCase()).filter(Boolean)))
	];
	$: filteredRooms = data.rooms.filter((r) => {
		if (roomFilter !== 'all' && (r.type ?? '').toLowerCase() !== roomFilter) return false;
		if (availableOnly && r.available <= 0) return false;
		const q = roomSearch.trim().toLowerCase();
		if (q && !`${r.name} ${r.location ?? ''}`.toLowerCase().includes(q)) return false;
		return true;
	});
	$: roomGroups = (() => {
		const map = new Map<
			string,
			{ location: string; rooms: RoomRow[]; total: number; available: number }
		>();
		for (const r of filteredRooms) {
			const key = r.location ?? 'Other';
			const g = map.get(key) ?? { location: key, rooms: [], total: 0, available: 0 };
			g.rooms.push(r);
			g.total += r.total;
			g.available += r.available;
			map.set(key, g);
		}
		return Array.from(map.values());
	})();
	$: totalBeds = data.rooms.reduce((n, r) => n + r.total, 0);
	$: openBeds = data.rooms.reduce((n, r) => n + r.available, 0);
</script>

<svelte:head>
	<title>{data.event.name} — Register</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 lg:py-14">
	<a href="/camps" class="text-sm font-semibold text-primary-600 hover:text-primary">
		<i class="bi bi-arrow-left mr-1"></i>All camps
	</a>
	<p class="eyebrow mt-6 text-primary-600">Registration</p>
	<h1 class="mt-1 text-3xl lg:text-4xl">{data.event.name}</h1>

	{#if data.registrationState !== 'open'}
		<div class="mt-6 rounded-3xl bg-white p-8 text-center shadow-xl shadow-ink/5 ring-1 ring-ink/5">
			{#if data.registrationState === 'upcoming'}
				<i class="bi bi-hourglass-split text-4xl text-primary-600"></i>
				<h2 class="mt-3 text-2xl">Registration hasn't opened yet</h2>
				<p class="mt-2 text-ink-soft">
					This camp isn't open for registration just yet. Check back soon — we'll open sign-ups
					here.
				</p>
			{:else}
				<i class="bi bi-calendar-check text-4xl text-primary-600"></i>
				<h2 class="mt-3 text-2xl">Registration is closed</h2>
				<p class="mt-2 text-ink-soft">
					Registration for this camp has ended. Browse our open camps to find your next session.
				</p>
			{/if}
			<a href="/camps" class="{btn} mt-5">Browse open camps</a>
		</div>
	{:else}
		<div class="mt-6 flex flex-wrap gap-2">
			<span class={data.roomId ? chipMuted : chip}>1 · Room</span>
			<span class={!data.roomId ? chipMuted : chip}>2 · Bed</span>
			<span class={chipMuted}>3 · Confirm</span>
		</div>

		{#if identity}
			<div
				class="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-mint/40 px-4 py-3 text-sm"
			>
				<span>
					<i class="bi bi-person-check mr-1 text-primary-600"></i>
					Registering <strong>{identity.firstName} {identity.lastName}</strong> · {identity.email}
					<span
						class="ml-2 rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-semibold text-primary-600"
						>Balance: {dollars(data.balanceCents)}</span
					>
				</span>
				{#if data.roomId}
					<a href="?" class="font-semibold text-primary-600 hover:text-primary">Start over</a>
				{/if}
			</div>
		{/if}

		{#if existing}
			<div class="mt-6 {card}">
				<p class="eyebrow text-primary-600">You're booked</p>
				<h2 class="mt-1 text-2xl">You already have a bed in this camp</h2>
				<p class="mt-2 text-sm text-ink-soft">
					{existing.roomName ?? 'Room'} · confirmation code
					<span class="font-display font-semibold text-ink">{existing.confirmationCode}</span>. This
					camp allows one reservation per camper.
				</p>
				<div class="mt-5 flex flex-wrap gap-3">
					<a href={`/reservation/${existing.confirmationCode}`} class={btn}>View reservation</a>
					<a
						href="/camps"
						class="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold hover:bg-ink/5"
						>All camps</a
					>
				</div>
			</div>
		{:else if !data.roomId}
			<div class="mt-6 {card}">
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<h2 class="text-xl">Choose a room</h2>
					<span class="text-sm text-ink-soft"
						>{openBeds} of {totalBeds} beds open · {data.rooms.length} rooms</span
					>
				</div>
				<p class="mt-1 text-sm text-ink-soft">Rooms are matched to who's registering.</p>

				<div class="mt-4 flex flex-wrap items-center gap-2">
					{#each typeOptions as t (t)}
						<button
							type="button"
							class={roomFilter === t ? chip : chipMuted}
							on:click={() => (roomFilter = t)}>{t === 'all' ? 'All' : typeLabel(t)}</button
						>
					{/each}
					<label class="ml-auto flex items-center gap-2 text-xs font-semibold text-ink-soft">
						<input type="checkbox" class="accent-primary" bind:checked={availableOnly} />
						Available only
					</label>
				</div>
				<input
					type="search"
					class="field mt-3"
					placeholder="Search rooms or buildings…"
					bind:value={roomSearch}
				/>

				<div class="mt-4 space-y-3">
					{#each roomGroups as group (group.location)}
						<details open class="rounded-2xl bg-sand-warm/60 px-4 py-3">
							<summary class="cursor-pointer text-sm font-semibold">
								{group.location}
								<span class="ml-2 font-normal text-ink-soft"
									>· {group.rooms.length} room{group.rooms.length === 1 ? '' : 's'} · {group.available}
									of {group.total} beds open</span
								>
							</summary>
							<div class="mt-2 divide-y divide-ink/10">
								{#each group.rooms as room (room.id)}
									<a
										href={`?room=${room.id}`}
										class="-mx-2 flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition {room.available >
										0
											? 'hover:bg-white'
											: 'pointer-events-none opacity-50'}"
									>
										<div>
											<div class="font-semibold">{room.name}</div>
											<div class="text-sm text-ink-soft capitalize">{typeLabel(room.type)}</div>
										</div>
										<div class="flex items-center gap-3 text-right">
											<span class="font-semibold">{dollars(room.price)}</span>
											{#if room.available > 0}
												<span
													class="rounded-full bg-mint/60 px-3 py-1 text-xs font-semibold text-primary-600"
													>{room.available} of {room.total} beds open</span
												>
											{:else}
												<span
													class="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink-soft"
													>Full</span
												>
											{/if}
										</div>
									</a>
								{/each}
							</div>
						</details>
					{:else}
						<p class="py-3 text-sm text-ink-soft">No rooms match your search.</p>
					{/each}
				</div>
			</div>
		{:else}
			<div class="mt-6 {card}">
				<div class="flex flex-wrap items-baseline justify-between gap-2">
					<h2 class="text-xl">Pick a bed &amp; agree to the forms</h2>
					<a href="?" class="text-sm font-semibold text-primary-600 hover:text-primary"
						>&larr; change room</a
					>
				</div>
				{#if form && 'expired' in form && form.expired}
					<div class="mt-3 rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-800">
						Your registration session expired. Please
						<a href="/?next=/{data.event.id}" data-sveltekit-reload class="font-semibold underline"
							>start again</a
						>.
					</div>
				{/if}
				<form
					method="post"
					action="?/hold"
					class="mt-4"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update({ reset: false });
							submitting = false;
						};
					}}
				>
					<input type="hidden" name="roomId" value={data.roomId} />
					<input
						type="text"
						name="middle_name"
						tabindex="-1"
						autocomplete="off"
						aria-hidden="true"
						style="position:absolute;left:-9999px"
					/>
					<fieldset>
						<legend class="mb-2 text-sm font-semibold">
							Bed
							{#if selectedRoom}
								<span class="font-normal text-ink-soft"
									>· {selectedRoom.name} · {data.beds.length} open</span
								>
							{/if}
						</legend>
						{#if data.beds.length === 0}
							<p class="text-sm text-ink-soft">No beds left in this room.</p>
						{:else}
							<div class="grid grid-cols-3 gap-2 sm:grid-cols-5">
								<label
									class="col-span-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-sand px-3 py-3 text-sm font-semibold has-[:checked]:border-primary has-[:checked]:bg-mint/40 sm:col-span-5"
								>
									<input
										class="sr-only"
										type="radio"
										name="cotId"
										value="any"
										checked={data.beds.length > 8}
										required
									/>
									<i class="bi bi-shuffle"></i> Any available bed
								</label>
								{#each data.beds as bed (bed.id)}
									<label
										class="flex cursor-pointer items-center justify-center rounded-2xl border border-ink/10 bg-sand px-2 py-3 text-center text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-mint/40"
										title={bed.description || `Bed ${bed.id}`}
									>
										<input class="sr-only" type="radio" name="cotId" value={bed.id} required />
										<span class="truncate">{bed.description || `Bed ${bed.id}`}</span>
									</label>
								{/each}
							</div>
						{/if}
						{#if form?.errors?.bed}
							<div class="mt-1 text-sm text-red-600">{form.errors.bed}</div>
						{/if}
					</fieldset>

					{#each data.forms as f (f.id)}
						{@const parsed = parseForm(f.questions)}
						{#if f.id === 2 || f.name === 'Health Form'}
							<HealthForm formId={f.id} formName={f.name} errors={form?.errors} />
						{:else}
							<div class="mt-6 border-t border-ink/10 pt-5">
								<h3 class="text-base font-semibold">{f.name}</h3>
								{#if parsed.body.length}
									<div class="rules-box mt-3 space-y-2 p-4">
										{#each parsed.body as para}
											<p>{para}</p>
										{/each}
									</div>
								{/if}
								{#each parsed.questions as q (q.key)}
									{@const fieldName = `form_${f.id}_${q.key}`}
									<div class="mt-3">
										{#if q.type === 'checkbox'}
											<label class="flex items-start gap-2 text-sm">
												<input
													class="accent-primary mt-1"
													type="checkbox"
													name={fieldName}
													id={fieldName}
													value="yes"
													required={q.required}
												/>
												<span>{q.label}</span>
											</label>
										{:else}
											<label class="mb-1 block text-sm font-medium" for={fieldName}>{q.label}</label
											>
											{#if q.type === 'textarea'}
												<textarea
													class="field"
													name={fieldName}
													id={fieldName}
													rows="3"
													required={q.required}
												></textarea>
											{:else if q.type === 'select'}
												<select class="field" name={fieldName} id={fieldName} required={q.required}>
													<option value="" disabled selected>Choose…</option>
													{#each q.options ?? [] as opt}
														<option value={opt}>{opt}</option>
													{/each}
												</select>
											{:else}
												<input
													class="field"
													type={q.type === 'date' ? 'date' : 'text'}
													name={fieldName}
													id={fieldName}
													required={q.required}
												/>
											{/if}
										{/if}
									</div>
								{/each}
								<label class="mt-4 flex items-start gap-2 text-sm">
									<input
										class="accent-primary mt-1"
										type="checkbox"
										name={`form_${f.id}`}
										id={`form-${f.id}`}
										required
									/>
									<span>I have read and agree to the {f.name}.</span>
								</label>
								{#if form?.errors?.[`form_${f.id}`]}
									<div class="mt-1 text-sm text-red-600">{form.errors[`form_${f.id}`]}</div>
								{/if}
							</div>
						{/if}
					{/each}

					{#if form && 'alreadyBooked' in form && form.alreadyBooked}
						<div class="mt-3 rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-800">
							You already have a bed in this camp (one per camper).
							<a href={`/reservation/${form.code}`} class="font-semibold underline">View it</a>.
						</div>
					{/if}
					{#if form && 'insufficient' in form && form.insufficient}
						<div class="mt-3 rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-800">
							Not enough funds — you need {dollars(form.needed)} more. Add funds on Zeffy and try again.
						</div>
					{/if}
					{#if form?.message}
						<div class="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
							{form.message}
						</div>
					{/if}
					{#if selectedRoom}
						{@const price = selectedRoom.price}
						{@const short = price - data.balanceCents}
						<div class="mt-4 rounded-2xl bg-sand px-4 py-3 text-sm">
							This bed costs <strong>{dollars(price)}</strong> · balance after:
							<strong>{dollars(data.balanceCents - price)}</strong>
						</div>
						{#if short > 0}
							<div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
								<p class="font-semibold text-amber-900">
									Not enough funds — add {dollars(short)} on Zeffy
								</p>
								<p class="mt-1 text-amber-800">
									Use the same email you signed in with (<strong>{identity?.email}</strong>). Funds
									appear here shortly after Zeffy confirms the payment.
								</p>
								<p class="mt-2 text-amber-800">
									<strong>Tip:</strong> the Zeffy contribution at checkout is optional — choose
									<strong>"Other"</strong> and enter <strong>$0</strong> so you aren't charged extra.
								</p>
								{#if data.topupUrl}
									<a href={data.topupUrl} target="_blank" rel="noopener" class="{btn} mt-3">
										<i class="bi bi-wallet2"></i>Add funds on Zeffy
									</a>
								{:else}
									<p class="mt-3 text-amber-800">Top-ups aren't set up yet.</p>
								{/if}
								<button
									class="mt-3 ml-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-ink/5"
									type="submit"
									formaction="?/checkBalance"
									formnovalidate>I already paid — check again</button
								>
								{#if form && 'checked' in form && form.checked}
									<p class="mt-3 text-ink-soft">Balance: {dollars(form.balanceCents)}</p>
								{/if}
							</div>
						{/if}
						<button class="{btn} mt-5 w-full" type="submit" disabled={submitting || short > 0}>
							{submitting ? 'Confirming…' : 'Confirm my bed'}
						</button>
						<p class="mt-3 text-center text-xs text-ink-soft">
							Your bed is confirmed instantly and {dollars(price)} is deducted from your balance.
						</p>
					{/if}
				</form>
			</div>
		{/if}
	{/if}
</div>
