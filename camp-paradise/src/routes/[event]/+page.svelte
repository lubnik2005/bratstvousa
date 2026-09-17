<script lang="ts">
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import HealthForm from '$lib/components/HealthForm.svelte';
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

	const btn =
		'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0';
	const card = 'rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5 sm:p-8';
	const chip = 'rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white';
	const chipMuted = 'rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink-soft';
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
			<span class={identity ? chipMuted : chip}>1 · Sign in</span>
			<span class={!identity || data.roomId ? chipMuted : chip}>2 · Room</span>
			<span class={!data.roomId || paying ? chipMuted : chip}>3 · Bed</span>
			<span class={!paying ? chipMuted : chip}>4 · Payment</span>
		</div>

		{#if identity && !paying}
			<div
				class="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-mint/40 px-4 py-3 text-sm"
			>
				<span>
					<i class="bi bi-person-check mr-1 text-primary-600"></i>
					Registering <strong>{identity.firstName} {identity.lastName}</strong> · {identity.email}
				</span>
				{#if data.roomId}
					<a href="?" class="font-semibold text-primary-600 hover:text-primary">Start over</a>
				{/if}
			</div>
		{/if}

		{#if paying && form?.clientSecret}
			<div class="mt-6 {card}">
				<div class="flex items-center justify-between gap-3">
					<h2 class="text-xl">Payment</h2>
					<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
						<i class="bi bi-clock-history mr-1"></i>Bed held · {mm}:{ss}
					</span>
				</div>
				{#if selectedRoom}
					<p class="mt-1 text-sm text-ink-soft">
						{selectedRoom.name} · {dollars(selectedRoom.price)}
					</p>
				{/if}
				<div id="payment-element" class="mt-4"></div>
				{#if payError}
					<div class="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{payError}</div>
				{/if}
				<button id="pay-btn" class="{btn} mt-4 w-full" disabled={secondsLeft <= 0}>
					{secondsLeft <= 0 ? 'Hold expired — please start over' : 'Pay now'}
				</button>
			</div>
		{:else if !identity}
			<div class="mt-6 {card}">
				{#if signInStep === 'email'}
					<h2 class="text-xl">Sign in to register</h2>
					<p class="mt-1 text-sm text-ink-soft">
						Enter your email and we'll send you a 6-digit code. New here? You'll set up your details
						next.
					</p>
					<form
						method="post"
						action="?/requestCode"
						class="mt-4"
						use:enhance={() => {
							starting = true;
							return async ({ update }) => {
								await update({ reset: false });
								starting = false;
								startTurnstile?.reset();
							};
						}}
					>
						<input
							type="text"
							name="middle_name"
							tabindex="-1"
							autocomplete="off"
							aria-hidden="true"
							style="position:absolute;left:-9999px"
						/>
						<label class="mb-1 block text-sm font-medium" for="email">Email</label>
						<input
							class="field"
							type="email"
							id="email"
							name="email"
							required
							value={pendingEmail}
						/>
						{#if form && 'emailError' in form && form.emailError}
							<div class="mt-1 text-sm text-red-600">{form.emailError}</div>
						{/if}
						<div class="mt-3">
							<Turnstile bind:this={startTurnstile} action="paradise_register" />
						</div>
						{#if form && 'message' in form && form.message}
							<div class="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
								{form.message}
							</div>
						{/if}
						<button class="{btn} mt-4 w-full" type="submit" disabled={starting}>
							{starting ? 'Sending…' : 'Email me a code'}
						</button>
					</form>
				{:else if signInStep === 'code'}
					<h2 class="text-xl">Enter your code</h2>
					<p class="mt-1 text-sm text-ink-soft">
						We emailed a 6-digit code to <strong>{pendingEmail}</strong>. It expires in 10 minutes.
					</p>
					<form method="post" action="?/verifyCode" class="mt-4" use:enhance>
						<input type="hidden" name="email" value={pendingEmail} />
						<label class="mb-1 block text-sm font-medium" for="code">6-digit code</label>
						<input
							class="field text-center font-display text-2xl tracking-[0.4em]"
							type="text"
							id="code"
							name="code"
							inputmode="numeric"
							autocomplete="one-time-code"
							maxlength="6"
							pattern={'[0-9]{6}'}
							required
						/>
						{#if form && 'codeError' in form && form.codeError}
							<div class="mt-1 text-sm text-red-600">{form.codeError}</div>
						{/if}
						<button class="{btn} mt-4 w-full" type="submit">Verify &amp; continue</button>
					</form>
					<form method="post" action="?/requestCode" class="mt-3 text-center" use:enhance>
						<input type="hidden" name="email" value={pendingEmail} />
						<button class="text-sm font-semibold text-primary-600 hover:text-primary" type="submit">
							Didn't get it? Send a new code
						</button>
					</form>
				{:else}
					<h2 class="text-xl">Set up your details</h2>
					<p class="mt-1 text-sm text-ink-soft">
						Your email <strong>{pendingEmail}</strong> is verified. Tell us who's coming.
					</p>
					<form method="post" action="?/profile" class="mt-4 space-y-4" use:enhance>
						<input type="hidden" name="email" value={pendingEmail} />
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="mb-1 block text-sm font-medium" for="firstName">First name</label>
								<input
									class="field"
									type="text"
									id="firstName"
									name="firstName"
									required
									value={form && 'fields' in form ? (form.fields?.firstName ?? '') : ''}
								/>
								{#if form && 'profileErrors' in form && form.profileErrors?.firstName}
									<div class="mt-1 text-sm text-red-600">{form.profileErrors.firstName}</div>
								{/if}
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium" for="lastName">Last name</label>
								<input
									class="field"
									type="text"
									id="lastName"
									name="lastName"
									required
									value={form && 'fields' in form ? (form.fields?.lastName ?? '') : ''}
								/>
								{#if form && 'profileErrors' in form && form.profileErrors?.lastName}
									<div class="mt-1 text-sm text-red-600">{form.profileErrors.lastName}</div>
								{/if}
							</div>
						</div>
						<fieldset>
							<legend class="mb-2 text-sm font-medium">Who is this for?</legend>
							<div class="flex gap-3">
								<label
									class="flex flex-1 cursor-pointer items-center gap-2 rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-mint/40"
								>
									<input
										class="accent-primary"
										type="radio"
										name="sex"
										id="sex-m"
										value="m"
										required
									/>
									<i class="bi bi-gender-male"></i> Male
								</label>
								<label
									class="flex flex-1 cursor-pointer items-center gap-2 rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-mint/40"
								>
									<input
										class="accent-primary"
										type="radio"
										name="sex"
										id="sex-f"
										value="f"
										required
									/>
									<i class="bi bi-gender-female"></i> Female
								</label>
							</div>
							{#if form && 'profileErrors' in form && form.profileErrors?.sex}
								<div class="mt-1 text-sm text-red-600">{form.profileErrors.sex}</div>
							{/if}
						</fieldset>
						<button class="{btn} w-full" type="submit">Continue to rooms</button>
					</form>
				{/if}
			</div>
		{:else if !data.roomId}
			<div class="mt-6 {card}">
				<h2 class="text-xl">Choose a room</h2>
				<p class="mt-1 text-sm text-ink-soft">Rooms are matched to who's registering.</p>
				<div class="mt-4 divide-y divide-ink/10">
					{#each data.rooms as room (room.id)}
						<a
							href={`?room=${room.id}`}
							class="-mx-2 flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition {room.available
								? 'hover:bg-sand'
								: 'pointer-events-none opacity-50'}"
						>
							<div>
								<div class="font-semibold">{room.name}</div>
								<div class="text-sm text-ink-soft capitalize">
									{room.type}{room.location ? ` · ${room.location}` : ''}
								</div>
							</div>
							<div class="flex items-center gap-3 text-right">
								<span class="font-semibold">{dollars(room.price)}</span>
								{#if room.available}
									<span
										class="rounded-full bg-mint/60 px-3 py-1 text-xs font-semibold text-primary-600"
										>Available</span
									>
								{:else}
									<span class="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink-soft"
										>Full</span
									>
								{/if}
							</div>
						</a>
					{:else}
						<p class="py-3 text-sm text-ink-soft">No rooms available for this selection.</p>
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
						<legend class="mb-2 text-sm font-semibold">Bed</legend>
						<div class="grid gap-2 sm:grid-cols-2">
							{#each data.beds as bed (bed.id)}
								<label
									class="flex cursor-pointer items-center gap-2 rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-mint/40"
								>
									<input
										class="accent-primary"
										type="radio"
										name="cotId"
										id={`cot-${bed.id}`}
										value={bed.id}
										required
									/>
									{bed.description || `Bed ${bed.id}`}
								</label>
							{:else}
								<p class="text-sm text-ink-soft">No beds in this room.</p>
							{/each}
						</div>
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

					{#if form?.message}
						<div class="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
							{form.message}
						</div>
					{/if}
					<button class="{btn} mt-5 w-full" type="submit" disabled={submitting}>
						{submitting ? 'Holding your bed…' : 'Hold bed & continue to payment'}
					</button>
					<p class="mt-3 text-center text-xs text-ink-soft">
						Your bed is held for 5 minutes while you pay.
					</p>
				</form>
			</div>
		{/if}
	{/if}
</div>
