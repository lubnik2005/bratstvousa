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
      alert("Copy failed — please copy manually.");
    }
  };

  // use form if present; otherwise fall back to data.form
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
  <title>Camp 2025 Registration</title>
  <meta name="description" content="Register for GSBC Youth Camp 2025." />
</svelte:head>

<div class="container-xxl pb-6">
  <div class="container">
    <div class="section-header mx-auto mt-5 text-center" style="max-width: 1000px;">
      <header class="mb-4 text-center">
        <h1 class="display-6">Camp 2025 — Registration</h1>
        <p class="text-muted">
          Please complete the steps below. We’ll email you again once we have
          <strong>manually confirmed your payment</strong>.
        </p>
      </header>
    </div>

    <!-- Payment info -->
    <section class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Payment Methods</h2>
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
                aria-label="Copy Cash App handle"
              >
                Copy
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
                aria-label="Copy Zelle email"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div class="small text-muted mt-3">
          <strong>Payment memo:</strong> <code>camp2025-YOURNAME</code>
          {#if copied}
            <span class="badge bg-success ms-2">Copied {copied} ✓</span>
          {/if}
        </div>
      </div>
    </section>

    <!-- Registration form -->
    <form method="POST" use:enhance={onEnhance} class="card shadow-sm border-0">
      <div class="card-body">
        <h2 class="h5 mb-3">Your Info</h2>

        <!-- Honeypot (hidden) -->
        <div class="visually-hidden" aria-hidden="true">
          <label>
            Do not fill this in
            <input name="middle_name" autocomplete="off" />
          </label>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">First Name *</label>
            <input
              class="form-control"
              name="firstName"
              required
              placeholder="First Name"
              value={f?.fields?.firstName ?? ""}
            />
            {#if f?.errors?.firstName}
              <div class="invalid d-block">{f.errors.firstName}</div>
            {/if}
          </div>

          <div class="col-md-6">
            <label class="form-label">Last Name *</label>
            <input
              class="form-control"
              name="lastName"
              required
              placeholder="Last Name"
              value={f?.fields?.lastName ?? ""}
            />
            {#if f?.errors?.lastName}
              <div class="invalid d-block">{f.errors.lastName}</div>
            {/if}
          </div>

          <div class="col-md-6">
            <label class="form-label">Phone *</label>
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
            <label class="form-label">Email *</label>
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
            <label class="form-label">Church (optional)</label>
            <input
              class="form-control"
              name="church"
              placeholder="e.g., GSBC"
              value={f?.fields?.church ?? ""}
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Emergency Contact (optional)</label>
            <input
              class="form-control"
              name="emergency"
              placeholder="Name & phone"
              value={f?.fields?.emergency ?? ""}
            />
          </div>

          <div class="col-12">
            <label class="form-label">Notes (optional)</label>
            <textarea
              class="form-control"
              name="notes"
              rows="3"
              placeholder="Allergies, dietary needs, roommate preference, etc."
            >{f?.fields?.notes ?? ""}</textarea>
          </div>
        </div>

        <hr class="my-4" />

        <h2 class="h6 mb-3">Required Steps</h2>

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
            I have filled out the&nbsp;
            <a href={CONSENT_URL} target="_blank" rel="noopener">YoungLife Guest Consent & Release Form</a>.
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
            I have submitted payment with memo <code>camp2025-YOURNAME</code>.
          </label>
          {#if f?.errors?.paid}
            <div class="invalid d-block">{f.errors.paid}</div>
          {/if}
        </div>

        <button class="btn btn-primary btn-lg" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Registration"}
        </button>

        {#if f?.message}
          <div class="alert alert-success mt-3">{f.message}</div>
        {/if}

        {#if f?.formError}
          <div class="alert alert-danger mt-3">{f.formError}</div>
        {/if}

        <p class="small text-muted mt-3">
          We will email you again once we have <strong>manually</strong> confirmed your payment.
        </p>
      </div>
    </form>

    <footer class="my-4 small text-muted">
      Need help? Email <a href={"mailto:" + ZELLE}>{ZELLE}</a>.
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

