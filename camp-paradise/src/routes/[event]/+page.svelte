<script lang="ts">
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let startTurnstile: Turnstile;
	let submitting = false;
	let starting = false;

	// Sign-in sub-step: 'email' -> 'code' -> ('profile' for new campers).
	// Driven by the action results returned in `form`.
	$: signInStep =
		form && 'needsProfile' in form && form.needsProfile
			? 'profile'
			: form && 'codeSent' in form && form.codeSent
				? 'code'
				: 'email';
	// The email is echoed back by requestCode/verifyCode so later steps can post it.
	$: pendingEmail = form && 'email' in form ? ((form.email as string | undefined) ?? '') : '';

	// Payment state (after a successful hold).
	let paying = false;
	let payError = '';
	let secondsLeft = 300;
	let timer: ReturnType<typeof setInterval> | undefined;

	const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

	$: identity = data.identity;
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

	function startCountdown() {
		secondsLeft = 300;
		timer = setInterval(() => {
			secondsLeft -= 1;
			if (secondsLeft <= 0) clearInterval(timer);
		}, 1000);
	}

	// When a hold succeeds, boot Stripe.js and mount the Payment Element.
	$: if (form?.held && form?.clientSecret && !paying) {
		paying = true;
		startCountdown();
		void mountStripe(form.clientSecret, form.code as string);
	}

	async function mountStripe(clientSecret: string, code: string) {
		try {
			await loadStripeJs();
			// @ts-expect-error Stripe global from CDN
			const stripe = Stripe(data.publicStripeKey);
			const elements = stripe.elements({ clientSecret });
			const paymentElement = elements.create('payment');
			paymentElement.mount('#payment-element');

			const payBtn = document.getElementById('pay-btn') as HTMLButtonElement;
			payBtn.addEventListener('click', async () => {
				payBtn.disabled = true;
				payError = '';
				const { error: err } = await stripe.confirmPayment({
					elements,
					redirect: 'if_required'
				});
				if (err) {
					payError = err.message ?? 'Payment failed. Please try again.';
					payBtn.disabled = false;
					return;
				}
				await goto(`/reservation/${code}`);
			});
		} catch (e) {
			payError = 'Could not load the payment form. Please refresh.';
			console.error(e);
		}
	}

	function loadStripeJs(): Promise<void> {
		return new Promise((resolve, reject) => {
			// @ts-expect-error Stripe global
			if (typeof Stripe !== 'undefined') return resolve();
			const s = document.createElement('script');
			s.src = 'https://js.stripe.com/v3';
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('stripe.js failed'));
			document.head.appendChild(s);
		});
	}

	$: mm = Math.floor(Math.max(secondsLeft, 0) / 60);
	$: ss = String(Math.max(secondsLeft, 0) % 60).padStart(2, '0');

	onDestroy(() => timer && clearInterval(timer));
</script>

<svelte:head>
	<title>{data.event.name} — Register</title>
</svelte:head>

