<!-- src/routes/[ministry]/youth-leaders-seminar-ao-2026/registration/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	export let form: any = {};

	/*** Content & constants ***/
	const EVENT_TITLE = 'Семинар руководителей молодежи АО 2026';
	const EVENT_DATES = '12–15 марта 2026 г.';
	const SEMINAR_COST = '$200';
	const SEMINAR_LOCATION = 'WA, Havilah Retreat Center';

	const ZELLE = 'gyouth5116@bratstvousa.com';

	/*** Clipboard helper ***/
	let copied = false;
	const copy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			alert('Не удалось скопировать — пожалуйста, скопируйте вручную.');
		}
	};

	/*** SvelteKit enhance state ***/
	let f: any;
	$: f = form ?? {};

	let submitting = false;
	const onEnhance = () => {
		submitting = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			submitting = false;
			await update();
		};
	};

	/*** Role selection logic ***/
	let roleValue = f?.fields?.role ?? '';
	$: roleIsOther = roleValue === 'other';

	/*** Church selection logic ***/
	let churchValue = f?.fields?.church ?? '';
	let churchInputValue = f?.fields?.churchOther ?? '';
	let churchSearchTerm = '';
	let showChurchDropdown = false;
	let selectedChurchName = '';

	// Filtered churches based on search term
	$: filteredChurches =
		data.churches?.filter((church: any) => {
			if (!churchSearchTerm) return true;
			const searchLower = churchSearchTerm.toLowerCase();
			const churchText =
				`${church.name_line_1} ${church.name_line_2 || ''} ${church.address_line_1} ${church.address_line_2 || ''} ${church.city} ${church.state}`.toLowerCase();
			return churchText.includes(searchLower);
		}) || [];

	// Always include "Other" option
	$: churchOptions = [
		...filteredChurches,
		{ id: 'other', name_line_1: 'Другое (ввести вручную)', isOther: true }
	];

	$: churchIsOther = churchValue === 'other';

	function selectChurch(church: any) {
		if (church.isOther) {
			churchValue = 'other';
			selectedChurchName = 'Другое (ввести вручную)';
			churchSearchTerm = '';
		} else {
			churchValue = String(church.id);
			selectedChurchName = `${church.name_line_1} ${church.name_line_2 || ''} (${church.address_line_1})`;
			churchSearchTerm = '';
		}
		showChurchDropdown = false;
	}

	function handleChurchInputFocus() {
		showChurchDropdown = true;
	}

	function handleChurchInputBlur() {
		// Delay to allow click on dropdown item
		setTimeout(() => {
			showChurchDropdown = false;
		}, 200);
	}

	const mediaUrl = data.media_url;
	const title = 'Семинар руководителей молодежи АО 2026 | Регистрация';
	const description =
		'Американское Объединение МСЦ ЕХБ. Семинар руководителей молодежи АО • 12-15 марта 2026.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content="Американское Объединение МСЦ ЕХБ" />
	<meta property="og:site_name" content="Bratstvo USA" />
</svelte:head>

