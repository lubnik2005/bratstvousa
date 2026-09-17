<script lang="ts">
	// Camp Paradise Health Form — ported from the legacy React console (FormPage.tsx).
	// Field names use the legacy answer keys so historical and new answers share one shape.
	export let formId: number;
	export let formName = 'Health Form';
	export let errors: Record<string, string> | undefined = undefined;

	let isMinor: 'true' | 'false' = 'true';
	let hasMedicalProblems = '';
	let hasAllergies = '';
	let hasMedicines = '';

	const name = (key: string) => `form_${formId}_${key}`;
	const err = (key: string) => errors?.[`form_${formId}_${key}`];
</script>

<div class="mb-4 pt-3 border-top">
	<h3 class="h6 mb-3">{formName}</h3>

	<!-- Age -->
	<fieldset class="mb-3">
		<legend class="fs-6 fw-semibold mb-1">Age</legend>
		<div class="form-check">
			<input
				class="form-check-input"
				type="radio"
				name={name('isMinor')}
				id={name('isMinor-true')}
				value="true"
				bind:group={isMinor}
				required
			/>
			<label class="form-check-label" for={name('isMinor-true')}>Under 18</label>
		</div>
		<div class="form-check">
			<input
				class="form-check-input"
				type="radio"
				name={name('isMinor')}
				id={name('isMinor-false')}
				value="false"
				bind:group={isMinor}
				required
			/>
			<label class="form-check-label" for={name('isMinor-false')}>18+</label>
		</div>
		{#if err('isMinor')}<div class="text-danger small">{err('isMinor')}</div>{/if}
	</fieldset>

	{#if isMinor === 'true'}
		<!-- Medical Problems -->
		<fieldset class="mb-3">
			<legend class="fs-6 fw-semibold mb-1">Medical Problems</legend>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name={name('hasMedicalProblems')}
					id={name('hasMedicalProblems-false')}
					value="false"
					bind:group={hasMedicalProblems}
					required
				/>
				<label class="form-check-label" for={name('hasMedicalProblems-false')}
					>No medical problems</label
				>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name={name('hasMedicalProblems')}
					id={name('hasMedicalProblems-true')}
					value="true"
					bind:group={hasMedicalProblems}
					required
				/>
				<label class="form-check-label" for={name('hasMedicalProblems-true')}
					>List of medical problems</label
				>
			</div>
			{#if err('hasMedicalProblems')}<div class="text-danger small">
					{err('hasMedicalProblems')}
				</div>{/if}
			{#if hasMedicalProblems === 'true'}
				<textarea
					class="form-control mt-2"
					name={name('medicalProblems')}
					rows="3"
					placeholder="List of medical problems"
					required
				></textarea>
				{#if err('medicalProblems')}<div class="text-danger small">
						{err('medicalProblems')}
					</div>{/if}
			{/if}
		</fieldset>

		<!-- Immunizations -->
		<fieldset class="mb-3">
			<legend class="fs-6 fw-semibold mb-1">Immunizations</legend>
			{#each [['none', 'No immunizations'], ['up-to-date', 'Up to date including tetanus'], ['tetanus', 'Only tetanus']] as [val, label] (val)}
				<div class="form-check">
					<input
						class="form-check-input"
						type="radio"
						name={name('immunizations')}
						id={name(`immunizations-${val}`)}
						value={val}
						required
					/>
					<label class="form-check-label" for={name(`immunizations-${val}`)}>{label}</label>
				</div>
			{/each}
			{#if err('immunizations')}<div class="text-danger small">{err('immunizations')}</div>{/if}
		</fieldset>

		<!-- Allergies -->
		<fieldset class="mb-3">
			<legend class="fs-6 fw-semibold mb-1">Allergies</legend>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name={name('hasAllergies')}
					id={name('hasAllergies-false')}
					value="false"
					bind:group={hasAllergies}
					required
				/>
				<label class="form-check-label" for={name('hasAllergies-false')}>No Allergies</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name={name('hasAllergies')}
					id={name('hasAllergies-true')}
					value="true"
					bind:group={hasAllergies}
					required
				/>
				<label class="form-check-label" for={name('hasAllergies-true')}
					>List of allergies and reaction</label
				>
			</div>
			{#if err('hasAllergies')}<div class="text-danger small">{err('hasAllergies')}</div>{/if}
			{#if hasAllergies === 'true'}
				<textarea
					class="form-control mt-2"
					name={name('allergies')}
					rows="3"
					placeholder="List of allergies and reaction"
					required
				></textarea>
				{#if err('allergies')}<div class="text-danger small">{err('allergies')}</div>{/if}
			{/if}
		</fieldset>

		<!-- Medicine -->
		<fieldset class="mb-3">
			<legend class="fs-6 fw-semibold mb-0">Medicine</legend>
			<p class="text-muted small mb-1">Medicine bringing to camp</p>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name={name('hasMedicines')}
					id={name('hasMedicines-false')}
					value="false"
					bind:group={hasMedicines}
					required
				/>
				<label class="form-check-label" for={name('hasMedicines-false')}>No Medicines</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name={name('hasMedicines')}
					id={name('hasMedicines-true')}
					value="true"
					bind:group={hasMedicines}
					required
				/>
				<label class="form-check-label" for={name('hasMedicines-true')}
					>Medicines (must be in original labeled bottle)</label
				>
			</div>
			{#if err('hasMedicines')}<div class="text-danger small">{err('hasMedicines')}</div>{/if}
			{#if hasMedicines === 'true'}
				<div class="row g-2 mt-2">
					<div class="col-sm-6">
						<label class="form-label small mb-1" for={name('medicineDose')}>Dose</label>
						<input
							class="form-control"
							type="text"
							name={name('medicineDose')}
							id={name('medicineDose')}
							required
						/>
						{#if err('medicineDose')}<div class="text-danger small">{err('medicineDose')}</div>{/if}
					</div>
					<div class="col-sm-6">
						<label class="form-label small mb-1" for={name('medicineFrequency')}>How often</label>
						<input
							class="form-control"
							type="text"
							name={name('medicineFrequency')}
							id={name('medicineFrequency')}
							required
						/>
						{#if err('medicineFrequency')}<div class="text-danger small">
								{err('medicineFrequency')}
							</div>{/if}
					</div>
				</div>
				<div class="mt-2">
					<div class="small fw-semibold mb-1">Able to take on his/her own</div>
					<div class="form-check form-check-inline">
						<input
							class="form-check-input"
							type="radio"
							name={name('medicineAbility')}
							id={name('medicineAbility-true')}
							value="true"
							required
						/>
						<label class="form-check-label" for={name('medicineAbility-true')}>Yes</label>
					</div>
					<div class="form-check form-check-inline">
						<input
							class="form-check-input"
							type="radio"
							name={name('medicineAbility')}
							id={name('medicineAbility-false')}
							value="false"
							required
						/>
						<label class="form-check-label" for={name('medicineAbility-false')}>No</label>
					</div>
					{#if err('medicineAbility')}<div class="text-danger small">
							{err('medicineAbility')}
						</div>{/if}
				</div>
			{/if}
		</fieldset>
	{/if}

	<!-- Waiver / consent -->
	<div class="cp-rules mb-3">
		{#if isMinor === 'true'}
			<h4 class="h6 mb-2">Waiver and Release Form (Minor 0-17 years)</h4>
			<p class="small fw-semibold mb-1">Liability Release</p>
			<p class="small mb-2">
				I confirm that I am legally responsible or can legally consent for this minor. As such, I
				hereby release the Baptist Christian Camp of California and its officials, agents,
				volunteers, contractors and employees from liability for any claims (by me or any third
				party) of personal injury or property damages in connection with the minor's participation.
			</p>
			<p class="small fw-semibold mb-1">Consent for Treatment</p>
			<p class="small mb-2">
				I confirm that I am legally responsible or can legally consent for this minor. As such, I
				hereby give my consent for this minor to be treated by medical personnel in case of sudden
				illness or injury while participating in any event, activity, or program facilitated by or
				associated with Baptist Christian Camp of California. I understand that the Baptist
				Christian Camp of California will not provide any medical insurance for such treatment and
				that the cost thereof will be at my expense. I also understand that the minor freely chooses
				to self-administer any and all medication (apart from emergency medicine). I discharge in
				advance Baptist Christian Camp of California and its medical personnel, officials, agents,
				volunteers, contractors and employees from all liability that this minor may incur from
				either self-administered medical treatment or treatment provided to him/her.
			</p>
			<p class="small fw-semibold mb-1">Photo Release</p>
			<p class="small mb-0">
				I hereby authorize the Baptist Christian Camp of California to publish the photographs taken
				of this minor and this minor's name for use on the Baptist Christian Camp of California
				website or other associated media and/or display photographs of this minor within the
				facility. I release the Baptist Christian Camp of California from any expectation of this
				minor's confidentiality. I acknowledge that since participation in any event, program, or
				activity hosted by or associated with Baptist Christian Camp of California is voluntary,
				neither I nor this minor will receive any financial compensation for the use of this minor's
				name or photographs of this minor in publications and websites produced by the Baptist
				Christian Camp of California. I further agree that participation in any publication and
				website produced by the Baptist Christian Camp of California confers no rights of ownership
				whatsoever.
			</p>
		{:else}
			<h4 class="h6 mb-2">Consent and Release Form (Adult 18 years +)</h4>
			<p class="small fw-semibold mb-1">Liability Release</p>
			<p class="small mb-2">
				I confirm that I am or will be 18 years of age or older on or before the first day of the
				camp, event, activity, or program hosted by Baptist Christian Camp of California. I am
				truthfully and accurately reporting my age for the purposes of this waiver. If I falsify my
				age in any way, my legal guardian takes full and complete legal responsibility for any legal
				proceedings that may arise from any of my participation with Baptist Christian Camp of
				California. As such, I hereby release the Baptist Christian Camp of California and its
				officials, agents, volunteers, contractors and employees from liability for any claims (by
				me or any third party) of personal injury or property damages in connection with my
				participation.
			</p>
			<p class="small fw-semibold mb-1">Consent for Treatment</p>
			<p class="small mb-2">
				I hereby give my consent to be treated by medical personnel in case of sudden illness or
				injury while participating in any event, activity, or program facilitated by or associated
				with Baptist Christian Camp of California. I understand that the Baptist Christian Camp of
				California will not provide any medical insurance for such treatment and that the cost
				thereof will be at my expense. I also understand that I freely choose to self-administer any
				and all medication (apart from emergency medicine). I discharge in advance Baptist Christian
				Camp of California and its medical personnel, officials, agents, volunteers, contractors and
				employees from all liability that I may incur from either self-administered medical
				treatment or treatment provided to me.
			</p>
			<p class="small fw-semibold mb-1">Photo Release</p>
			<p class="small mb-0">
				I hereby authorize the Baptist Christian Camp of California to publish the photographs taken
				of me and my name for use on the Baptist Christian Camp of California website or other
				associated media and/or display photographs of me within the facility. I release the Baptist
				Christian Camp of California from any expectation of my confidentiality. I acknowledge that
				since my participation in any event, program, or activity hosted by or associated with
				Baptist Christian Camp of California is voluntary, I will not receive any financial
				compensation for the use of my name or photographs of me in publications and websites
				produced by the Baptist Christian Camp of California. I further agree that participation in
				any publication and website produced by the Baptist Christian Camp of California confers no
				rights of ownership whatsoever.
			</p>
		{/if}
	</div>

	<p class="small mb-2">
		I have read and understood the foregoing liability release, consent for treatment, and photo
		release and agree to all the terms and conditions.
	</p>

	{#if isMinor === 'true'}
		<div class="row g-2 mb-3">
			<div class="col-12">
				<label class="form-label small mb-1" for={name('minorFullName')}>Minor's Full Name</label>
				<input
					class="form-control"
					type="text"
					name={name('minorFullName')}
					id={name('minorFullName')}
					required
				/>
				{#if err('minorFullName')}<div class="text-danger small">{err('minorFullName')}</div>{/if}
			</div>
			<div class="col-sm-6">
				<label class="form-label small mb-1" for={name('guardianFullName')}
					>Parent/Guardian Full Name</label
				>
				<input
					class="form-control"
					type="text"
					name={name('guardianFullName')}
					id={name('guardianFullName')}
					required
				/>
				{#if err('guardianFullName')}<div class="text-danger small">
						{err('guardianFullName')}
					</div>{/if}
			</div>
			<div class="col-sm-6">
				<label class="form-label small mb-1" for={name('guardianPhone')}
					>Parent/Guardian Phone</label
				>
				<input
					class="form-control"
					type="tel"
					name={name('guardianPhone')}
					id={name('guardianPhone')}
					required
				/>
				{#if err('guardianPhone')}<div class="text-danger small">{err('guardianPhone')}</div>{/if}
			</div>
		</div>
	{/if}

	<div class="form-check">
		<input
			class="form-check-input"
			type="checkbox"
			name={`form_${formId}`}
			id={`form-${formId}`}
			required
		/>
		<label class="form-check-label" for={`form-${formId}`}
			>I have read and agree to the {formName}.</label
		>
		{#if errors?.[`form_${formId}`]}<div class="text-danger small">
				{errors[`form_${formId}`]}
			</div>{/if}
	</div>
</div>
