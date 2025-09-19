<!-- src/routes/[ministry]/north-west-youth-camp-2025/registration/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  export let data;
  export let form: any = {};

  const CONSENT_URL =
    "https://www.cognitoforms.com/YoungLife21/guestconsentreleaseformforoutsidegroupsusingyounglifecamp";

  const CASHAPP = "$GSBCYouth";
  const ZELLE = "gyouth5116@gmail.com";

  let copied: string | null = null;
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copied = label;
      setTimeout(() => (copied = null), 1500);
    } catch {
      alert("Не удалось скопировать — пожалуйста, скопируйте вручную.");
    }
  };

  // использовать form, если есть; иначе data.form
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
</script>

<svelte:head>
  <title>Регистрация на лагерь 2025</title>
  <meta name="description" content="Регистрация на молодёжный лагерь GSBC 2025." />
</svelte:head>

<div class="container-xxl pb-6">
  <div class="container">
    <div class="section-header mx-auto mt-5 text-center" style="max-width: 1000px;">
      <header class="mb-4 text-center">
        <h1 class="display-6">Лагерь 2025 — Регистрация</h1>
        <p class="text-muted">
          Пожалуйста, выполните шаги ниже. Мы отправим вам письмо, когда
          <strong>вручную подтвердим вашу оплату</strong>.
        </p>
      </header>
    </div>

    <!-- Способы оплаты -->
    <section class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Способы оплаты</h2>
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <div class="d-flex align-items-center gap-3">
              <div class="payicon cashapp" aria-hidden="true">S</div>
              <div>
                <div class="fw-semibold">Cash App</div>
                <div class="mono">{CASHAPP}</div>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary ms-auto"
                on:click={() => copy(CASHAPP, "cashapp")}
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
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary ms-auto"
                on:click={() => copy(ZELLE, "zelle")}
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

    <!-- Форма регистрации -->
    <form method="POST" use:enhance={onEnhance} class="card shadow-sm border-0">
      <div class="card-body">
        <h2 class="h5 mb-3">Ваши данные</h2>

        <!-- Ханипот (скрытое поле) -->
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
              value={f?.fields?.firstName ?? ""}
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
              value={f?.fields?.lastName ?? ""}
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
              value={f?.fields?.phone ?? ""}
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
              value={f?.fields?.email ?? ""}
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
              value={f?.fields?.church ?? ""}
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Контакт на случай ЧС (необязательно)</label>
            <input
              class="form-control"
              name="emergency"
              placeholder="Имя и телефон"
              value={f?.fields?.emergency ?? ""}
            />
          </div>

          <div class="col-12">
            <label class="form-label">Примечания (необязательно)</label>
            <textarea
              class="form-control"
              name="notes"
              rows="3"
              placeholder="Аллергии, питание и т.д."
            >{f?.fields?.notes ?? ""}</textarea>
          </div>
        </div>

        <hr class="my-4" />

        <h2 class="h6 mb-3">Обязательные шаги</h2>

        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="consent"
            name="consent"
            required
            checked={f?.fields?.consent === "on"}
          />
          <label class="form-check-label" for="consent">
            Я заполнил(а)&nbsp;
            <a href={CONSENT_URL} target="_blank" rel="noopener" style="text-decoration:underline">
              форму согласия YoungLife (Guest Consent & Release)
            </a>.
          </label>
          {#if f?.errors?.consent}
            <div class="invalid d-block">{f.errors.consent}</div>
          {/if}
        </div>

        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="consent_rules"
            name="consent"
            required
            checked={f?.fields?.consent === "on"}
          />
          <label class="form-check-label" for="consent_rules">
            Я прочитал(а) и согласен(на) с&nbsp;
            <a href="/youth-ministry/north-west-youth-camp-2025/rules" target="_blank" rel="noopener" style="text-decoration:underline">
              правилами лагеря
            </a>.
          </label>
          {#if f?.errors?.consent}
            <div class="invalid d-block">{f.errors.consent}</div>
          {/if}
        </div>

        <div class="form-check mb-3">
          <input
            class="form-check-input"
            type="checkbox"
            id="paid"
            name="paid"
            required
            checked={f?.fields?.paid === "on"}
          />
          <label class="form-check-label" for="paid">
            Я произвёл(а) оплату с примечанием <code>camp2025-YOURNAME</code>.
          </label>
          {#if f?.errors?.paid}
            <div class="invalid d-block">{f.errors.paid}</div>
          {/if}
        </div>

        <button class="btn btn-primary btn-lg" type="submit" disabled={submitting}>
          {submitting ? "Отправка..." : "Отправить регистрацию"}
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

    <footer class="my-4 small text-muted">
      Нужна помощь? Напишите на <a href={"mailto:" + ZELLE}>{ZELLE}</a>.
    </footer>
  </div>
</div>

<style>
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
  .invalid { color: var(--bs-danger, #dc3545); }
  .payicon {
    width: 40px; height: 40px; border-radius: 10px;
    display:flex; align-items:center; justify-content:center;
    font-weight: 800; color: #fff;
  }
  .payicon.cashapp { background:#00C244; }
  .payicon.zelle { background:#6C3DF4; }
</style>

