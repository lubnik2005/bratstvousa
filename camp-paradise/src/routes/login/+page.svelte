<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let startTurnstile: Turnstile;
	let starting = false;

	// Sign-in sub-step: 'email' -> 'code' -> ('profile' for new campers).
	$: signInStep =
		form && 'needsProfile' in form && form.needsProfile
			? 'profile'
			: form && 'codeSent' in form && form.codeSent
				? 'code'
				: 'email';
	$: pendingEmail = form && 'email' in form ? ((form.email as string | undefined) ?? '') : '';

	// The server returns { signedIn: true } (no redirect) so we can navigate
	// client-side to the requested destination.
	$: if (form && 'signedIn' in form && form.signedIn) {
		void goto(data.next);
	}
</script>

<svelte:head>
	<title>Sign in — Camp Paradise</title>
</svelte:head>

<div class="container py-5" style="max-width: 460px;">
	<div class="text-center mb-4">
		<img src="/logo-single.svg" alt="Camp Paradise" width="52" height="52" class="mb-2" />
		<h1 class="h3 mb-1">Camper sign in</h1>
		<p class="text-muted small mb-0">Access your reservations and register for camps.</p>
	</div>

	<div class="cp-card p-4">
		{#if signInStep === 'email'}
			<h2 class="h5 mb-1">Sign in with your email</h2>
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

				<Turnstile bind:this={startTurnstile} action="paradise_login" />

				{#if form && 'message' in form && form.message}
					<div class="alert alert-danger py-2 mt-3">{form.message}</div>
				{/if}

				<button class="btn btn-primary w-100 mt-3 rounded-pill" type="submit" disabled={starting}>
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
				Your email <strong>{pendingEmail}</strong> is verified. Tell us who you are.
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
					<legend class="form-label mb-2">Who is this?</legend>
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

				<button class="btn btn-primary w-100 mt-1 rounded-pill" type="submit"> Continue </button>
			</form>
		{/if}
	</div>

	<p class="text-center text-muted small mt-3 mb-0">
		<a href="/" class="text-decoration-none text-success fw-semibold">
			<i class="bi bi-arrow-left me-1"></i>Back to camps
		</a>
	</p>
</div>
