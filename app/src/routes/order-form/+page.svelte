
<script lang="ts">

	import Header from '$lib/components/Header.svelte';
  // Simple client-side form; no network calls. Adjust as needed.
  const PRICE = 5.0;
  export let data;


	let selectedChurch = '';
	let newChurch = '';
	let useNewChurch = false;

  let startChoice: 'sep-2025' | 'jan-2026' | '' = '';
  let cityChurch = '';
  let fullName = '';

	let lastName = '';
	let middleName = '';
	let firstName = '';
  let phone = '';
  let email = '';
  let qtyRus: number = 0;
  let qtyRusEng: number = 0;
  let qtyRusEngRom: number = 0;
  let agree = false;

  $: totalQty = (qtyRus || 0) + (qtyRusEng || 0) + (qtyRusEngRom || 0);
  $: totalCost = totalQty * PRICE;

  function validateEmail(s: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  import { enhance } from '$app/forms';
  export let form; // action result (errors/success)



  function submitForm(e: Event) {
    e.preventDefault();

    if (!startChoice) return alert('Выберите планируемый старт (сентябрь 2025 или январь 2026).');
    if (!cityChurch.trim()) return alert('Укажите Город и Церковь.');
    if (!fullName.trim()) return alert('Укажите Ф. И. О.');
    if (!phone.trim()) return alert('Укажите номер телефона.');
    if (!email.trim() || !validateEmail(email)) return alert('Укажите корректный e-mail.');
    if (totalQty <= 0) return alert('Укажите количество экземпляров (минимум 1).');
    if (!agree) return alert('Подтвердите, что ознакомлены с ценой и условиями.');

    // Since we have no backend, show a confirmation summary:
    alert([
      'Заявка отправлена (локально). Проверьте e-mail: реквизиты будут высланы позже.',
      '',
      `Старт: ${startChoice === 'sep-2025' ? 'Сентябрь 2025 (дедлайн 1 сентября)' : 'Январь 2026 (дедлайн 1 декабря)'}`,
      `Город и Церковь: ${cityChurch}`,
      `Ф.И.О.: ${fullName}`,
      `Телефон: ${phone}`,
      `E-mail: ${email}`,
      '',
      `Кол-во: RUS=${qtyRus || 0}, RUS/ENG=${qtyRusEng || 0}, RUS/ENG/ROM=${qtyRusEngRom || 0}`,
      `Итого экземпляров: ${totalQty}`,
      `Сумма к оплате: $${totalCost.toFixed(2)} (по $${PRICE.toFixed(2)} за экз.)`,
    ].join('\n'));
  }
</script>

<svelte:head>
  <title>Заявка — Методическое пособие для братских общений</title>
  <meta name="description" content="Подайте заявку на печатные экземпляры пособия. Цена: $5 за экземпляр. Оплата по e-mail реквизитам." />
</svelte:head>

<Header title="Заявка на печатные экземпляры" subtitle="Цена одного экземпляра — $5.00. Реквизиты для платежа будут высланы на вашу электронную почту." />

<div class="container-fluid">
  <div class="container">
    <div class="row g-4">
      <div class="col-lg-8">







<form class="card border-0 shadow-sm" method="post" use:enhance>
  <div class="card-body">

			<div class="row">
				<div class="col-md-4">
					<label class="form-label">Имя <span class="text-danger">*</span></label>
					<input
						name="first_name"
						type="text"
						class="form-control"
						bind:value={firstName}
						required
					/>
				</div>
				<div class="col-md-4">
					<label class="form-label">Фамилия <span class="text-danger">*</span></label>
					<input name="last_name" type="text" class="form-control" bind:value={lastName} required />
				</div>
				<div class="col-md-4">
					<label class="form-label">Отчество</label>
					<input name="middle_name" type="text" class="form-control" bind:value={middleName} />
				</div>
			</div>

			<div class="mt-3">
				<label class="form-label">Церковь <span class="text-danger">*</span></label>
				<select
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
					<label class="form-label"
						>Введите название церкви <span class="text-danger">*</span></label
					>
					<input
						name="new_church"
						type="text"
						class="form-control"
						bind:value={newChurch}
						required
					/>
				</div>
			{/if}
    <div class="mb-3">
      <label class="form-label fw-semibold">Адрес</label>
      <input class="form-control" type="text" name="address" bind:value={cityChurch} placeholder="Город, название церкви" required />
    </div>



    <div class="row g-3">
      <div class="col-md-3">
        <label class="form-label fw-semibold">Телефон</label>
        <input class="form-control" type="tel" name="phone" bind:value={phone} placeholder="+1 (___) ___-____" required />
      </div>
      <div class="col-md-3">
        <label class="form-label fw-semibold">Электронная почта</label>
        <input class="form-control" type="email" name="email" bind:value={email} placeholder="you@example.com" required />
      </div>
    </div>

    <hr class="my-4" />

    <div class="mb-2">
      <label class="form-label fw-semibold">Количество экземпляров</label>
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label small text-muted">Русский (RUS)</label>
        <input class="form-control" type="number" name="qty_rus" min="0" step="1" bind:value={qtyRus} />
      </div>
      <div class="col-md-4">
        <label class="form-label small text-muted">Русско-английский (RUS/ENG)</label>
        <input class="form-control" type="number" name="qty_rus_eng" min="0" step="1" bind:value={qtyRusEng} />
      </div>
      <div class="col-md-4">
        <label class="form-label small text-muted">Русско-англо-румынский (RUS/ENG/ROM)</label>
        <input class="form-control" type="number" name="qty_rus_eng_rom" min="0" step="1" bind:value={qtyRusEngRom} />
      </div>
    </div>

    <div class="alert alert-light border mt-3">
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

    <div class="form-check mt-2">
      <input class="form-check-input" id="agree" type="checkbox" name="agree" bind:checked={agree} required />
      <label class="form-check-label" for="agree">
        Подтверждаю, что ознакомлен(а) с ценой и условиями (реквизиты будут высланы на e-mail).
      </label>
    </div>

    {#if form?.error}
      <div class="alert alert-danger mt-3">{form.error}</div>
    {/if}
    {#if form?.success}
      <div class="alert alert-success mt-3">Заявка отправлена. Проверьте почту.</div>
    {/if}
  </div>

  <div class="card-footer bg-white border-0 pt-0 pb-4 px-4 d-flex gap-2">
    <button class="btn btn-primary" type="submit" disabled={!agree}>Отправить заявку</button>
  </div>
</form>


      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h3 class="h6">Напоминание о сроках</h3>
            <ul class="small text-muted mb-0">
              <li>Старт в сентябре 2025 — подать заявку до <strong>1 сентября</strong>.</li>
              <li>Старт в январе 2026 — подать заявку до <strong>1 декабря</strong>.</li>
              <li>Реквизиты для оплаты придут на вашу электронную почту.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

