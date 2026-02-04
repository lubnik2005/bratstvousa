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
						<label class="form-label" for="firstName">Имя *</label>
						<input
							id="firstName"
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
						<label class="form-label" for="lastName">Фамилия *</label>
						<input
							id="lastName"
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
						<label class="form-label" for="phone">Телефон *</label>
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
						<label class="form-label" for="email">Эл. почта *</label>
						<input
							id="email"
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
						<label class="form-label" for="church-search">Церковь *</label>
						<div class="position-relative">
							<input
								id="church-search"
								class="form-control"
								type="text"
								bind:value={churchSearchTerm}
								on:focus={handleChurchInputFocus}
								on:blur={handleChurchInputBlur}
								placeholder={selectedChurchName || 'Начните вводить название церкви...'}
								aria-describedby="church-help"
								autocomplete="off"
							/>
							<input type="hidden" name="church" bind:value={churchValue} required />

							{#if showChurchDropdown && churchOptions.length > 0}
								<div class="dropdown-menu show w-100 church-dropdown">
									{#each churchOptions as church}
										<button
											type="button"
											class="dropdown-item"
											on:click={() => selectChurch(church)}
										>
											{#if church.isOther}
												<strong>{church.name_line_1}</strong>
											{:else}
												<div>
													<strong>{church.name_line_1} {church.name_line_2 || ''}</strong>
													<br />
													<small class="text-muted">{church.address_line_1}, {church.city}</small>
												</div>
											{/if}
										</button>
									{/each}
								</div>
							{/if}
						</div>
						<div id="church-help" class="form-text">
							Начните вводить название для поиска. Всегда доступна опция "Другое".
						</div>
						{#if f?.errors?.church}
							<div class="invalid d-block">{f.errors.church}</div>
						{/if}
					</div>

					{#if churchIsOther}
						<div class="col-md-6">
							<label class="form-label" for="churchOther">Введите название церкви *</label>
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
						<label class="form-label" for="role">Твой статус в молодежном служении *</label>
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
						<div id="role-help" class="form-text">Выберите ваш текущий статус в служении.</div>
						{#if f?.errors?.role}
							<div class="invalid d-block">{f.errors.role}</div>
						{/if}
					</div>

					{#if roleIsOther}
						<div class="col-12">
							<label class="form-label" for="roleOther">Укажите ваш статус *</label>
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
						<label class="form-label" for="notes">Примечания (необязательно)</label>
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
	.mono {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
	}

	.invalid {
		color: var(--bs-danger, #dc3545);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.payicon {
		width: 50px;
		height: 50px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		color: #fff;
		flex-shrink: 0;
	}

	.payicon.zelle {
		background: #6c3df4;
		font-size: 1.5rem;
	}

	.church-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1000;
		max-height: 300px;
		overflow-y: auto;
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	}

	.church-dropdown .dropdown-item {
		cursor: pointer;
		padding: 0.75rem 1rem;
		text-align: left;
		white-space: normal;
		border: none;
		background: transparent;
		width: 100%;
	}

	.church-dropdown .dropdown-item:hover {
		background-color: #f8f9fa;
	}

	.church-dropdown .dropdown-item:focus {
		background-color: #e9ecef;
		outline: none;
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
