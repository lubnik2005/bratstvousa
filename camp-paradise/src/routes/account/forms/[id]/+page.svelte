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

<div class="container py-5" style="max-width: 760px;">
	<a href="/account" class="text-decoration-none small text-success fw-semibold">
		<i class="bi bi-arrow-left me-1"></i>My account
	</a>

	<h1 class="h3 mt-3 mb-1">{form.formName ?? 'Form'}</h1>
	<p class="text-muted mb-4">
		{#if form.eventName}
			<strong>{form.eventName}</strong>
			{#if form.startOn}
				<span class="mx-1">·</span>{dateRange(form.startOn, form.endOn)}
			{/if}
			<br />
		{/if}
		Signed on {longDate(form.signedOn)}
	</p>

	<div class="cp-card p-4">
		<dl class="row mb-0">
			<dt class="col-sm-4">Age</dt>
			<dd class="col-sm-8">{hasAge ? (isMinor ? 'Under 18' : '18+') : '—'}</dd>

			{#if isMinor}
				<dt class="col-sm-4">Medical problems</dt>
				<dd class="col-sm-8">
					{a.hasMedicalProblems === 'true' ? str(a.medicalProblems) : 'None'}
				</dd>

				<dt class="col-sm-4">Immunizations</dt>
				<dd class="col-sm-8">
					{typeof a.immunizations === 'string' && immunizationLabel[a.immunizations]
						? immunizationLabel[a.immunizations]
						: str(a.immunizations)}
				</dd>

				<dt class="col-sm-4">Allergies</dt>
				<dd class="col-sm-8">{a.hasAllergies === 'true' ? str(a.allergies) : 'None'}</dd>

				<dt class="col-sm-4">Medicine bringing to camp</dt>
				<dd class="col-sm-8">
					{#if a.hasMedicines === 'true'}
						<div><span class="text-muted">Dose:</span> {str(a.medicineDose)}</div>
						<div><span class="text-muted">How often:</span> {str(a.medicineFrequency)}</div>
						<div>
							<span class="text-muted">Able to take on his/her own:</span>
							{yesNo(a.medicineAbility)}
						</div>
					{:else}
						None
					{/if}
				</dd>

				<dt class="col-sm-4">Minor's full name</dt>
				<dd class="col-sm-8">{str(a.minorFullName)}</dd>

				<dt class="col-sm-4">Parent/Guardian full name</dt>
				<dd class="col-sm-8">{str(a.guardianFullName)}</dd>

				<dt class="col-sm-4">Parent/Guardian phone</dt>
				<dd class="col-sm-8">{str(a.guardianPhone)}</dd>
			{/if}

			<dt class="col-sm-4">Waiver signed</dt>
			<dd class="col-sm-8 mb-0">
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

	<p class="text-muted small mt-3 mb-0">
		Health forms are signed once per camp. Register for a camp to sign a new one.
	</p>
</div>
