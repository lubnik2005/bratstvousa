<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { site, contact } from '$lib/content/site';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);
	let turnstile: Turnstile | undefined = $state();
</script>

<svelte:head>
	<title>Contact — Camp Paradise</title>
	<meta
		name="description"
		content="Get in touch to book a stay or ask a question. Call {site.phone} or email {site.email}."
	/>
</svelte:head>

<PageHero
	image="gallery-16"
	eyebrow="Get in touch"
	title="Come visit Camp Paradise"
	subtitle={contact.intro}
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr]">
		<div use:reveal class="space-y-8">
			<div>
				<p class="text-primary text-sm font-semibold tracking-[0.2em] uppercase">Reach us</p>
				<h2 class="text-ink mt-2 text-3xl">We'd love to hear from you</h2>
			</div>
			<ul class="space-y-4">
				<li class="flex items-center gap-4">
					<span
						class="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl"
					>
						<i class="bi bi-telephone"></i>
					</span>
					<a class="text-ink hover:text-primary text-lg transition" href={site.phoneHref}>
						{site.phone}
					</a>
				</li>
				<li class="flex items-center gap-4">
					<span
						class="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl"
					>
						<i class="bi bi-envelope"></i>
					</span>
					<a class="text-ink hover:text-primary text-lg transition" href={site.emailHref}>
						{site.email}
					</a>
				</li>
				<li class="flex items-center gap-4">
					<span
						class="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl"
					>
						<i class="bi bi-geo-alt"></i>
					</span>
					<a
						class="text-ink hover:text-primary text-lg transition"
						href={site.mapsLink}
						target="_blank"
						rel="noopener"
					>
						{site.address.full}
					</a>
				</li>
			</ul>
			<div class="flex gap-3">
				<a
					class="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-80"
					href={site.social.facebook}
					target="_blank"
					rel="noopener"
					aria-label="Facebook"><i class="bi bi-facebook"></i></a
				>
				<a
					class="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-80"
					href={site.social.instagram}
					target="_blank"
					rel="noopener"
					aria-label="Instagram"><i class="bi bi-instagram"></i></a
				>
				<a
					class="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-80"
					href={site.social.youtube}
					target="_blank"
					rel="noopener"
					aria-label="YouTube"><i class="bi bi-youtube"></i></a
				>
			</div>
		</div>

		<div use:reveal class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 lg:p-8">
			{#if form?.success}
				<div class="flex h-full flex-col items-center justify-center py-12 text-center">
					<span
						class="bg-primary/10 text-primary mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
					>
						<i class="bi bi-check-lg"></i>
					</span>
					<h3 class="text-ink text-2xl">Message sent!</h3>
					<p class="text-ink-soft mt-2">
						Thanks for reaching out. We'll get back to you as soon as we can.
					</p>
				</div>
			{:else}
				<form
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
							turnstile?.reset();
						};
					}}
					class="space-y-5"
				>
					{#if form?.error}
						<p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</p>
					{/if}

					<!-- honeypot -->
					<div class="hidden" aria-hidden="true">
						<label>Company<input name="company" tabindex="-1" autocomplete="off" /></label>
					</div>

					<div class="grid gap-5 sm:grid-cols-2">
						<label class="block">
							<span class="text-ink mb-1.5 block text-sm font-medium">Full name *</span>
							<input
								name="fullName"
								required
								value={form?.fullName ?? ''}
								class="focus:border-primary focus:ring-primary/30 bg-sand/40 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2"
							/>
						</label>
						<label class="block">
							<span class="text-ink mb-1.5 block text-sm font-medium">Group name</span>
							<input
								name="groupName"
								value={form?.groupName ?? ''}
								class="focus:border-primary focus:ring-primary/30 bg-sand/40 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2"
							/>
						</label>
					</div>

					<div class="grid gap-5 sm:grid-cols-2">
						<label class="block">
							<span class="text-ink mb-1.5 block text-sm font-medium">Contact email *</span>
							<input
								name="email"
								type="email"
								required
								value={form?.email ?? ''}
								class="focus:border-primary focus:ring-primary/30 bg-sand/40 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2"
							/>
						</label>
						<label class="block">
							<span class="text-ink mb-1.5 block text-sm font-medium">Telephone number</span>
							<input
								name="phone"
								type="tel"
								value={form?.phone ?? ''}
								class="focus:border-primary focus:ring-primary/30 bg-sand/40 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2"
							/>
						</label>
					</div>

					<label class="block">
						<span class="text-ink mb-1.5 block text-sm font-medium">Additional information</span>
						<textarea
							name="message"
							rows="5"
							class="focus:border-primary focus:ring-primary/30 bg-sand/40 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2"
							>{form?.message ?? ''}</textarea
						>
					</label>

					<Turnstile bind:this={turnstile} action="contact" />

					<Button type="submit" variant="primary" size="lg" disabled={submitting} class="w-full">
						{submitting ? 'Sending…' : 'Send message'}
					</Button>
				</form>
			{/if}
		</div>
	</div>
</section>
