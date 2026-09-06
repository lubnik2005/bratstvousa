<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: errors = (form?.form && 'errors' in form.form ? form.form.errors : {}) as Record<
		string,
		string
	>;
	$: values = (form?.form && 'fields' in form.form ? form.form.fields : {}) as Record<
		string,
		string
	>;

	// Demo Stripe payment step (client-side simulation — no real Stripe yet).
	let paying = false;
	let paid = false;
	function payDemo() {
		paying = true;
		setTimeout(() => {
			paying = false;
			paid = true;
		}, 1200);
	}

	// ---- Church searchable combobox ----
	// `churchSelected` holds the hidden submit value: a church label, or 'other'.
	const initialChurch =
		form?.form && 'fields' in form.form ? ((form.form.fields.church as string) ?? '') : '';
	let churchSelected = initialChurch;
	let churchOther = '';
	let churchQuery = churchSelected && churchSelected !== 'other' ? churchSelected : '';
	let churchOpen = false;
	let churchActive = -1;

	$: churchMatches = churchQuery.trim()
		? data.churches.filter((c) =>
				c.label.toLowerCase().includes(churchQuery.trim().toLowerCase())
			)
		: data.churches;

	function pickChurch(label: string) {
		churchSelected = label;
		churchQuery = label;
		churchOpen = false;
		churchActive = -1;
	}
	function pickOther() {
		churchSelected = 'other';
		churchQuery = 'Другое (ввести своё)';
		churchOpen = false;
		churchActive = -1;
	}
	function onChurchInput(e: Event) {
		churchQuery = (e.target as HTMLInputElement).value;
		churchSelected = churchQuery; // free text counts as a selectable label
		churchOpen = true;
		churchActive = -1;
	}
	function onChurchKeydown(e: KeyboardEvent) {
		if (!churchOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			churchOpen = true;
			return;
		}
		const max = churchMatches.length; // +0..max-1 for churches, index === max => "Другое"
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			churchActive = churchActive >= max ? 0 : churchActive + 1;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			churchActive = churchActive <= 0 ? max : churchActive - 1;
		} else if (e.key === 'Enter') {
			if (churchOpen && churchActive >= 0) {
				e.preventDefault();
				if (churchActive === max) pickOther();
				else pickChurch(churchMatches[churchActive].label);
			}
		} else if (e.key === 'Escape') {
			churchOpen = false;
			churchActive = -1;
		}
	}
</script>

<svelte:head>
	<title>Регистрация — Зимний молодежный лагерь СЗР</title>
</svelte:head>

<section class="reg-hero">
	<p class="reg-eyebrow">Северо-Западный регион · 2026</p>
	<h1 class="reg-title">Регистрация на лагерь</h1>
	<p class="reg-sub">Зимний молодежный лагерь СЗР · 14 октября 2026</p>
</section>

