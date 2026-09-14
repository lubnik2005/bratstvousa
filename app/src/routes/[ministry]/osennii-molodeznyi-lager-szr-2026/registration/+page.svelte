<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import type { PageData, ActionData } from './$types';

	let turnstile: Turnstile | undefined;

	export let data: PageData;
	export let form: ActionData;

	// ---- Camp rules + external consent form (YoungLife Cognito) ----
	// Browser-only gating: the two required checkboxes are only enabled after
	// the registrant submits the external consent form and reads the rules.
	const CONSENT_URL =
		'https://www.cognitoforms.com/YoungLife21/guestconsentreleaseformforoutsidegroupsusingyounglifecamp';
	const COGNITO_KEY = 'spO9ZCOVtkyDOX-2IFxCZw';
	const COGNITO_FORM_ID = '279';
	const COGNITO_EMBED_SRC = 'https://www.cognitoforms.com/f/seamless.js';

	const CONSENT_SUBMITTED_KEY = 'camp2026_consent_submitted';
	const RULES_ACK_KEY = 'camp2026_rules_ack';

	let didSubmitConsent = false;
	let didAckRules = false;
	let showConsentModal = false;
	let showRulesModal = false;
	let embedError = '';
	let consentGateError = '';
	let consentApi: unknown = null;
	let consentForm: { on: (event: string, cb: (e: { entryId?: string }) => void) => void } | null =
		null;

	onMount(() => {
		// Each visit must start fresh: a page refresh should NOT keep the consent
		// and rules checkboxes selected. Clear any previously persisted flags so
		// the user re-confirms consent + rules on every load.
		didSubmitConsent = false;
		didAckRules = false;
		try {
			localStorage.removeItem(CONSENT_SUBMITTED_KEY);
			localStorage.removeItem(RULES_ACK_KEY);
		} catch {
			// ignore storage errors (e.g. privacy mode)
		}
	});

	function loadCognitoScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if ((window as unknown as { Cognito?: unknown }).Cognito) {
				resolve();
				return;
			}
			const s = document.createElement('script');
			s.src = COGNITO_EMBED_SRC;
			s.async = true;
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('Не удалось загрузить форму Cognito.'));
			document.head.appendChild(s);
		});
	}

	async function openConsentModal() {
		embedError = '';
		showConsentModal = true;
		try {
			await loadCognitoScript();
			const Cognito = (
				window as unknown as {
					Cognito: (key: string) => { mount: (id: string, sel: string) => typeof consentForm };
				}
			).Cognito;
			consentApi = Cognito(COGNITO_KEY);
			consentForm = (
				consentApi as { mount: (id: string, sel: string) => typeof consentForm }
			).mount(COGNITO_FORM_ID, '#consent-form-container');

			consentForm?.on('afterSubmit', (e: { entryId?: string }) => {
				didSubmitConsent = true;
				localStorage.setItem(CONSENT_SUBMITTED_KEY, '1');

				const chk = document.getElementById('consent_form') as HTMLInputElement | null;
				if (chk) chk.checked = true;

				let hidden = document.getElementById('consent_entry_id') as HTMLInputElement | null;
				if (!hidden) {
					hidden = document.createElement('input');
					hidden.type = 'hidden';
					hidden.name = 'consent_entry_id';
					hidden.id = 'consent_entry_id';
					document.querySelector('form')?.appendChild(hidden);
				}
				hidden.value = e?.entryId ?? '';

				showConsentModal = false;
			});
		} catch (err) {
			embedError = err instanceof Error ? err.message : 'Не удалось загрузить встраиваемую форму.';
			window.open(CONSENT_URL, '_blank', 'noopener');
		}
	}

	function openRulesModal() {
		showRulesModal = true;
	}

	function acknowledgeRules() {
		didAckRules = true;
		try {
			localStorage.setItem(RULES_ACK_KEY, '1');
		} catch {
			/* localStorage unavailable — non-fatal */
		}
		const chk = document.getElementById('consent_rules') as HTMLInputElement | null;
		if (chk) chk.checked = true;
		showRulesModal = false;
	}

	function confirmConsentAlreadyFilled() {
		didSubmitConsent = true;
		try {
			localStorage.setItem(CONSENT_SUBMITTED_KEY, '1');
		} catch {
			/* localStorage unavailable — non-fatal */
		}
		const chk = document.getElementById('consent_form') as HTMLInputElement | null;
		if (chk) chk.checked = true;
		showConsentModal = false;
	}

	function onKeydownModal(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			showConsentModal = false;
			showRulesModal = false;
		}
	}

	$: errors = (form?.form && 'errors' in form.form ? form.form.errors : {}) as Record<
		string,
		string
	>;
	$: values = (form?.form && 'fields' in form.form ? form.form.fields : {}) as Record<
		string,
		string
	>;

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
		? data.churches.filter((c) => c.label.toLowerCase().includes(churchQuery.trim().toLowerCase()))
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
	<title>Регистрация — Осенний молодежный лагерь СЗР</title>
