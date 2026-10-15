<template>
  <div class="mx-auto max-w-3xl">
    <Head title="Camp Check-In" />

    <Heading class="mb-2">Camp Check-In</Heading>
    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
      Scan a Zeffy ticket. A scan never changes payment or check-in status by itself.
    </p>

    <Card class="mb-6 p-5">
      <div id="camp-check-in-reader" class="overflow-hidden rounded"></div>
      <div class="mt-4 flex flex-wrap gap-3">
        <button class="btn btn-default" :disabled="cameraActive" @click="startCamera">
          {{ cameraActive ? 'Camera is scanning' : 'Scan ticket' }}
        </button>
        <button v-if="cameraActive" class="btn btn-link" @click="stopCamera">Stop camera</button>
      </div>
      <form class="mt-5 flex gap-3" @submit.prevent="lookup(manualValue)">
        <input
          v-model="manualValue"
          class="form-control form-input form-input-bordered w-full"
          placeholder="Paste a Zeffy ticket ID or CAMP code"
          aria-label="Ticket ID or registration code"
        />
        <button class="btn btn-default" :disabled="loading || !manualValue.trim()">Find</button>
      </form>
    </Card>

    <p v-if="error" class="mb-4 text-sm font-semibold text-red-600">{{ error }}</p>

    <Card
      v-if="registration"
      class="camp-checkin-result p-5"
      :class="resultClass"
    >
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ registration.name }}</h2>
          <p class="text-sm text-gray-500">{{ registration.confirmationCode }}<span v-if="registration.church"> · {{ registration.church }}</span></p>
        </div>
        <span class="rounded bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {{ paymentLabel }}
        </span>
      </div>

      <p class="mt-5 text-base font-semibold" :class="registration.decision === 'blocked' ? 'text-red-700' : 'text-green-700'">
        {{ registration.message }}
      </p>

      <dl class="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div><dt class="text-gray-500">Attendee paid</dt><dd class="font-bold">{{ money(registration.amountPaidCents) }}</dd></div>
        <div><dt class="text-gray-500">Attendee due</dt><dd class="font-bold">{{ money(registration.amountDueCents) }}</dd></div>
        <div><dt class="text-gray-500">Church balance</dt><dd class="font-bold">{{ money(registration.churchBalanceCents) }}</dd></div>
      </dl>

      <div v-if="registration.decision === 'check_in'" class="mt-6">
        <button class="btn btn-default" :disabled="performing" @click="perform('check_in')">
          {{ performing ? 'Checking in...' : 'Check In' }}
        </button>
      </div>
      <div v-else-if="registration.decision === 'collect_cash'" class="mt-6">
        <p class="mb-3 text-sm text-amber-700">Confirm cash is physically in hand before continuing.</p>
        <button class="btn btn-default" :disabled="performing" @click="confirmCash">
          {{ performing ? 'Recording...' : 'Cash Received & Check In' }}
        </button>
      </div>
      <p v-else class="mt-6 text-sm text-gray-500">Open the registration record to resolve this before scanning again.</p>
    </Card>
  </div>
</template>

<script>
import { Html5Qrcode } from 'html5-qrcode'

export default {
  data: () => ({
    camera: null,
    cameraActive: false,
    error: '',
    loading: false,
    manualValue: '',
    performing: false,
    registration: null,
  }),

  computed: {
    paymentLabel() {
      return this.registration.paymentStatus.replace('_', ' ')
    },
    resultClass() {
      return {
        check_in: 'camp-checkin-result--ready',
        collect_cash: 'camp-checkin-result--cash',
        blocked: 'camp-checkin-result--blocked',
      }[this.registration.decision]
    },
  },

  beforeUnmount() {
    this.stopCamera()
  },

  methods: {
    async startCamera() {
      this.error = ''
      this.camera = new Html5Qrcode('camp-check-in-reader')
      try {
        await this.camera.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          async (value) => {
            await this.stopCamera()
            await this.lookup(value)
          },
          () => {},
        )
        this.cameraActive = true
      } catch (error) {
        this.error = 'Unable to start the camera. Allow camera access or paste the ticket ID.'
        this.camera = null
      }
    },

    async stopCamera() {
      if (!this.camera) return
      try {
        await this.camera.stop()
        await this.camera.clear()
      } catch (_) {
        // The scanner may already have stopped after a successful decode.
      }
      this.camera = null
      this.cameraActive = false
    },

    async lookup(value) {
      const ticket = value.trim()
      if (!ticket) return
      this.error = ''
      this.loading = true
      try {
        const { data } = await Nova.request().get('/nova-vendor/camp-check-in/lookup', { params: { value: ticket } })
        this.registration = data.registration
        this.manualValue = ''
      } catch (error) {
        this.registration = null
        this.error = error.response?.data?.message || 'Unable to find this ticket.'
      } finally {
        this.loading = false
      }
    },

    confirmCash() {
      if (window.confirm('Confirm that cash has been physically received. This will mark the attendee paid and checked in.')) {
        this.perform('collect_cash')
      }
    },

    async perform(action) {
      this.error = ''
      this.performing = true
      try {
        const { data } = await Nova.request().post(`/nova-vendor/camp-check-in/registrations/${this.registration.id}/perform`, { action })
        this.registration = data.registration
      } catch (error) {
        this.error = error.response?.data?.result?.message || 'Unable to complete this action.'
        if (error.response?.data?.registration) this.registration = error.response.data.registration
      } finally {
        this.performing = false
      }
    },

    money(cents) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
    },
  },
}
</script>
