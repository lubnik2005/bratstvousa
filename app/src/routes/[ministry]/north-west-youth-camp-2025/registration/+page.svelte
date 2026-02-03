<!-- src/routes/[ministry]/north-west-youth-camp-2025/registration/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let data;
	export let form: any = {};

	/*** Content & constants ***/
	const EVENT_TITLE = 'Христианский молодёжный лагерь — СЗР';
	const EVENT_DATES = '16–19 октября 2025 г.';
	const CAMP_COST = '$350';
	const CAMP_ADDRESS = '1 Muddy Rd, Antelope, OR 97001';

	const CASHAPP = '$TIM0XA';
	const ZELLE = 'gyouth5116@bratstvousa.com';

	// External consent form as embed (Cognito)
	const CONSENT_URL =
		'https://www.cognitoforms.com/YoungLife21/guestconsentreleaseformforoutsidegroupsusingyounglifecamp';
	const COGNITO_KEY = 'spO9ZCOVtkyDOX-2IFxCZw'; // from the page you shared
	const COGNITO_FORM_ID = '279'; // from the page you shared
	const COGNITO_EMBED_SRC = 'https://www.cognitoforms.com/f/seamless.js';

	/*** Local storage keys ***/
	const CONSENT_SUBMITTED_KEY = 'camp2025_consent_submitted'; // only after actual submit
	const RULES_ACK_KEY = 'camp2025_rules_ack'; // after “I read”

	/*** Clipboard helper ***/
	let copied: string | null = null;
	const copy = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text);
			copied = label;
			setTimeout(() => (copied = null), 1500);
		} catch {
			alert('Не удалось скопировать — пожалуйста, скопируйте вручную.');
		}
	};

	/*** SvelteKit enhance state ***/
	let f: any;
	$: f = form ?? data?.form ?? {};

	let submitting = false;
	const onEnhance = () => {
		submitting = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			submitting = false;
			await update();
		};
	};

	/*** Step gating state ***/
	let didSubmitConsent = false; // true only after Cognito afterSubmit
	let didAckRules = false; // true only after user presses “I read” in the rules modal

	/*** Modals ***/
	let showConsentModal = false;
	let showRulesModal = false;

	/*** Cognito embed handles ***/
	let embedError = '';
	let consentApi: any = null;
	let consentForm: any = null;

	onMount(() => {
		// Restore persisted completion
		didSubmitConsent = localStorage.getItem(CONSENT_SUBMITTED_KEY) === '1';
		didAckRules = localStorage.getItem(RULES_ACK_KEY) === '1';
	});

	/*** Load Cognito embed script once ***/
	function loadCognitoScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if ((window as any).Cognito) {
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

	/*** Open Consent modal & mount Cognito form ***/
	async function openConsentModal() {
		embedError = '';
		showConsentModal = true;
		try {
			await loadCognitoScript();
			const Cognito = (window as any).Cognito;
			consentApi = Cognito(COGNITO_KEY);
			consentForm = consentApi.mount(COGNITO_FORM_ID, '#consent-form-container');

			// Optional: prefill with fields from our page (adjust field names to match Cognito if needed)
			// consentForm.prefill({
			//   "First Name": f?.fields?.firstName ?? "",
			//   "Last Name": f?.fields?.lastName ?? "",
			//   "Email": f?.fields?.email ?? "",
			//   "Phone": f?.fields?.phone ?? ""
			// });

			// Unlock only after real submit on the Cognito side
			consentForm.on('afterSubmit', (e: any) => {
				didSubmitConsent = true;
				localStorage.setItem(CONSENT_SUBMITTED_KEY, '1');

				// Auto-check checkbox in case it's visible
				const chk = document.getElementById('consent_form') as HTMLInputElement | null;
				if (chk) chk.checked = true;

				// Hidden input for backend reconciliation
				let hidden = document.getElementById('consent_entry_id') as HTMLInputElement | null;
				if (!hidden) {
					hidden = document.createElement('input');
					hidden.type = 'hidden';
					hidden.name = 'consent_entry_id';
					hidden.id = 'consent_entry_id';
					document.querySelector('form')!.appendChild(hidden);
				}
				hidden.value = e?.entryId ?? '';

				showConsentModal = false;
			});
		} catch (err: any) {
			embedError = err?.message ?? 'Не удалось загрузить встраиваемую форму.';
			// Fallback: open in a new tab
			window.open(CONSENT_URL, '_blank', 'noopener');
		}
	}

	/*** Rules modal handlers ***/
	function openRulesModal() {
		showRulesModal = true;
	}
	function acknowledgeRules() {
		didAckRules = true;
		try {
			localStorage.setItem(RULES_ACK_KEY, '1');
		} catch {}
		// Auto-check if present
		const chk = document.getElementById('consent_rules') as HTMLInputElement | null;
		if (chk) chk.checked = true;
		showRulesModal = false;
	}

	/*** Accessibility: close modals on ESC ***/
	function onKeydownModal(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			showConsentModal = false;
			showRulesModal = false;
		}
	}

	const mediaUrl = data.media_url;
	const title = 'Молодёжный Лагерь СЗР АО 2025 | Регистрация';
	const description =
		'Американское Объединение МСЦ ЕХБ. Молодёжный Лагерь СЗР АО • 16–19 октября, 2025.';

	// Build a safe hero image src
	const heroSrc = `${mediaUrl}upfiles/page/north-west-youth-camp-2025-200.png`;
