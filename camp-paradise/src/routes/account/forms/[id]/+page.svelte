<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const parseUtc = (s: string): Date => new Date(s.replace(' ', 'T') + 'Z');

	const longDate = (s: string | null | undefined): string => {
		if (!s) return '—';
		return parseUtc(s).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
	};

	const dateRange = (start: string | null | undefined, end: string | null | undefined): string => {
		if (!start) return '';
		if (!end) return longDate(start);
		return `${longDate(start)} – ${longDate(end)}`;
	};

	const str = (v: unknown): string => (typeof v === 'string' && v.trim() ? v : '—');
	const yesNo = (v: unknown): string =>
		v === 'true' || v === true ? 'Yes' : v === 'false' || v === false ? 'No' : '—';

	const immunizationLabel: Record<string, string> = {
		none: 'No immunizations',
		'up-to-date': 'Up to date including tetanus',
		tetanus: 'Only tetanus'
	};

	$: form = data.form;
	$: a = (form.answers ?? {}) as Record<string, unknown>;
	$: isMinor = a.isMinor === 'true' || a.isMinor === true;
	$: hasAge = a.isMinor === 'true' || a.isMinor === 'false' || typeof a.isMinor === 'boolean';
</script>

<svelte:head>
	<title>{form.formName ?? 'Form'} — Camp Paradise</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 lg:py-14">
	<a href="/account" class="text-sm font-semibold text-primary-600 hover:text-primary">
		<i class="bi bi-arrow-left mr-1"></i>My account
	</a>

	<p class="eyebrow mt-6 text-primary-600">Signed form</p>
	<h1 class="mt-1 text-3xl lg:text-4xl">{form.formName ?? 'Form'}</h1>
	<p class="mt-2 text-sm text-ink-soft">
		{#if form.eventName}
			<strong class="text-ink">{form.eventName}</strong>
			{#if form.startOn}
				<span class="mx-1">·</span>{dateRange(form.startOn, form.endOn)}
			{/if}
			<br />
		{/if}
		Signed on {longDate(form.signedOn)}
	</p>

	<div class="mt-6 rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5 sm:p-8">
		<dl class="grid gap-x-6 gap-y-4 sm:grid-cols-3">
			<dt class="text-sm text-ink-soft">Age</dt>
			<dd class="font-medium sm:col-span-2">{hasAge ? (isMinor ? 'Under 18' : '18+') : '—'}</dd>

			{#if isMinor}
				<dt class="text-sm text-ink-soft">Medical problems</dt>
				<dd class="font-medium sm:col-span-2">
					{a.hasMedicalProblems === 'true' ? str(a.medicalProblems) : 'None'}
				</dd>

				<dt class="text-sm text-ink-soft">Immunizations</dt>
				<dd class="font-medium sm:col-span-2">
					{typeof a.immunizations === 'string' && immunizationLabel[a.immunizations]
						? immunizationLabel[a.immunizations]
						: str(a.immunizations)}
				</dd>

				<dt class="text-sm text-ink-soft">Allergies</dt>
				<dd class="font-medium sm:col-span-2">
					{a.hasAllergies === 'true' ? str(a.allergies) : 'None'}
				</dd>

				<dt class="text-sm text-ink-soft">Medicine bringing to camp</dt>
				<dd class="font-medium sm:col-span-2">
					{#if a.hasMedicines === 'true'}
						<div><span class="text-ink-soft">Dose:</span> {str(a.medicineDose)}</div>
						<div><span class="text-ink-soft">How often:</span> {str(a.medicineFrequency)}</div>
						<div>
							<span class="text-ink-soft">Able to take on his/her own:</span>
							{yesNo(a.medicineAbility)}
						</div>
					{:else}
						None
					{/if}
				</dd>

				<dt class="text-sm text-ink-soft">Minor's full name</dt>
				<dd class="font-medium sm:col-span-2">{str(a.minorFullName)}</dd>

				<dt class="text-sm text-ink-soft">Parent/Guardian full name</dt>
				<dd class="font-medium sm:col-span-2">{str(a.guardianFullName)}</dd>

				<dt class="text-sm text-ink-soft">Parent/Guardian phone</dt>
				<dd class="font-medium sm:col-span-2">{str(a.guardianPhone)}</dd>
			{/if}

			<dt class="text-sm text-ink-soft">Waiver signed</dt>
			<dd class="font-medium sm:col-span-2">
				{#if hasAge}
					{isMinor
						? 'Waiver and Release Form (Minor 0-17 years)'
						: 'Consent and Release Form (Adult 18 years +)'}
				{:else}
					{form.formName ?? 'Form'} agreement
				{/if}
			</dd>
		</dl>
	</div>

	<p class="mt-4 text-sm text-ink-soft">
		Health forms are signed once per camp. Register for a camp to sign a new one.
	</p>
</div>