<div class="container-xxl pb-6">
	<div class="container">
		<div class="section-header mx-auto mt-5 text-center" style="max-width: 1000px;">
			<header class="mb-4 text-center">
				<h1 class="display-6">Регистрация на семинар</h1>
				<p class="text-muted">
					{EVENT_TITLE}
				</p>
				<p class="text-muted">
					<strong>{EVENT_DATES}</strong> • {SEMINAR_LOCATION}
				</p>
				<p class="text-muted">
					Пожалуйста, заполните форму ниже. Мы отправим вам письмо, когда
					<strong>вручную подтвердим вашу оплату</strong>.
				</p>
			</header>
		</div>

		<!-- Информация о семинаре: стоимость и адрес -->
		<section class="card mb-4 border-0 shadow-sm">
			<div class="card-body text-center">
				<h2 class="h5 mb-3">Информация о семинаре</h2>
				<p class="fs-5 mb-2"><strong>Стоимость участия:</strong> {SEMINAR_COST}</p>
				<p class="mb-0">
					<strong>Место проведения:</strong><br />
					<a
						href={'https://maps.google.com/?q=' + encodeURIComponent(SEMINAR_LOCATION)}
						target="_blank"
						rel="noopener"
					>
						{SEMINAR_LOCATION}
					</a>
				</p>
			</div>
		</section>

		<!-- Способ оплаты -->
		<section class="card mb-4 border-0 shadow-sm">
			<div class="card-body">
				<h2 class="h5 mb-3">Оплата</h2>
				<div class="d-flex align-items-center gap-3">
					<div class="payicon zelle" aria-hidden="true">Z</div>
					<div class="flex-grow-1">
						<div class="fw-semibold">Zelle</div>
						<div class="mono">{ZELLE}</div>
						<div class="small text-muted">
							Отправьте {SEMINAR_COST} с примечанием <code>seminar2026-YOURNAME</code>.
						</div>
					</div>
					<button
						type="button"
						class="btn btn-sm btn-outline-secondary"
						on:click={() => copy(ZELLE)}
						aria-label="Скопировать email Zelle"
					>
						{copied ? 'Скопировано ✓' : 'Копировать'}
					</button>
				</div>

				<div class="small text-muted mt-3">
					<strong>Примечание к платежу:</strong> <code>seminar2026-YOURNAME</code>
					<br />
					Например: <code>seminar2026-IvanPetrov</code>
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
						<input name="middle_name" autocomplete="off" tabindex="-1" />
					</label>
				</div>

				<div class="row g-3">
					<div class="col-md-6">
						<label class="form-label" for="firstName">
							<i class="bi bi-person-fill"></i>
							Имя *
						</label>
						<input
							id="firstName"
							class="form-control"
							name="firstName"
							required
							placeholder="Введите ваше имя"
							value={f?.fields?.firstName ?? ''}
						/>
						{#if f?.errors?.firstName}
							<div class="invalid d-block">{f.errors.firstName}</div>
						{/if}
					</div>

					<div class="col-md-6">
						<label class="form-label" for="lastName">
							<i class="bi bi-person-fill"></i>
							Фамилия *
						</label>
						<input
							id="lastName"
							class="form-control"
							name="lastName"
							required
							placeholder="Введите вашу фамилию"
							value={f?.fields?.lastName ?? ''}
						/>
						{#if f?.errors?.lastName}
							<div class="invalid d-block">{f.errors.lastName}</div>
						{/if}
					</div>

					<div class="col-md-6">
						<label class="form-label" for="phone">
							<i class="bi bi-telephone-fill"></i>
							Телефон *
						</label>
						<input
							id="phone"
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
						<label class="form-label" for="email">
							<i class="bi bi-envelope-fill"></i>
							Эл. почта *
						</label>
						<input
							id="email"
							class="form-control"
							name="email"
							type="email"
							required
							placeholder="your@email.com"
							value={f?.fields?.email ?? ''}
						/>
						{#if f?.errors?.email}
							<div class="invalid d-block">{f.errors.email}</div>
						{/if}
					</div>

					<div class="col-md-6">
						<label class="form-label" for="church-search">
							<i class="bi bi-building"></i>
							Церковь *
						</label>
						<div class="position-relative church-search-wrapper">
							<div class="search-input-container">
								<i class="bi bi-search search-icon"></i>
								<input
									id="church-search"
									class="form-control church-search-input"
									type="text"
									bind:value={churchSearchTerm}
									on:focus={handleChurchInputFocus}
									on:blur={handleChurchInputBlur}
									placeholder={selectedChurchName || 'Начните вводить название церкви...'}
									aria-describedby="church-help"
									autocomplete="off"
								/>
								{#if churchValue && !showChurchDropdown}
									<i class="bi bi-check-circle-fill check-icon"></i>
								{/if}
							</div>
							<input type="hidden" name="church" bind:value={churchValue} required />

							{#if showChurchDropdown && churchOptions.length > 0}
								<div class="dropdown-menu show w-100 church-dropdown">
									{#each churchOptions as church, index}
										<button
											type="button"
											class="dropdown-item church-item"
											class:is-other={church.isOther}
											on:click={() => selectChurch(church)}
											style="animation-delay: {index * 0.02}s"
										>
											{#if church.isOther}
												<div class="d-flex align-items-center gap-2">
													<i class="bi bi-pencil-square text-primary"></i>
													<strong>{church.name_line_1}</strong>
												</div>
											{:else}
												<div class="church-info">
													<div class="church-name">
														<i class="bi bi-building"></i>
														{church.name_line_1}
														{church.name_line_2 || ''}
													</div>
													<div class="church-address">
														<i class="bi bi-geo-alt"></i>
														{church.address_line_1}, {church.city}
													</div>
												</div>
											{/if}
										</button>
									{/each}
								</div>
							{/if}
						</div>
						<div id="church-help" class="form-text">
							<i class="bi bi-info-circle"></i>
							Начните вводить название для поиска. Всегда доступна опция "Другое".
						</div>
						{#if f?.errors?.church}
							<div class="invalid d-block">{f.errors.church}</div>
						{/if}
					</div>

					{#if churchIsOther}
						<div class="col-md-6">
							<label class="form-label" for="churchOther">
								<i class="bi bi-pencil-square"></i>
								Введите название церкви *
							</label>
							<input
								id="churchOther"
								class="form-control"
								name="churchOther"
								required={churchIsOther}
								placeholder="Например: GSBC Sacramento"
								bind:value={churchInputValue}
							/>
							{#if f?.errors?.churchOther}
								<div class="invalid d-block">{f.errors.churchOther}</div>
							{/if}
						</div>
					{/if}

					<div class="col-md-6">
						<label class="form-label" for="role">
							<i class="bi bi-person-badge-fill"></i>
							Твой статус в молодежном служении *
						</label>
						<select
							id="role"
							class="form-select"
							name="role"
							required
							bind:value={roleValue}
							aria-describedby="role-help"
						>
							<option value="">-- Выберите --</option>
							<option value="Молодежный пастор">Молодежный пастор</option>
							<option value="Руководитель молодёжи">Руководитель молодёжи</option>
							<option value="Помощник/член молодежного совета"
								>Помощник/член молодежного совета</option
							>
							<option value="other">Другое</option>
						</select>
						<div id="role-help" class="form-text">
							<i class="bi bi-info-circle"></i>
							Выберите ваш текущий статус в служении.
						</div>
						{#if f?.errors?.role}
							<div class="invalid d-block">{f.errors.role}</div>
						{/if}
					</div>

					{#if roleIsOther}
						<div class="col-12">
							<label class="form-label" for="roleOther">
								<i class="bi bi-pencil-square"></i>
								Укажите ваш статус *
							</label>
							<input
								id="roleOther"
								class="form-control"
								name="roleOther"
								required={roleIsOther}
								placeholder="Например: Координатор молодежного отдела"
								value={f?.fields?.roleOther ?? ''}
							/>
							{#if f?.errors?.roleOther}
								<div class="invalid d-block">{f.errors.roleOther}</div>
							{/if}
						</div>
					{/if}

					<div class="col-12">
						<label class="form-label" for="notes">
							<i class="bi bi-chat-left-text-fill"></i>
							Примечания (необязательно)
						</label>
						<textarea
							id="notes"
							class="form-control"
							name="notes"
							rows="3"
							placeholder="Дополнительная информация, вопросы и т.д."
							>{f?.fields?.notes ?? ''}</textarea
						>
					</div>
				</div>

				<hr class="my-4" />

				<h2 class="h6 mb-3">Подтверждение оплаты</h2>

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
						Я произвёл(а) оплату {SEMINAR_COST} через Zelle с примечанием
						<code>seminar2026-YOURNAME</code>.
					</label>
					{#if f?.errors?.paid}
						<div class="invalid d-block">{f.errors.paid}</div>
					{/if}
				</div>

				<button class="btn btn-primary btn-lg" type="submit" disabled={submitting}>
					{submitting ? 'Отправка...' : 'Отправить регистрацию'}
				</button>

				{#if f?.message}
					<div class="alert alert-success mt-3" role="alert">{f.message}</div>
				{/if}

				{#if f?.formError}
					<div class="alert alert-danger mt-3" role="alert">{f.formError}</div>
				{/if}

				<p class="small text-muted mt-3">
					Мы свяжемся с вами по электронной почте после <strong>ручного</strong> подтверждения оплаты.
				</p>
			</div>
		</form>

		<footer class="small text-muted my-4 text-center">
			Нужна помощь? Напишите на <a href={'mailto:' + ZELLE}>{ZELLE}</a>.
		</footer>
	</div>
</div>

<style>
	/* ===== Modern Form Styling ===== */

	/* Base Utilities */
	.mono {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
	}

	.invalid {
		color: var(--bs-danger, #dc3545);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	/* Container & Layout */
	.container-xxl {
		min-height: 100vh;
		padding-top: 3rem;
		padding-bottom: 4rem;
	}

	/* Cards - Enhanced Shadows & Borders */
	.card {
		border-radius: 1rem !important;
		border: none !important;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
		transition: all 0.3s ease !important;
		overflow: visible !important;
	}

	.card:hover {
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
		transform: translateY(-2px);
	}

	.card-body {
		padding: 2rem !important;
		overflow: visible !important;
	}

	/* Section Headers */
	.section-header h1 {
		font-weight: 700;
		background: linear-gradient(135deg, #5a4a42 0%, #a28c6a 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1rem;
	}

	/* Payment Icon */
	.payicon {
		width: 50px;
		height: 50px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		color: #fff;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(108, 61, 244, 0.3);
	}

	.payicon.zelle {
		background: linear-gradient(135deg, #6c3df4 0%, #8b5cf6 100%);
		font-size: 1.5rem;
	}

	/* Form Inputs - Modern Style with Left Bar */
	.form-control,
	.form-select {
		border: 2px solid #e9ecef;
		border-radius: 0.75rem;
		padding: 0.875rem 1.25rem;
		font-size: 1rem;
		transition: all 0.2s ease;
		position: relative;
		border-left: 3px solid transparent;
		background-clip: padding-box;
	}

	.form-control:hover,
	.form-select:hover {
		border-color: #dee2e6;
		border-left-color: #a28c6a;
	}

	.form-control:focus,
	.form-select:focus {
		border-color: #5a4a42;
		border-left-color: #5a4a42;
		box-shadow: 0 0 0 0.25rem rgba(90, 74, 66, 0.1);
		transform: translateX(2px);
	}

	/* Ensure rows don't clip borders */
	.row {
		overflow: visible;
	}

	.row > * {
		overflow: visible;
	}

	/* Add margin to form controls to prevent clipping */
	.col-md-6,
	.col-12 {
		margin-bottom: 0.5rem;
	}

	.form-label {
		font-weight: 600;
		color: #495057;
		margin-bottom: 0.75rem;
		font-size: 0.95rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.2s ease;
	}

	.form-label i {
		color: #5a4a42;
		font-size: 1.1rem;
	}

	/* Focused label color change */
	.form-control:focus + .form-label,
	.form-select:focus + .form-label {
		color: #5a4a42;
	}

	.form-text {
		font-size: 0.85rem;
		color: #6c757d;
		margin-top: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.form-text i {
		font-size: 0.9rem;
		color: #a28c6a;
	}

	/* Checkbox Styling */
	.form-check-input {
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.1rem;
		border: 2px solid #dee2e6;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.form-check-input:checked {
		background-color: #5a4a42;
		border-color: #5a4a42;
	}

	.form-check-input:focus {
		box-shadow: 0 0 0 0.25rem rgba(90, 74, 66, 0.1);
		border-color: #5a4a42;
	}

	.form-check-label {
		padding-left: 0.5rem;
		color: #495057;
	}

	/* Buttons - Modern Gradient */
	.btn-primary {
		background: linear-gradient(135deg, #5a4a42 0%, #3d332e 100%);
		border: none;
		border-radius: 0.75rem;
		padding: 1rem 2.5rem;
		font-weight: 600;
		font-size: 1.1rem;
		box-shadow: 0 4px 14px rgba(90, 74, 66, 0.3);
		transition: all 0.3s ease;
		text-transform: none;
	}

	.btn-primary:hover:not(:disabled) {
		background: linear-gradient(135deg, #3d332e 0%, #5a4a42 100%);
		box-shadow: 0 6px 20px rgba(90, 74, 66, 0.4);
		transform: translateY(-2px);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-outline-secondary {
		border: 2px solid #6c757d;
		color: #6c757d;
		border-radius: 0.5rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		transition: all 0.2s ease;
	}

	.btn-outline-secondary:hover {
		background: #6c757d;
		color: white;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(108, 117, 125, 0.2);
	}

	/* Code Tags */
	code {
		background: #f8f9fa;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.9em;
		color: #5a4a42;
		border: 1px solid #e9ecef;
		font-weight: 500;
	}

	/* Alerts - Enhanced */
	.alert {
		border-radius: 0.75rem;
		border: none;
		padding: 1rem 1.25rem;
		animation: slideDown 0.3s ease;
	}

	.alert-success {
		background: linear-gradient(135deg, #d1e7dd 0%, #a3d9a5 100%);
		color: #0f5132;
		box-shadow: 0 4px 12px rgba(25, 135, 84, 0.2);
	}

	.alert-danger {
		background: linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%);
		color: #842029;
		box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Divider */
	hr {
		border-color: #e9ecef;
		opacity: 1;
		margin: 2rem 0;
	}

	/* Footer Link */
	footer a {
		color: #5a4a42;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	footer a:hover {
		color: #3d332e;
		text-decoration: underline;
	}

	/* ===== Church Search Dropdown Styles ===== */
	.church-search-wrapper {
		position: relative;
	}

	.search-input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		color: #6c757d;
		pointer-events: none;
		z-index: 1;
		font-size: 1.1rem;
	}

	.check-icon {
		position: absolute;
		right: 1rem;
		color: #198754;
		pointer-events: none;
		z-index: 1;
		font-size: 1.1rem;
		animation: scaleIn 0.3s ease;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.church-search-input {
		padding-left: 2.75rem;
		padding-right: 2.75rem;
	}

	.church-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		z-index: 1000;
		max-height: 350px;
		overflow-y: auto;
		border: 2px solid #e9ecef;
		border-radius: 0.75rem;
		background: white;
		box-shadow:
			0 10px 25px rgba(0, 0, 0, 0.1),
			0 0 0 1px rgba(0, 0, 0, 0.05);
		animation: slideDown 0.25s ease;
	}

	.church-dropdown .church-item {
		cursor: pointer;
		padding: 0.875rem 1.25rem;
		text-align: left;
		white-space: normal;
		border: none;
		background: transparent;
		width: 100%;
		transition: all 0.15s ease;
		border-bottom: 1px solid #f8f9fa;
		animation: fadeInItem 0.3s ease forwards;
		opacity: 0;
	}

	@keyframes fadeInItem {
		to {
			opacity: 1;
		}
	}

	.church-dropdown .church-item:last-child {
		border-bottom: none;
	}

	.church-dropdown .church-item:hover {
		background: linear-gradient(to right, #f8f9fa, #ffffff);
		padding-left: 1.5rem;
		border-left: 3px solid #5a4a42;
	}

	.church-dropdown .church-item:active {
		background-color: #e9ecef;
	}

	.church-dropdown .church-item.is-other {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border-top: 2px solid #dee2e6;
		margin-top: 0.5rem;
		font-weight: 600;
	}

	.church-dropdown .church-item.is-other:hover {
		background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
		border-left: 3px solid #0d6efd;
	}

	.church-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.church-name {
		font-weight: 600;
		color: #212529;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	.church-name i {
		color: #5a4a42;
		font-size: 0.9rem;
	}

	.church-address {
		color: #6c757d;
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-left: 1.4rem;
	}

	.church-address i {
		color: #a28c6a;
		font-size: 0.8rem;
	}

	/* Custom scrollbar for dropdown */
	.church-dropdown::-webkit-scrollbar {
		width: 8px;
	}

	.church-dropdown::-webkit-scrollbar-track {
		background: #f8f9fa;
		border-radius: 0 0.75rem 0.75rem 0;
	}

	.church-dropdown::-webkit-scrollbar-thumb {
		background: #dee2e6;
		border-radius: 4px;
	}

	.church-dropdown::-webkit-scrollbar-thumb:hover {
		background: #adb5bd;
	}

	@media print {
		:global(nav),
		.btn,
		.alert {
			display: none !important;
		}
		.card {
			box-shadow: none !important;
			border: none !important;
		}
		:global(body) {
			color: #000;
		}
	}
</style>