</script>

<svelte:head>
	<title>Регистрация на лагерь 2025</title>
	<meta name="description" content="Молодёжный Лагерь СЗР АО 2025 | Регистрация" />

	<meta property="og:title" content={title} />
	{#if heroSrc}
		<meta property="og:image" content={heroSrc} />
	{/if}
	<meta property="og:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:type" content="article" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content="Американское Объединение МСЦ ЕХБ" />
	{#if heroSrc}
		<meta name="twitter:image" content={heroSrc} />
	{/if}
	<meta property="og:site_name" content="Bratstvo USA" />
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container-xxl pb-6">
	<div class="container">
		<div class="section-header mx-auto mt-5 text-center" style="max-width: 1000px;">
			<header class="mb-4 text-center">
				<h1 class="display-6">Лагерь 2025 — Регистрация</h1>
				<p class="text-muted">
					{EVENT_TITLE} • <strong>{EVENT_DATES}</strong>
				</p>
				<p class="text-muted">
					Пожалуйста, выполните шаги ниже. Мы отправим вам письмо, когда
					<strong>вручную подтвердим вашу оплату</strong>.
				</p>
			</header>
		</div>

		<!-- Информация о лагере: стоимость и адрес -->
		<section class="card mb-4 border-0 shadow-sm">
			<div class="card-body text-center">
				<h2 class="h5 mb-3">Информация о лагере</h2>
				<p class="fs-5 mb-2"><strong>Стоимость участия:</strong> {CAMP_COST}</p>
				<p class="mb-0">
					<strong>Адрес:</strong><br />
					<a
						href={'https://maps.google.com/?q=' + encodeURIComponent(CAMP_ADDRESS)}
						target="_blank"
						rel="noopener"
					>
						{CAMP_ADDRESS}
					</a>
				</p>
			</div>
		</section>

		<!-- Способы оплаты -->
		<section class="card mb-4 border-0 shadow-sm">
			<div class="card-body">
				<h2 class="h5 mb-3">Способы оплаты</h2>
				<div class="row g-3 align-items-center">
					<div class="col-md-6">
						<div class="d-flex align-items-center gap-3">
							<div class="payicon cashapp" aria-hidden="true">S</div>
							<div>
								<div class="fw-semibold">Cash App</div>
								<div class="mono">{CASHAPP}</div>
								<div class="small text-muted">
									Отправьте {CAMP_COST} с примечанием <code>camp2025-YOURNAME</code>.
								</div>
							</div>
							<button
								type="button"
								class="btn btn-sm btn-outline-secondary ms-auto"
								on:click={() => copy(CASHAPP, 'cashapp')}
								aria-label="Скопировать идентификатор Cash App"
							>
								Копировать
							</button>
						</div>
					</div>

					<div class="col-md-6">
						<div class="d-flex align-items-center gap-3">
							<div class="payicon zelle" aria-hidden="true">Z</div>
							<div>
								<div class="fw-semibold">Zelle</div>
								<div class="mono">{ZELLE}</div>
								<div class="small text-muted">
									Отправьте {CAMP_COST} с примечанием <code>camp2025-YOURNAME</code>.
								</div>
							</div>
							<button
								type="button"
								class="btn btn-sm btn-outline-secondary ms-auto"
								on:click={() => copy(ZELLE, 'zelle')}
								aria-label="Скопировать email Zelle"
							>
								Копировать
							</button>
						</div>
					</div>
				</div>

				<div class="small text-muted mt-3">
					<strong>Примечание к платежу:</strong> <code>camp2025-YOURNAME</code>
					{#if copied}
						<span class="badge bg-success ms-2">Скопировано: {copied} ✓</span>
					{/if}
				</div>
			</div>
		</section>

		<!-- Шаги перед отправкой: большие кнопки -->
		<section class="card mb-4 border-0 shadow-sm">
			<div class="card-body">
				<h2 class="h5 mb-3">Шаги перед отправкой</h2>

				<div class="row g-3">
					<!-- Consent: modal + embed -->
					<div class="col-md-6">
						<a
							class="btn btn-success btn-lg w-100"
							href={CONSENT_URL}
							target="_blank"
							rel="noopener"
							on:click|preventDefault={openConsentModal}
							aria-describedby="consent-desc"
						>
							1) Заполнить форму согласия YoungLife
						</a>
						<div id="consent-desc" class="form-text mt-2">
							Форма откроется во всплывающем окне. После успешной отправки чекбокс ниже станет
							активным.
							{#if didSubmitConsent}
								<span class="badge bg-success ms-1 align-middle">Отправлено ✓</span>
							{/if}
							{#if embedError}
								<div class="text-danger mt-1">
									{embedError} —
									<a href={CONSENT_URL} target="_blank" rel="noopener">открыть в новой вкладке</a>.
								</div>
							{/if}
						</div>
					</div>

					<!-- Rules: modal with full content -->
					<div class="col-md-6">
						<button
							type="button"
							class="btn btn-outline-primary btn-lg w-100"
							on:click={openRulesModal}
							aria-describedby="rules-desc"
						>
							2) Прочитать правила лагеря
						</button>
						<div id="rules-desc" class="form-text mt-2">
							Правила откроются во всплывающем окне. После подтверждения чекбокс ниже станет
							активным.
							{#if didAckRules}
								<span class="badge bg-success ms-1 align-middle">Подтверждено ✓</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Форма регистрации -->
		<form method="POST" use:enhance={onEnhance} class="card border-0 shadow-sm">
			<div class="card-body">
				<h2 class="h5 mb-3">Ваши данные</h2>

				<!-- Ханипот -->
				<div class="visually-hidden" aria-hidden="true">
					<label>
						Не заполняйте это поле
						<input name="middle_name" autocomplete="off" />
					</label>
				</div>

				<div class="row g-3">
					<div class="col-md-6">
						<label class="form-label">Имя *</label>
						<input
							class="form-control"
							name="firstName"
							required
							placeholder="Имя"
							value={f?.fields?.firstName ?? ''}
						/>
						{#if f?.errors?.firstName}
							<div class="invalid d-block">{f.errors.firstName}</div>
						{/if}
					</div>

					<div class="col-md-6">
						<label class="form-label">Фамилия *</label>
						<input
							class="form-control"
							name="lastName"
							required
							placeholder="Фамилия"
							value={f?.fields?.lastName ?? ''}
						/>
						{#if f?.errors?.lastName}
							<div class="invalid d-block">{f.errors.lastName}</div>
						{/if}
					</div>

					<div class="col-md-6">
						<label class="form-label">Телефон *</label>
						<input
							class="form-control"
							name="phone"
							type="tel"
							inputmode="tel"
							required
							placeholder="(###) ###-####"
							value={f?.fields?.phone ?? ''}
						/>
						{#if f?.errors?.phone}
							<div class="invalid d-block">{f.errors.phone}</div>
						{/if}
					</div>

					<div class="col-md-6">
						<label class="form-label">Эл. почта *</label>
						<input
							class="form-control"
							name="email"
							type="email"
							required
							placeholder="you@example.com"
							value={f?.fields?.email ?? ''}
						/>
						{#if f?.errors?.email}
							<div class="invalid d-block">{f.errors.email}</div>
						{/if}
					</div>

					<div class="col-md-6">
						<label class="form-label">Церковь *</label>
						<input
							class="form-control"
							name="church"
							required
							placeholder="например, GSBC"
							value={f?.fields?.church ?? ''}
						/>
					</div>

					<div class="col-md-6">
						<label class="form-label">Контакт на случай ЧС (необязательно)</label>
						<input
							class="form-control"
							name="emergency"
							placeholder="Имя и телефон"
							value={f?.fields?.emergency ?? ''}
						/>
					</div>

					<div class="col-12">
						<label class="form-label">Примечания (необязательно)</label>
						<textarea
							class="form-control"
							name="notes"
							rows="3"
							placeholder="Аллергии, питание и т.д.">{f?.fields?.notes ?? ''}</textarea
						>
					</div>
				</div>

				<hr class="my-4" />

				<h2 class="h6 mb-3">Обязательные шаги</h2>

				<!-- CONSENT CHECK: disabled until actual submission -->
				<div class="form-check mb-2">
					<input
						class="form-check-input"
						type="checkbox"
						id="consent_form"
						name="consent_form"
						required
						disabled={!didSubmitConsent}
						title={!didSubmitConsent
							? 'Сначала заполните и отправьте форму согласия (кнопка выше)'
							: undefined}
						aria-describedby="consent-form-help"
					/>
					<label
						class={'form-check-label' + (!didSubmitConsent ? ' text-muted' : '')}
						for="consent_form"
					>
						Я заполнил(а) и отправил(а)
						<button
							type="button"
							class="btn btn-link p-0 align-baseline"
							on:click={openConsentModal}
						>
							форму согласия YoungLife (Guest Consent & Release)
						</button>.
					</label>
					<div id="consent-form-help" class="form-text">
						{#if !didSubmitConsent}
							Чекбокс станет активным после успешной отправки формы согласия.
						{:else}
							Спасибо! Форма согласия получена.
						{/if}
					</div>
					{#if f?.errors?.consent_form}
						<div class="invalid d-block">{f.errors.consent_form}</div>
					{/if}
				</div>

				<!-- RULES CHECK: disabled until acknowledged in modal -->
				<div class="form-check mb-2">
					<input
						class="form-check-input"
						type="checkbox"
						id="consent_rules"
						name="consent_rules"
						required
						disabled={!didAckRules}
						title={!didAckRules
							? 'Сначала откройте и подтвердите ознакомление с правилами'
							: undefined}
						aria-describedby="rules-help"
					/>
					<label
						class={'form-check-label' + (!didAckRules ? ' text-muted' : '')}
						for="consent_rules"
					>
						Я прочитал(а) и согласен(на) с
						<button type="button" class="btn btn-link p-0 align-baseline" on:click={openRulesModal}>
							правилами лагеря
						</button>.
					</label>
					<div id="rules-help" class="form-text">
						{#if !didAckRules}
							Чекбокс станет активным после подтверждения в окне с правилами.
						{:else}
							Спасибо! Вы подтвердили ознакомление с правилами.
						{/if}
					</div>
					{#if f?.errors?.consent_rules}
						<div class="invalid d-block">{f.errors.consent_rules}</div>
					{/if}
				</div>

				<!-- PAID CHECK -->
				<div class="form-check mb-3">
					<input
						class="form-check-input"
						type="checkbox"
						id="paid"
						name="paid"
						required
						checked={f?.fields?.paid === 'on'}
					/>
					<label class="form-check-label" for="paid">
						Я произвёл(а) оплату {CAMP_COST} с примечанием <code>camp2025-YOURNAME</code>.
					</label>
					{#if f?.errors?.paid}
						<div class="invalid d-block">{f.errors.paid}</div>
					{/if}
				</div>

				<button class="btn btn-primary btn-lg" type="submit" disabled={submitting}>
					{submitting ? 'Отправка...' : 'Отправить регистрацию'}
				</button>

				{#if f?.message}
					<div class="alert alert-success mt-3">{f.message}</div>
				{/if}

				{#if f?.formError}
					<div class="alert alert-danger mt-3">{f.formError}</div>
				{/if}

				<p class="small text-muted mt-3">
					Мы повторно свяжемся с вами по электронной почте после
					<strong>ручного</strong> подтверждения оплаты.
				</p>
			</div>
		</form>

		<footer class="small text-muted my-4">
			Нужна помощь? Напишите на <a href={'mailto:' + ZELLE}>{ZELLE}</a>.
		</footer>
	</div>
</div>

<!-- CONSENT MODAL -->
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
					/>
				</div>
				<div class="modal-body">
					<div id="consent-form-container"><!-- Cognito mounts here --></div>
					<div class="form-text mt-3">
						Если форма не отображается, можно открыть её
						<a href={CONSENT_URL} target="_blank" rel="noopener">по ссылке</a>.
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- RULES MODAL (inline content) -->
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
					/>
				</div>
				<div class="modal-body">
					<p class="text-muted">{EVENT_TITLE} • <strong>{EVENT_DATES}</strong></p>

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
	.mono {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
	}
	.invalid {
		color: var(--bs-danger, #dc3545);
	}

	.payicon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		color: #fff;
	}
	.payicon.cashapp {
		background: #00c244;
	}
	.payicon.zelle {
		background: #6c3df4;
	}

	.rules-list {
		padding-left: 1.25rem;
	}
	.rules-list li + li {
		margin-top: 0.4rem;
	}

	/* Minimal modal visuals to blend with Bootstrap */
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
	}
	.modal-content {
		background: #fff;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
	}
	.modal-header {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	.modal-body {
		padding: 1rem 1.25rem;
	}
	.modal-footer {
		padding: 0.75rem 1.25rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}
	.btn-close {
		background: transparent;
		border: 0;
		width: 1em;
		height: 1em;
		opacity: 0.5;
		cursor: pointer;
	}
	.btn-close:hover {
		opacity: 0.75;
	}

	@media print {
		nav,
		.btn,
		.alert,
		.modal,
		.modal-backdrop {
			display: none !important;
		}
		.card {
			box-shadow: none !important;
			border: none !important;
		}
		body {
			color: #000;
		}
	}
</style>
