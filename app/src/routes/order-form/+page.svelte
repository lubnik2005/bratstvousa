<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	// Simple client-side form; no network calls. Adjust as needed.
	const PRICE = 5.0;
	export let data;

	let selectedChurch = '';
	let newChurch = '';
	let useNewChurch = false;

	let startChoice: 'sep-2025' | 'jan-2026' | '' = '';
	let address = '';
	let fullName = '';

	let lastName = '';
	let middleName = '';
	let firstName = '';
	let phone = '';
	let email = '';
	let qtyRus: number = 0;
	let qtyRusEng: number = 0;
	let qtyRusEngRom: number = 0;

	$: totalQty = (qtyRus || 0) + (qtyRusEng || 0) + (qtyRusEngRom || 0);
	$: totalCost = totalQty * PRICE;

	function validateEmail(s: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
	}

	import { enhance } from '$app/forms';
	import Turnstile from '$lib/components/Turnstile.svelte';
	export let form; // action result (errors/success)

	let turnstile: Turnstile | undefined;

	function submitForm(e: Event) {
		e.preventDefault();

		if (!startChoice) return alert('Выберите планируемый старт (сентябрь 2025 или январь 2026).');
		if (!address.trim()) return alert('Укажите Адрес.');
		if (!fullName.trim()) return alert('Укажите Ф. И. О.');
		if (!phone.trim()) return alert('Укажите номер телефона.');
		if (!email.trim() || !validateEmail(email)) return alert('Укажите корректный e-mail.');
		if (totalQty <= 0) return alert('Укажите количество экземпляров (минимум 1).');

		// Since we have no backend, show a confirmation summary:
		alert(
			[
				'Заявка отправлена (локально). Проверьте e-mail: реквизиты будут высланы позже.',
				'',
				`Старт: ${startChoice === 'sep-2025' ? 'Сентябрь 2025 (дедлайн 1 сентября)' : 'Январь 2026 (дедлайн 1 декабря)'}`,
				`Город и Церковь: ${address}`,
				`Ф.И.О.: ${fullName}`,
				`Телефон: ${phone}`,
				`E-mail: ${email}`,
				'',
				`Кол-во: RUS=${qtyRus || 0}, RUS/ENG=${qtyRusEng || 0}, RUS/ENG/ROM=${qtyRusEngRom || 0}`,
				`Итого экземпляров: ${totalQty}`,
				`Сумма к оплате: $${totalCost.toFixed(2)} (по $${PRICE.toFixed(2)} за экз.)`
			].join('\n')
		);
	}
</script>

<svelte:head>
	<title>Заявка — Методическое пособие для братских общений</title>
	<meta
		name="description"
		content="Подайте заявку на печатные экземпляры пособия. Цена: $5 за экземпляр. Оплата по e-mail реквизитам."
	/>
</svelte:head>

<Header title="Заявка на печатные экземпляры" />

