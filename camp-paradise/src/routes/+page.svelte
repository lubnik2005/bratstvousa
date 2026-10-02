<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let startTurnstile: Turnstile;
	let resendTurnstile: Turnstile;
	let starting = false;
	// Email step mode: email a code (default) or sign in with a password.
	let usePassword = false;
	$: if (form && 'usePassword' in form && form.usePassword) usePassword = true;

	// Sign-in sub-step: 'email' -> 'code' -> ('profile' for new campers).
	$: signInStep =
		form && 'needsProfile' in form && form.needsProfile
			? 'profile'
			: form && (('codeSent' in form && form.codeSent) || ('codeError' in form && form.codeError))
				? 'code'
				: 'email';
	$: pendingEmail = form && 'email' in form ? ((form.email as string | undefined) ?? '') : '';

	// The server returns { signedIn: true } (no redirect) so we can navigate
	// client-side to the requested destination.
	$: if (form && 'signedIn' in form && form.signedIn) {
		void goto(data.next);
	}

	const btn =
		'inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0';
</script>

<svelte:head>
	<title>Sign in — Camp Paradise</title>
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 lg:py-16">
	<div class="mb-6 text-center">
		<img
			src="/logo.png"
			alt="Camp Paradise"
			width="64"
			height="64"
			class="mx-auto mb-3 h-16 w-16"
		/>
		<p class="eyebrow text-primary-600">Camper portal</p>
		<h1 class="mt-1 text-3xl font-semibold">Camper sign in</h1>
		<p class="mt-2 text-sm text-ink-soft">Access your reservations and register for camps.</p>
	</div>

	<div class="rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5 sm:p-8">
		{#if signInStep === 'email'}
			<h2 class="text-lg font-semibold">Sign in with your email</h2>
			<p class="mt-1 mb-5 text-sm text-ink-soft">
				{#if usePassword}
					Enter the email and password you set on your account page.
				{:else}
					Enter your email and we'll send you a 6-digit code. New here? You'll set up your details
					next.
				{/if}
			</p>
			<form
				method="post"
				action={usePassword ? '?/passwordLogin' : '?/requestCode'}
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
				<div class="mb-4">
					<label class="mb-1 block text-sm font-medium" for="email">Email</label>
					<input class="field" id="email" name="email" type="email" required value={pendingEmail} />
					{#if form && 'emailError' in form && form.emailError}
						<div class="mt-1 text-sm text-red-600">{form.emailError}</div>
					{/if}
				</div>

				{#if usePassword}
					<div class="mb-4">
						<label class="mb-1 block text-sm font-medium" for="password">Password</label>
						<input
							class="field"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
						/>
						{#if form && 'passwordError' in form && form.passwordError}
							<div class="mt-1 text-sm text-red-600">{form.passwordError}</div>
						{/if}
						<p class="mt-2 text-xs text-gray-500">
							Forgot your password?
							<button
								type="button"
								class="font-semibold text-primary-600 hover:text-primary"
								on:click={() => (usePassword = false)}>Email me a code</button
							>, then set a new one on your Account page.
						</p>
					</div>
				{/if}

				<Turnstile bind:this={startTurnstile} action="paradise_login" />

				{#if form && 'message' in form && form.message}
					<div class="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{form.message}</div>
				{/if}

				<button class="{btn} mt-4" type="submit" disabled={starting}>
					{#if usePassword}
						{starting ? 'Signing in…' : 'Sign in'}
					{:else}
						{starting ? 'Sending…' : 'Email me a code'}
					{/if}
				</button>
			</form>
			<div class="mt-3 text-center">
				<button
					type="button"
					class="text-sm font-semibold text-primary-600 hover:text-primary"
					on:click={() => (usePassword = !usePassword)}
				>
					{usePassword ? 'Email me a code instead' : 'Have a password? Sign in with it'}
				</button>
			</div>
		{:else if signInStep === 'code'}
			<h2 class="text-lg font-semibold">Enter your code</h2>
			<p class="mt-1 mb-5 text-sm text-ink-soft">
				We emailed a 6-digit code to <strong class="text-ink">{pendingEmail}</strong>. It expires in
				10 minutes.
			</p>
			<form method="post" action="?/verifyCode" use:enhance>
				<input type="hidden" name="email" value={pendingEmail} />
				<div class="mb-4">
					<label class="mb-1 block text-sm font-medium" for="code">6-digit code</label>
					<input
						class="field text-center font-display text-2xl tracking-[0.4em]"
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
				</div>
				<button class={btn} type="submit">Verify &amp; continue</button>
			</form>
			<form
				method="post"
				action="?/requestCode"
				use:enhance={() => {
					return async ({ update }) => {
						await update({ reset: false });
						resendTurnstile?.reset();
					};
				}}
				class="mt-5 border-t border-ink/10 pt-4 text-center"
			>
				<input type="hidden" name="email" value={pendingEmail} />
				<input type="hidden" name="resend" value="1" />
				<div class="flex justify-center">
					<Turnstile bind:this={resendTurnstile} action="paradise_login" />
				</div>
				{#if form && 'message' in form && form.message}
					<div class="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{form.message}</div>
				{/if}
				<button
					type="submit"
					class="mt-2 text-sm font-semibold text-primary-600 hover:text-primary"
				>
					Didn't get it? Send a new code
				</button>
			</form>
		{:else}
			<!-- New camper: collect profile after a verified code. -->
			<h2 class="text-lg font-semibold">Set up your details</h2>
			<p class="mt-1 mb-5 text-sm text-ink-soft">
				Your email <strong class="text-ink">{pendingEmail}</strong> is verified. Tell us who you are.
			</p>
			<form method="post" action="?/profile" use:enhance>
				<input type="hidden" name="email" value={pendingEmail} />
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium" for="firstName">First name</label>
						<input
							class="field"
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

				<fieldset class="mt-4 mb-5">
					<legend class="mb-2 block text-sm font-medium">Who is this?</legend>
					<div class="flex gap-3">
						<label
							class="flex flex-1 cursor-pointer items-center gap-2 rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-mint/40"
							for="sex-m"
						>
							<input class="accent-primary" type="radio" name="sex" id="sex-m" value="m" required />
							<i class="bi bi-gender-male text-primary-600"></i>Male
						</label>
						<label
							class="flex flex-1 cursor-pointer items-center gap-2 rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-mint/40"
							for="sex-f"
						>
							<input class="accent-primary" type="radio" name="sex" id="sex-f" value="f" required />
							<i class="bi bi-gender-female text-primary-600"></i>Female
						</label>
					</div>
					{#if form && 'profileErrors' in form && form.profileErrors?.sex}
						<div class="mt-1 text-sm text-red-600">{form.profileErrors.sex}</div>
					{/if}
				</fieldset>

				<button class={btn} type="submit">Continue</button>
			</form>
		{/if}
	</div>
</div>