<div class="container py-5" style="max-width: 760px;">
	<a href="/" class="text-decoration-none small text-success fw-semibold">
		<i class="bi bi-arrow-left me-1"></i>All camps
	</a>
	<h1 class="h3 mt-2 mb-1">{data.event.name}</h1>

	{#if data.registrationState !== 'open'}
		<!-- Registration window is not open: show a friendly notice, no wizard. -->
		<div class="cp-card p-5 text-center mt-4">
			{#if data.registrationState === 'upcoming'}
				<i class="bi bi-hourglass-split display-5 text-success d-block mb-3"></i>
				<h2 class="h4 mb-2">Registration hasn't opened yet</h2>
				<p class="text-muted mb-4" style="max-width: 32rem; margin-inline: auto">
					This camp isn't open for registration just yet. Check back soon — we'll open sign-ups
					here.
				</p>
			{:else}
				<i class="bi bi-calendar-check display-5 text-success d-block mb-3"></i>
				<h2 class="h4 mb-2">Registration is closed</h2>
				<p class="text-muted mb-4" style="max-width: 32rem; margin-inline: auto">
					Registration for this camp has ended. Browse our open camps to find your next session.
				</p>
			{/if}
			<a href="/" class="btn btn-primary rounded-pill px-4">
				<i class="bi bi-arrow-left me-1"></i>Browse open camps
			</a>
		</div>
	{:else}
		<!-- step indicator -->
		<div class="cp-steps mb-4">
			<span class="cp-step" class:is-muted={identity}>1 · Details</span>
			<span class="cp-step" class:is-muted={!identity || data.roomId}>2 · Room</span>
			<span class="cp-step" class:is-muted={!data.roomId || paying}>3 · Bed</span>
			<span class="cp-step" class:is-muted={!paying}>4 · Payment</span>
		</div>

		{#if identity && !paying}
			<!-- Who is registering, with a way to start over. Availability is only
			     ever shown to a named camper — never to anonymous URL visitors. -->
			<div class="d-flex justify-content-between align-items-center mb-3 small">
				<span class="text-muted">
					<i class="bi bi-person-check me-1 text-success"></i>
					Registering <strong>{identity.firstName} {identity.lastName}</strong>
					· {identity.email}
				</span>
				<form method="post" action="?/reset" use:enhance class="m-0">
					<button type="submit" class="btn btn-link btn-sm p-0 text-decoration-none">
						Start over
					</button>
				</form>
			</div>
		{/if}

		{#if paying && form?.clientSecret}
			<!-- STEP 4: payment -->
			<div class="cp-card p-4">
				<div class="d-flex justify-content-between align-items-center mb-3">
					<h2 class="h5 mb-0">Payment</h2>
					<span class="badge text-bg-warning">
						<i class="bi bi-clock-history me-1"></i>Bed held · {mm}:{ss}
					</span>
				</div>
				{#if selectedRoom}
					<p class="text-muted small">
						{selectedRoom.name} · {dollars(selectedRoom.price)}
					</p>
				{/if}
				<div id="payment-element" class="mb-3"></div>
				{#if payError}<div class="alert alert-danger py-2">{payError}</div>{/if}
				<button id="pay-btn" class="btn btn-primary w-100 rounded-pill" disabled={secondsLeft <= 0}>
					{secondsLeft <= 0 ? 'Hold expired — please start over' : 'Pay now'}
				</button>
			</div>
		{:else if !identity}
			<!-- STEP 1: sign in with an emailed code (required before availability). -->
			<div class="cp-card p-4">
				{#if signInStep === 'email'}
					<h2 class="h5 mb-1">Sign in to register</h2>
					<p class="text-muted small mb-3">
						Enter your email and we'll send you a 6-digit code. New here? You'll set up your details
						next.
					</p>
					<form
						method="post"
						action="?/requestCode"
						use:enhance={() => {
							starting = true;
							return async ({ update }) => {
								await update({ reset: false });
								starting = false;
								startTurnstile?.reset();
							};
						}}
					>
						<!-- honeypot -->
						<input
							type="text"
							name="middle_name"
							tabindex="-1"
							autocomplete="off"
							aria-hidden="true"
							style="position:absolute;left:-9999px"
						/>
						<div class="mb-3">
							<label class="form-label" for="email">Email</label>
							<input
								class="form-control"
								id="email"
								name="email"
								type="email"
								required
								value={pendingEmail}
							/>
							{#if form && 'emailError' in form && form.emailError}
								<div class="text-danger small">{form.emailError}</div>
							{/if}
						</div>

						<Turnstile bind:this={startTurnstile} action="paradise_register" />

						{#if form && 'message' in form && form.message}
							<div class="alert alert-danger py-2 mt-3">{form.message}</div>
						{/if}

						<button
							class="btn btn-primary w-100 mt-3 rounded-pill"
							type="submit"
							disabled={starting}
						>
							{starting ? 'Sending…' : 'Email me a code'}
						</button>
					</form>
				{:else if signInStep === 'code'}
					<h2 class="h5 mb-1">Enter your code</h2>
					<p class="text-muted small mb-3">
						We emailed a 6-digit code to <strong>{pendingEmail}</strong>. It expires in 10 minutes.
					</p>
					<form method="post" action="?/verifyCode" use:enhance>
						<input type="hidden" name="email" value={pendingEmail} />
						<div class="mb-3">
							<label class="form-label" for="code">6-digit code</label>
							<input
								class="form-control form-control-lg text-center"
								id="code"
								name="code"
								inputmode="numeric"
								autocomplete="one-time-code"
								maxlength="6"
								pattern={'[0-9]{6}'}
								required
								style="letter-spacing:.4em"
							/>
							{#if form && 'codeError' in form && form.codeError}
								<div class="text-danger small">{form.codeError}</div>
							{/if}
						</div>
						<button class="btn btn-primary w-100 rounded-pill" type="submit"
							>Verify &amp; continue</button
						>
					</form>
					<form method="post" action="?/requestCode" use:enhance class="mt-2 text-center">
						<input type="hidden" name="email" value={pendingEmail} />
						<button type="submit" class="btn btn-link btn-sm text-decoration-none">
							Didn't get it? Send a new code
						</button>
					</form>
				{:else}
					<!-- New camper: collect profile after a verified code. -->
					<h2 class="h5 mb-1">Set up your details</h2>
					<p class="text-muted small mb-3">
						Your email <strong>{pendingEmail}</strong> is verified. Tell us who's coming.
					</p>
					<form method="post" action="?/profile" use:enhance>
						<input type="hidden" name="email" value={pendingEmail} />
						<div class="row g-2">
							<div class="col">
								<label class="form-label" for="firstName">First name</label>
								<input
									class="form-control"
									id="firstName"
									name="firstName"
									required
									value={form && 'fields' in form ? (form.fields?.firstName ?? '') : ''}
								/>
								{#if form && 'profileErrors' in form && form.profileErrors?.firstName}
									<div class="text-danger small">{form.profileErrors.firstName}</div>
								{/if}
							</div>
							<div class="col">
								<label class="form-label" for="lastName">Last name</label>
								<input
									class="form-control"
									id="lastName"
									name="lastName"
									required
									value={form && 'fields' in form ? (form.fields?.lastName ?? '') : ''}
								/>
								{#if form && 'profileErrors' in form && form.profileErrors?.lastName}
									<div class="text-danger small">{form.profileErrors.lastName}</div>
								{/if}
							</div>
						</div>

						<fieldset class="mb-3 mt-2">
							<legend class="form-label mb-2">Who is this for?</legend>
							<div class="d-flex gap-3">
								<div class="form-check">
									<input
										class="form-check-input"
										type="radio"
										name="sex"
										id="sex-m"
										value="m"
										required
									/>
									<label class="form-check-label" for="sex-m">
										<i class="bi bi-gender-male me-1"></i>Male
									</label>
								</div>
								<div class="form-check">
									<input
										class="form-check-input"
										type="radio"
										name="sex"
										id="sex-f"
										value="f"
										required
									/>
									<label class="form-check-label" for="sex-f">
										<i class="bi bi-gender-female me-1"></i>Female
									</label>
								</div>
							</div>
							{#if form && 'profileErrors' in form && form.profileErrors?.sex}
								<div class="text-danger small">{form.profileErrors.sex}</div>
							{/if}
						</fieldset>

						<button class="btn btn-primary w-100 mt-1 rounded-pill" type="submit">
							Continue to rooms
						</button>
					</form>
				{/if}
			</div>
		{:else if !data.roomId}
			<!-- STEP 2: pick a room (availability shown as a flag only, never a count) -->
			<div class="cp-card p-4">
				<h2 class="h5 mb-3">Choose a room</h2>
				<div class="list-group list-group-flush">
					{#each data.rooms as room (room.id)}
						<a
							href={`?room=${room.id}`}
							class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0"
							class:disabled={!room.available}
						>
							<span>
								<strong>{room.name}</strong>
								<small class="text-muted d-block text-capitalize"
									>{room.type}{room.location ? ` · ${room.location}` : ''}</small
								>
							</span>
							<span class="text-end">
								<span class="d-block fw-semibold">{dollars(room.price)}</span>
								<small class:text-danger={!room.available} class="text-muted">
									{room.available ? 'Available' : 'Full'}
								</small>
							</span>
						</a>
					{:else}
						<p class="text-muted mb-0">No rooms available for this selection.</p>
					{/each}
				</div>
			</div>
		{:else}
			<!-- STEP 3: pick bed + agreements -->
			<div class="cp-card p-4">
				<div class="d-flex justify-content-between align-items-center mb-3">
					<h2 class="h5 mb-0">Pick a bed &amp; agree to the forms</h2>
					<a href="?" class="small text-decoration-none">&larr; change room</a>
				</div>

				{#if form && 'expired' in form && form.expired}
					<div class="alert alert-warning py-2">
						Your registration session expired. Please <a href="?/reset" data-sveltekit-reload
							>start again</a
						>.
					</div>
				{/if}

				<form
					method="post"
					action="?/hold"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update({ reset: false });
							submitting = false;
						};
					}}
				>
					<input type="hidden" name="roomId" value={data.roomId} />
					<!-- honeypot -->
					<input
						type="text"
						name="middle_name"
						tabindex="-1"
						autocomplete="off"
						aria-hidden="true"
						style="position:absolute;left:-9999px"
					/>

					<fieldset class="mb-3">
						<legend class="h6">Bed</legend>
						{#each data.beds as bed (bed.id)}
							<div class="form-check">
								<input
									class="form-check-input"
									type="radio"
									name="cotId"
									id={`cot-${bed.id}`}
									value={bed.id}
									required
								/>
								<label class="form-check-label" for={`cot-${bed.id}`}>
									{bed.description || `Bed ${bed.id}`}
								</label>
							</div>
						{:else}
							<p class="text-muted">No beds in this room.</p>
						{/each}
						{#if form?.errors?.bed}<div class="text-danger small">{form.errors.bed}</div>{/if}
					</fieldset>

					{#each data.forms as f (f.id)}
						{@const parsed = parseForm(f.questions)}
						<div class="mb-4 pt-3 border-top">
							<h3 class="h6 mb-2">{f.name}</h3>

							{#if parsed.body.length}
								<div class="cp-rules mb-3">
									{#each parsed.body as para}
										<p class="small mb-2">{para}</p>
									{/each}
								</div>
							{/if}

							{#each parsed.questions as q (q.key)}
								{@const fieldName = `form_${f.id}_${q.key}`}
								<div class="mb-3">
									{#if q.type === 'checkbox'}
										<div class="form-check">
											<input
												class="form-check-input"
												type="checkbox"
												name={fieldName}
												id={fieldName}
												value="yes"
												required={q.required}
											/>
											<label class="form-check-label" for={fieldName}>{q.label}</label>
										</div>
									{:else}
										<label class="form-label" for={fieldName}>{q.label}</label>
										{#if q.type === 'textarea'}
											<textarea
												class="form-control"
												name={fieldName}
												id={fieldName}
												rows="3"
												required={q.required}
											></textarea>
										{:else if q.type === 'select'}
											<select
												class="form-select"
												name={fieldName}
												id={fieldName}
												required={q.required}
											>
												<option value="" disabled selected>Choose…</option>
												{#each q.options ?? [] as opt}
													<option value={opt}>{opt}</option>
												{/each}
											</select>
										{:else}
											<input
												class="form-control"
												type={q.type === 'date' ? 'date' : 'text'}
												name={fieldName}
												id={fieldName}
												required={q.required}
											/>
										{/if}
									{/if}
								</div>
							{/each}

							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									name={`form_${f.id}`}
									id={`form-${f.id}`}
									required
								/>
								<label class="form-check-label" for={`form-${f.id}`}>
									I have read and agree to the {f.name}.
								</label>
								{#if form?.errors?.[`form_${f.id}`]}
									<div class="text-danger small">{form.errors[`form_${f.id}`]}</div>
								{/if}
							</div>
						</div>
					{/each}

					{#if form?.message}<div class="alert alert-danger py-2 mt-3">{form.message}</div>{/if}

					<button
						class="btn btn-primary w-100 mt-3 rounded-pill"
						type="submit"
						disabled={submitting}
					>
						{submitting ? 'Holding your bed…' : 'Hold bed & continue to payment'}
					</button>
					<p class="text-muted small mt-2 mb-0">Your bed is held for 5 minutes while you pay.</p>
				</form>
			</div>
		{/if}
	{/if}
</div>