<div class="container-xxl py-6">
	<div class="container">
		<div class="row g-4">
			<div class="col-lg-8">
				<form
					class="form-panel"
					method="post"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							turnstile?.reset();
						};
					}}
				>
					<div class="card-body">
						<div class="row">
							<div class="col-md-4">
								<label class="form-label" for="first_name"
									>Имя <span class="text-danger">*</span></label
								>
								<input
									id="first_name"
									name="first_name"
									type="text"
									class="form-control"
									bind:value={firstName}
									required
								/>
							</div>
							<div class="col-md-4">
								<label class="form-label" for="last_name"
									>Фамилия <span class="text-danger">*</span></label
								>
								<input
									id="last_name"
									name="last_name"
									type="text"
									class="form-control"
									bind:value={lastName}
									required
								/>
							</div>
							<div class="col-md-4">
								<label class="form-label" for="middle_name">Отчество</label>
								<input
									id="middle_name"
									name="middle_name"
									type="text"
									class="form-control"
									bind:value={middleName}
								/>
							</div>
						</div>

						<div class="mt-3">
							<label class="form-label" for="church"
								>Церковь <span class="text-danger">*</span></label
							>
							<select
								id="church"
								name="church"
								class="form-select"
								bind:value={selectedChurch}
								on:change={() => (useNewChurch = selectedChurch === 'other')}
								required
							>
								<option value="" disabled selected>Выберите церковь</option>
								{#each data.churches as church}
									<option value={church.id}
										>{church.name_line_1 +
											' ' +
											(church.name_line_2 ?? '') +
											' (' +
											church.address_line_1 +
											' ' +
											(church.address_line_2 ?? '') +
											')'}</option
									>
								{/each}
								<option value="other">Другое (ввести вручную)</option>
							</select>
						</div>

						<!-- New Church Field (Conditional) -->
						{#if useNewChurch}
							<div class="mt-3">
								<label class="form-label" for="new_church"
									>Введите название церкви <span class="text-danger">*</span></label
								>
								<input
									id="new_church"
									name="new_church"
									type="text"
									class="form-control"
									bind:value={newChurch}
									required
								/>
							</div>
						{/if}
						<div class="mb-3">
							<label class="form-label fw-semibold" for="address">Адрес доставки</label>
							<input
								id="address"
								class="form-control"
								type="text"
								name="address"
								bind:value={address}
								placeholder="Адрес доставки"
								required
							/>
						</div>

						<div class="row g-3">
							<div class="col-md-3">
								<label class="form-label fw-semibold" for="phone">Телефон</label>
								<input
									id="phone"
									class="form-control"
									type="tel"
									name="phone"
									bind:value={phone}
									placeholder="+1 (___) ___-____"
									required
								/>
							</div>
							<div class="col-md-3">
								<label class="form-label fw-semibold" for="email">Электронная почта</label>
								<input
									id="email"
									class="form-control"
									type="email"
									name="email"
									bind:value={email}
									placeholder="you@example.com"
									required
								/>
							</div>
						</div>

						<hr class="my-4" />

						<div class="mb-2">
							<span class="form-label fw-semibold">Количество экземпляров</span>
						</div>

						<div class="row g-3">
							<div class="col-md-4">
								<label class="form-label small qty-label" for="qty_rus">Русский (RUS)</label>
								<input
									id="qty_rus"
									class="form-control"
									type="number"
									name="qty_rus"
									min="0"
									step="1"
									bind:value={qtyRus}
								/>
							</div>
							<div class="col-md-4">
								<label class="form-label small qty-label" for="qty_rus_eng"
									>Русско-английский (RUS/ENG)</label
								>
								<input
									id="qty_rus_eng"
									class="form-control"
									type="number"
									name="qty_rus_eng"
									min="0"
									step="1"
									bind:value={qtyRusEng}
								/>
							</div>
							<div class="col-md-4">
								<label class="form-label small qty-label" for="qty_rus_eng_rom"
									>Русско-англо-румынский (RUS/ENG/ROM)</label
								>
								<input
									id="qty_rus_eng_rom"
									class="form-control"
									type="number"
									name="qty_rus_eng_rom"
									min="0"
									step="1"
									bind:value={qtyRusEngRom}
								/>
							</div>
						</div>

						<div class="alert alert-light mt-3 border">
							<div class="d-flex justify-content-between">
								<div>
									<div class="small text-muted">Итого экземпляров:</div>
									<div class="fw-semibold">{totalQty}</div>
								</div>
								<div class="text-end">
									<div class="small text-muted">Стоимость ($5.00 / экз.)</div>
									<div class="fw-semibold">${totalCost.toFixed(2)}</div>
								</div>
							</div>
						</div>

						<p class="small text-muted mt-2">
							Цена одного экземпляра — $5.00. Реквизиты для платежа будут высланы на вашу
							электронную почту.
						</p>

						{#if form?.error}
							<div class="alert alert-danger mt-3">{form.error}</div>
						{/if}
						{#if form?.success}
							<div class="alert alert-success mt-3">Заявка отправлена. Проверьте почту.</div>
						{/if}
					</div>

					<div class="px-4 pt-0">
						<Turnstile bind:this={turnstile} action="order_form" />
					</div>
					<div class="d-flex gap-2 px-4 pb-4 pt-0">
						<button class="btn btn-primary" type="submit">Отправить заявку</button>
					</div>
				</form>
			</div>

			<div class="col-lg-4">
				<aside class="reminder-panel">
					<p class="eyebrow">Напоминание о сроках</p>
					<ul class="reminder-list">
						<li>Старт в сентябре 2025 — подать заявку до <strong>1 сентября</strong>.</li>
						<li>Старт в январе 2026 — подать заявку до <strong>1 декабря</strong>.</li>
						<li>Реквизиты для оплаты придут на вашу электронную почту.</li>
					</ul>
				</aside>
			</div>
		</div>
	</div>
</div>

<style>
	.form-panel {
		border: 1px solid var(--bs-rule);
		border-top: 2px solid var(--bs-secondary);
		background: var(--bs-paper);
	}
	.qty-label {
		color: var(--bs-ink-muted);
	}
	.reminder-panel {
		padding: 1.75rem;
		background: var(--bs-paper-sunk);
		border: 1px solid var(--bs-rule);
		border-top: 2px solid var(--bs-secondary);
	}
	.reminder-panel :global(.eyebrow) {
		color: var(--bs-ink-muted);
	}
	.reminder-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		color: var(--bs-ink-muted);
		font-size: 0.92rem;
		line-height: 1.7;
	}
	.reminder-list li + li {
		margin-top: 0.5rem;
	}
</style>