<div class="container-xxl py-6">
	<div class="container">
		<div class="reg-shell mx-auto">
			<ol class="reg-steps">
				<li class:active={!form?.registered} class:done={form?.registered}>1. Данные</li>
				<li class:active={form?.registered && !paid} class:done={paid}>2. Оплата</li>
				<li class:active={paid}>3. Готово</li>
			</ol>

			{#if !form?.registered}
				<!-- STEP 1: registration form -->
				<form method="post" use:enhance>
					<input
						type="text"
						name="middle_name"
						tabindex="-1"
						autocomplete="off"
						style="position:absolute;left:-9999px"
						aria-hidden="true"
					/>

					<div class="reg-grid">
						<div class="field">
							<label class="form-label" for="firstName">Имя</label>
							<input class="form-control" id="firstName" name="firstName" value={values.firstName ?? ''} />
							{#if errors.firstName}<div class="field-error">{errors.firstName}</div>{/if}
						</div>
						<div class="field">
							<label class="form-label" for="lastName">Фамилия</label>
							<input class="form-control" id="lastName" name="lastName" value={values.lastName ?? ''} />
							{#if errors.lastName}<div class="field-error">{errors.lastName}</div>{/if}
						</div>
					</div>

					<div class="field">
						<label class="form-label" for="churchInput">Церковь</label>
						<div class="combo">
							<input
								class="form-control"
								id="churchInput"
								autocomplete="off"
								placeholder="Начните вводить название…"
								value={churchQuery}
								on:input={onChurchInput}
								on:focus={() => (churchOpen = true)}
								on:keydown={onChurchKeydown}
								role="combobox"
								aria-expanded={churchOpen}
								aria-controls="church-listbox"
							/>
							{#if churchOpen}
								<ul class="combo-list" id="church-listbox" role="listbox">
									{#each churchMatches as c, i (c.id)}
										<li
											role="option"
											aria-selected={churchActive === i}
											class:active={churchActive === i}
											on:mousedown|preventDefault={() => pickChurch(c.label)}
										>
											{c.label}
										</li>
									{/each}
									<li
										role="option"
										aria-selected={churchActive === churchMatches.length}
										class="combo-other"
										class:active={churchActive === churchMatches.length}
										on:mousedown|preventDefault={pickOther}
									>
										Другое (ввести своё)
									</li>
								</ul>
							{/if}
						</div>
						<!-- hidden submit values -->
						<input type="hidden" name="church" value={churchSelected} />
						{#if churchSelected === 'other'}
							<input
								class="form-control mt-2"
								name="churchOther"
								placeholder="Название вашей церкви"
								bind:value={churchOther}
							/>
						{/if}
						{#if errors.church}<div class="field-error">{errors.church}</div>{/if}
					</div>

					<div class="reg-grid">
						<div class="field">
							<label class="form-label" for="email">Email</label>
							<input class="form-control" id="email" name="email" type="email" value={values.email ?? ''} />
							{#if errors.email}<div class="field-error">{errors.email}</div>{/if}
						</div>
						<div class="field">
							<label class="form-label" for="phone">Телефон</label>
							<input class="form-control" id="phone" name="phone" value={values.phone ?? ''} />
						</div>
					</div>

					<div class="field">
						<label class="form-label" for="leaderId">Ответственный за молодежь</label>
						<select class="form-select" id="leaderId" name="leaderId">
							<option value="">— Выберите —</option>
							{#each data.leaders as leader (leader.id)}
								<option value={leader.id} selected={String(values.leaderId) === String(leader.id)}>
									{leader.name}
								</option>
							{/each}
						</select>
						{#if errors.leaderId}<div class="field-error">{errors.leaderId}</div>{/if}
					</div>

					<button class="btn btn-primary reg-submit" type="submit">
						Продолжить к оплате · ${data.amount}
					</button>
					<p class="reg-privacy">
						Отправляя форму, вы соглашаетесь с
						<a href="/youth-ministry/zimnii-molodeznyi-lager-szr-2026/privacy">политикой
							конфиденциальности лагеря</a>. Ваши данные никогда не будут проданы.
					</p>
				</form>
			{:else if !paid}
				<!-- STEP 2: demo Stripe payment -->
				<div class="pay-card">
					<div class="pay-head">
						<span>Оплата участия</span>
						<strong>${form.amount}</strong>
					</div>
					<p class="pay-note">
						Заявка принята для <strong>{form.name}</strong>. Оплатите участие, чтобы завершить
						регистрацию.
					</p>

					<div class="field">
						<label class="form-label" for="card">Номер карты</label>
						<input class="form-control" id="card" placeholder="4242 4242 4242 4242" />
					</div>
					<div class="reg-grid">
						<div class="field">
							<label class="form-label" for="exp">Срок</label>
							<input class="form-control" id="exp" placeholder="12 / 26" />
						</div>
						<div class="field">
							<label class="form-label" for="cvc">CVC</label>
							<input class="form-control" id="cvc" placeholder="123" />
						</div>
					</div>

					<button class="btn btn-primary reg-submit" on:click={payDemo} disabled={paying}>
						{paying ? 'Обработка…' : `Оплатить $${form.amount}`}
					</button>
					<p class="pay-demo">Демонстрационная оплата — платёж не списывается.</p>
				</div>
			{:else}
				<!-- STEP 3: done -->
				<div class="reg-done">
					<div class="reg-check">✓</div>
					<h2>Оплата прошла успешно</h2>
					<p>
						Спасибо! Ваша заявка отправлена ответственному за молодежь на подтверждение. Вы получите
						письмо, когда её одобрят.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.reg-hero {
		background: var(--bs-dark, #2c2b29);
		color: var(--bs-paper, #f6f2ea);
		text-align: center;
		padding: 4.5rem 1.5rem 3.5rem;
	}
	.reg-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 0.78rem;
		color: var(--bs-secondary, #a28c6a);
		margin: 0 0 0.75rem;
	}
	.reg-title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: clamp(2rem, 5vw, 3.25rem);
		margin: 0;
		color: var(--bs-paper, #f6f2ea);
	}
	.reg-sub {
		color: rgba(246, 242, 234, 0.75);
		margin: 0.75rem 0 0;
	}
	.reg-shell {
		max-width: 44rem;
		background: var(--bs-paper, #f6f2ea);
		border: 1px solid var(--bs-rule, #ddd5c8);
		padding: 2.25rem;
	}
	.reg-steps {
		list-style: none;
		display: flex;
		gap: 1.25rem;
		padding: 0;
		margin: 0 0 2rem;
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--bs-ink-muted, #736a5f);
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		padding-bottom: 1rem;
	}
	.reg-steps li.active {
		color: var(--bs-primary, #5a4a42);
		font-weight: 600;
	}
	.reg-steps li.done {
		color: var(--bs-secondary, #a28c6a);
	}
	.reg-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	@media (max-width: 575.98px) {
		.reg-grid {
			grid-template-columns: 1fr;
		}
	}
	.field {
		margin-bottom: 1rem;
	}
	.field-error {
		color: #b3261e;
		font-size: 0.82rem;
		margin-top: 0.25rem;
	}
	.reg-submit {
		width: 100%;
		margin-top: 0.75rem;
		padding: 0.7rem 1rem;
	}
	.reg-privacy {
		font-size: 0.8rem;
		color: var(--bs-ink-muted, #736a5f);
		margin: 0.75rem 0 0;
		text-align: center;
	}
	.combo {
		position: relative;
	}
	.combo-list {
		position: absolute;
		z-index: 20;
		top: calc(100% + 2px);
		left: 0;
		right: 0;
		max-height: 16rem;
		overflow-y: auto;
		margin: 0;
		padding: 0;
		list-style: none;
		background: var(--bs-paper, #f6f2ea);
		border: 1px solid var(--bs-rule, #ddd5c8);
		box-shadow: 0 6px 24px rgba(44, 43, 41, 0.12);
	}
	.combo-list li {
		padding: 0.55rem 0.85rem;
		cursor: pointer;
		font-size: 0.92rem;
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
	}
	.combo-list li:last-child {
		border-bottom: none;
	}
	.combo-list li.active,
	.combo-list li:hover {
		background: var(--bs-paper-sunk, #efe9df);
		color: var(--bs-primary, #5a4a42);
	}
	.combo-other {
		font-style: italic;
		color: var(--bs-secondary, #a28c6a);
	}
	.pay-card {
		border: 1px solid var(--bs-rule, #ddd5c8);
		background: var(--bs-paper-sunk, #efe9df);
		padding: 1.75rem;
	}
	.pay-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
	}
	.pay-head strong {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.5rem;
	}
	.pay-note {
		color: var(--bs-ink-muted, #736a5f);
		margin-bottom: 1.5rem;
	}
	.pay-demo {
		text-align: center;
		font-size: 0.78rem;
		color: var(--bs-ink-muted, #736a5f);
		margin: 0.75rem 0 0;
	}
	.reg-done {
		text-align: center;
		padding: 1.5rem 0;
	}
	.reg-check {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		background: var(--bs-secondary, #a28c6a);
		color: #fff;
		font-size: 1.75rem;
		line-height: 3.5rem;
		margin: 0 auto 1rem;
	}
	.reg-done h2 {
		font-family: var(--bs-font-serif, 'Lora'), serif;
	}
</style>