</svelte:head>

<section class="reg-hero">
	<p class="reg-eyebrow">Северо-Западный регион · 2026</p>
	<h1 class="reg-title">Регистрация на лагерь</h1>
	<p class="reg-sub">Осенний молодежный лагерь СЗР · 15–18 октября 2026</p>
</section>

<div class="container-xxl py-6">
	<div class="container">
		<div class="reg-shell mx-auto">
			<ol class="reg-steps">
				<li class:active={!form?.registered} class:done={form?.registered}>1. Данные</li>
				<li class:active={form?.registered}>2. Готово</li>
			</ol>

			{#if !form?.registered}
				<!-- STEP 1: registration form -->
				<form
					method="post"
					use:enhance={({ cancel }) => {
						// Defensive guard: never submit unless both required
						// acknowledgements are complete (disabled/required checkboxes
						// alone don't reliably block submission).
						if (!didSubmitConsent || !didAckRules) {
							cancel();
							consentGateError =
								'Пожалуйста, заполните форму согласия YoungLife и подтвердите правила лагеря.';
							return;
						}
						consentGateError = '';
						return async ({ update }) => {
							await update();
							turnstile?.reset();
						};
					}}
				>
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
							<input
								class="form-control"
								id="firstName"
								name="firstName"
								value={values.firstName ?? ''}
							/>
							{#if errors.firstName}<div class="field-error">{errors.firstName}</div>{/if}
						</div>
						<div class="field">
							<label class="form-label" for="lastName">Фамилия</label>
							<input
								class="form-control"
								id="lastName"
								name="lastName"
								value={values.lastName ?? ''}
							/>
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
							<input
								class="form-control"
								id="email"
								name="email"
								type="email"
								value={values.email ?? ''}
							/>
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
						<p class="field-note">
							Не из нашего региона? Напишите нам на
							<a href="mailto:youth@bratstvousa.com">youth@bratstvousa.com</a>, чтобы связаться с
							нами по поводу участия, и выберите <strong>Vadym Neyman</strong> в качестве ответственного.
						</p>
					</div>

					<!-- Steps before submitting: external consent form + camp rules -->
					<div class="prep">
						<p class="prep-title">Перед отправкой</p>

						<div class="prep-step">
							<button type="button" class="btn btn-success prep-btn" on:click={openConsentModal}>
								1) Заполнить форму согласия YoungLife
							</button>
							{#if didSubmitConsent}
								<span class="prep-badge done">Отправлено ✓</span>
							{/if}
							<p class="prep-help">
								Внешняя форма согласия YoungLife. Заполните и отправьте её, затем вернитесь сюда.
								<br />Примечание: внешняя форма может отображать прошлый год — это нормально,
								заполните её как есть.
								{#if embedError}
									<br />Если форма не открылась,
									<a href={CONSENT_URL} target="_blank" rel="noopener">откройте по ссылке</a>.
								{/if}
							</p>
						</div>

						<div class="prep-step">
							<button
								type="button"
								class="btn btn-outline-secondary prep-btn"
								on:click={openRulesModal}
							>
								2) Прочитать правила лагеря
							</button>
							{#if didAckRules}
								<span class="prep-badge done">Подтверждено ✓</span>
							{/if}
							<p class="prep-help">Ознакомьтесь с правилами лагеря и подтвердите прочтение.</p>
						</div>

						<label class="prep-check">
							<input
								type="checkbox"
								id="consent_form"
								name="consent_form"
								required
								checked={didSubmitConsent}
								on:click|preventDefault={openConsentModal}
							/>
							<span>
								Я заполнил(а) форму согласия YoungLife (<button
									type="button"
									class="btn-link"
									on:click={openConsentModal}>открыть</button
								>)
							</span>
						</label>

						<label class="prep-check">
							<input
								type="checkbox"
								id="consent_rules"
								name="consent_rules"
								required
								checked={didAckRules}
								on:click|preventDefault={openRulesModal}
							/>
							<span>
								Я прочитал(а) и согласен(на) с правилами лагеря (<button
									type="button"
									class="btn-link"
									on:click={openRulesModal}>открыть</button
								>)
							</span>
						</label>
					</div>

					{#if consentGateError}
						<p class="consent-gate-error">{consentGateError}</p>
					{/if}

					<div class="my-3">
						<Turnstile bind:this={turnstile} action="camp_2026" />
					</div>

					<button
						class="btn btn-primary reg-submit"
						type="submit"
						disabled={!didSubmitConsent || !didAckRules}
					>
						Отправить заявку
					</button>
					<p class="reg-privacy">
						Отправляя форму, вы соглашаетесь с
						<a href="/youth-ministry/osennii-molodeznyi-lager-szr-2026/privacy"
							>политикой конфиденциальности лагеря</a
						>. Ваши данные никогда не будут проданы.
					</p>
				</form>
			{:else}
				<!-- STEP 2: submitted -->
				<div class="reg-done">
					<div class="reg-check">✓</div>
					<h2>Заявка отправлена</h2>
					<p>
						Спасибо, <strong>{form.name}</strong>! Ваша заявка отправлена ответственному за молодежь
						на подтверждение.
					</p>

					{#if form.confirmationCode}
						<div class="reg-code">
							<span class="reg-code-label">Ваш регистрационный код</span>
							<span class="reg-code-value">{form.confirmationCode}</span>
						</div>
					{/if}

					<p class="reg-next">
						Как только заявку одобрят, вы получите ещё одно письмо со ссылкой для завершения
						регистрации и оплаты. Сохраните код выше — он понадобится при оплате.
					</p>

					<p class="reg-next">Спасибо за подтверждение правил и заполнение формы согласия.</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- CONSENT MODAL (YoungLife Cognito embed) -->
{#if showConsentModal}
	<div class="modal-backdrop show"></div>
	<div
		class="modal d-block"
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-labelledby="consentModalTitle"
		on:keydown={onKeydownModal}
	>
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 id="consentModalTitle" class="modal-title">Форма согласия YoungLife</h5>
					<button
						type="button"
						class="btn-close"
						aria-label="Закрыть"
						on:click={() => (showConsentModal = false)}
					></button>
				</div>
				<div class="modal-body">
					<div id="consent-form-container"><!-- Cognito mounts here --></div>
					<div class="form-text mt-3">
						Если форма не отображается, можно открыть её
						<a href={CONSENT_URL} target="_blank" rel="noopener">по ссылке</a>.
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-outline-secondary"
						on:click={confirmConsentAlreadyFilled}
					>
						Я уже заполнил(а) форму
					</button>
					<button type="button" class="btn btn-light" on:click={() => (showConsentModal = false)}>
						Закрыть
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- RULES MODAL -->
{#if showRulesModal}
	<div class="modal-backdrop show"></div>
	<div
		class="modal d-block"
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-labelledby="rulesModalTitle"
		on:keydown={onKeydownModal}
	>
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 id="rulesModalTitle" class="modal-title">Правила лагеря</h5>
					<button
						type="button"
						class="btn-close"
						aria-label="Закрыть"
						on:click={() => (showRulesModal = false)}
					></button>
				</div>
				<div class="modal-body">
					<p class="text-muted">
						Осенний молодежный лагерь СЗР • <strong>15–18 октября 2026</strong>
					</p>

					<article>
						<h2 class="h5 mb-3">Общие положения</h2>
						<ul class="rules-list">
							<li>
								Участниками лагеря могут быть юноши и девушки молодёжного возраста, ведущие
								христианский образ жизни.
							</li>
							<li>Присутствие в лагере должно быть согласовано с руководством церкви.</li>
							<li>Участники должны находиться в лагере весь период, от начала до конца.</li>
							<li>
								<strong>Важно!</strong> Всем участникам необходимо пройти предварительную регистрацию
								и оплатить стоимость пребывания.
							</li>
							<li>
								Все присутствующие должны иметь с собой Библию, письменные принадлежности, средства
								личной гигиены, тёплую одежду и спальные принадлежности.
							</li>
							<li>
								Участники обязаны посещать все обязательные мероприятия и соблюдать распорядок дня.
							</li>
							<li>Перед выездом необходимо привести в порядок место проживания и территорию.</li>
							<li>Участники обязаны уважительно относиться друг к другу и к сотрудникам лагеря.</li>
							<li>
								Каждый присутствующий должен выполнять распоряжения службы охраны, связанные с
								безопасностью, дисциплиной и порядком в лагере.
							</li>
							<li>Руководство лагеря не несёт ответственности за утерянные вещи и ценности.</li>
						</ul>

						<hr class="my-4" />

						<h2 class="h5 mb-3">Строго запрещается</h2>
						<ul class="rules-list">
							<li>
								Ввозить, хранить и употреблять спиртные напитки, наркотические и курительные
								средства.
							</li>
							<li>Привозить, хранить или использовать любое оружие.</li>
							<li>
								Самовольно покидать территорию лагеря без уведомления руководства или ответственного
								за молодёжную группу.
							</li>
							<li>Наносить материальный ущерб лагерю или имуществу других участников.</li>
						</ul>

						<hr class="my-4" />

						<h2 class="h5 mb-3">Внешний вид</h2>
						<ul class="rules-list">
							<li>Причёска, одежда и обувь должны соответствовать христианским нормам.</li>
							<li>Братьям следует одеваться скромно, избегая маек, шортов и обтягивающих брюк.</li>
							<li>
								Сёстры не должны использовать косметику, носить брюки, обтягивающую, прозрачную и
								короткую одежду, а также иметь распущенные волосы.
							</li>
						</ul>

						<div class="alert alert-warning mt-4" role="alert">
							Соблюдение правил обязательно для всех участников. Несоблюдение может привести к
							ограничению участия в мероприятиях или досрочному выезду из лагеря.
						</div>
					</article>
				</div>

				<div class="modal-footer">
					<button class="btn btn-outline-secondary" on:click={() => (showRulesModal = false)}
						>Закрыть</button
					>
					<button class="btn btn-primary" on:click={acknowledgeRules}>
						Я прочитал(а) правила
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

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
	.field-note {
		font-size: 0.85rem;
		color: #55606a;
		margin: 0.5rem 0 0;
		line-height: 1.4;
	}
	.consent-gate-error {
		color: #b02a37;
		font-size: 0.9rem;
		margin: 0 0 0.75rem;
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
	.reg-code {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		margin: 1.5rem auto;
		padding: 1rem 2rem;
		border: 1px dashed var(--bs-secondary, #a28c6a);
		background: var(--bs-paper-sunk, #efe9df);
	}
	.reg-code-label {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.72rem;
		color: var(--bs-ink-muted, #736a5f);
	}
	.reg-code-value {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--bs-primary, #5a4a42);
	}
	.reg-next {
		color: var(--bs-ink-muted, #736a5f);
		font-size: 0.92rem;
		max-width: 32rem;
		margin: 0 auto;
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

	/* ---- Prep steps (consent + rules) ---- */
	.prep {
		border: 1px solid var(--bs-rule, #ddd5c8);
		background: var(--bs-paper-sunk, #efe9df);
		padding: 1.25rem;
		margin: 1.5rem 0;
	}
	.prep-title {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.78rem;
		color: var(--bs-ink-muted, #736a5f);
		margin: 0 0 0.75rem;
	}
	.prep-step {
		margin-bottom: 1rem;
	}
	.prep-btn {
		margin-right: 0.5rem;
	}
	.prep-badge.done {
		display: inline-block;
		color: #0f5132;
		background: #d1e7dd;
		border-radius: 0.25rem;
		padding: 0.15rem 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
	}
	.prep-help {
		font-size: 0.82rem;
		color: var(--bs-ink-muted, #736a5f);
		margin: 0.4rem 0 0;
	}
	.prep-check {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
		margin-top: 0.75rem;
		font-size: 0.9rem;
	}
	.prep-check input {
		margin-top: 0.2rem;
	}
	.btn-link {
		background: none;
		border: 0;
		padding: 0;
		color: var(--bs-primary, #5a4a42);
		text-decoration: underline;
		cursor: pointer;
		font: inherit;
	}

	/* ---- Modals (blend with Bootstrap) ---- */
	.rules-list {
		padding-left: 1.25rem;
	}
	.rules-list li + li {
		margin-top: 0.4rem;
	}
	.modal-backdrop.show {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		opacity: 1;
		z-index: 1050;
	}
	.modal.d-block {
		position: fixed;
		inset: 0;
		z-index: 1060;
		display: block;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.modal-dialog {
		max-width: min(1200px, 96vw);
		margin: 2rem auto;
	}
	.modal-content {
		background: #fff;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
	}
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	.modal-body {
		padding: 1rem 1.25rem;
	}
	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}
	.btn-close {
		background: transparent;
		border: 0;
		width: 1.5em;
		height: 1.5em;
		opacity: 0.5;
		cursor: pointer;
	}
	.btn-close::before {
		content: '×';
		font-size: 1.5rem;
		line-height: 1;
	}
	.btn-close:hover {
		opacity: 0.75;
	}
</style>
