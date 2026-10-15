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
        <button class="camp-checkin-button camp-checkin-button--primary" :disabled="cameraActive" @click="startCamera">
          {{ cameraActive ? 'Camera is scanning' : 'Scan ticket' }}
        </button>
        <button v-if="cameraActive" class="camp-checkin-button camp-checkin-button--secondary" @click="stopCamera">Stop camera</button>
      </div>
      <form class="mt-5 flex gap-3" @submit.prevent="lookup(manualValue)">
        <input
          v-model="manualValue"
          class="form-control form-input form-input-bordered w-full"
          placeholder="Paste a Zeffy ticket ID or CAMP code"
          aria-label="Ticket ID or registration code"
        />
        <button class="camp-checkin-button camp-checkin-button--primary" :disabled="loading || !manualValue.trim()">Find ticket</button>
      </form>
    </Card>

    <p v-if="error" class="mb-4 text-sm font-semibold text-red-600">{{ error }}</p>

    <Card v-if="lookupResult" class="mb-6 p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-bold text-gray-900 dark:text-white">Scanned QR Data</h2>
        <button class="camp-checkin-button camp-checkin-button--secondary" :disabled="refreshingZeffy" @click="refreshZeffy">
          {{ refreshingZeffy ? 'Refreshing Zeffy...' : 'Refresh Zeffy' }}
        </button>
      </div>
      <code class="mt-3 block break-all rounded bg-gray-100 p-3 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100">{{ lookupResult.rawValue }}</code>
      <p v-if="lookupResult.extractedValues.length > 1" class="mt-3 break-all text-xs text-gray-500">Extracted values: {{ lookupResult.extractedValues.join(' · ') }}</p>
      <p v-if="lookupResult.message" class="mt-4 text-sm font-semibold text-amber-700">{{ lookupResult.message }}</p>

      <div class="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
        <h3 class="font-bold text-gray-900 dark:text-white">Zeffy Ticket Details</h3>
        <p v-if="!lookupResult.zeffy.paymentId && !lookupResult.zeffy.live" class="mt-3 text-sm text-gray-500">No stored Zeffy payment is linked to this scan.</p>
        <dl class="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div><dt class="text-gray-500">Ticket ID</dt><dd class="break-all font-bold">{{ lookupResult.zeffy.ticketId || 'Not recorded' }}</dd></div>
          <div><dt class="text-gray-500">Payment ID</dt><dd class="break-all font-bold">{{ lookupResult.zeffy.paymentId || lookupResult.zeffy.live?.paymentId || 'Not recorded' }}</dd></div>
          <div><dt class="text-gray-500">Stored status</dt><dd class="font-bold">{{ lookupResult.zeffy.status || 'Not recorded' }}</dd></div>
          <div><dt class="text-gray-500">Stored payment</dt><dd class="font-bold">{{ zeffyAmount(lookupResult.zeffy) }}</dd></div>
          <div><dt class="text-gray-500">Buyer</dt><dd class="font-bold">{{ lookupResult.zeffy.buyerName || 'Not recorded' }}</dd></div>
          <div><dt class="text-gray-500">Buyer email</dt><dd class="break-all font-bold">{{ lookupResult.zeffy.buyerEmail || 'Not recorded' }}</dd></div>
        </dl>
        <div v-if="lookupResult.zeffy.live" class="mt-4 rounded bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
          <p class="font-bold">Live Zeffy: {{ lookupResult.zeffy.live.status || 'Unknown status' }} · {{ zeffyAmount(lookupResult.zeffy.live) }}</p>
          <p v-if="lookupResult.zeffy.live.buyerEmail" class="mt-1">{{ lookupResult.zeffy.live.buyerName || 'Buyer' }} · {{ lookupResult.zeffy.live.buyerEmail }}</p>
        </div>
        <p v-else-if="lookupResult.zeffy.liveError" class="mt-4 text-sm text-amber-700">{{ lookupResult.zeffy.liveError }} Stored details are shown above.</p>
      </div>
    </Card>

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

      <div class="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
        <h3 class="font-bold text-gray-900 dark:text-white">Check-In History ({{ registration.checkIns.length }})</h3>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700">
              <tr><th class="pb-2 pr-4">Time</th><th class="pb-2 pr-4">Staff</th><th class="pb-2 pr-4">Entry</th><th class="pb-2">Note</th></tr>
            </thead>
            <tbody>
              <tr v-for="checkIn in registration.checkIns" :key="checkIn.id" class="border-b border-gray-100 dark:border-gray-800">
                <td class="py-3 pr-4 whitespace-nowrap">{{ checkInTime(checkIn.checkedInAt) }}</td>
                <td class="py-3 pr-4">{{ checkIn.checkedInBy }}</td>
                <td class="py-3 pr-4 font-semibold">{{ checkIn.isRepeat ? 'Repeat' : 'First entry' }}</td>
                <td class="py-3">{{ checkIn.note || '—' }}</td>
              </tr>
              <tr v-if="!registration.checkIns.length"><td colspan="4" class="py-3 text-gray-500">No check-ins recorded yet.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="registration.decision === 'check_in'" class="mt-6">
        <button class="camp-checkin-button camp-checkin-button--success" :disabled="performing" @click="perform('check_in')">
          {{ performing ? 'Checking in...' : 'Check In Locally' }}
        </button>
        <button v-if="registration.zeffy.ticketId" class="camp-checkin-button camp-checkin-button--secondary ml-3" @click="checkInZeffy">
          Check In to Zeffy
        </button>
      </div>
      <div v-else-if="registration.decision === 'collect_cash'" class="mt-6">
        <p class="mb-3 text-sm text-amber-700">Confirm cash is physically in hand before continuing.</p>
        <button class="camp-checkin-button camp-checkin-button--cash" :disabled="performing" @click="confirmCash">
          {{ performing ? 'Recording...' : 'Cash Received & Check In' }}
        </button>
        <button v-if="registration.zeffy.ticketId" class="camp-checkin-button camp-checkin-button--secondary ml-3" @click="checkInZeffy">
          Check In to Zeffy
        </button>
      </div>
      <div v-else-if="registration.decision === 'repeat_check_in'" class="mt-6 rounded border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
        <p class="font-bold">Already checked in. Confirm a repeat entry only if this attendee is returning.</p>
        <label class="mt-4 block text-sm font-semibold" for="repeat-check-in-note">Note (optional)</label>
        <input id="repeat-check-in-note" v-model="repeatNote" class="form-control form-input form-input-bordered mt-1 w-full" maxlength="500" placeholder="Reason for repeat entry" />
        <button class="camp-checkin-button camp-checkin-button--cash mt-4" :disabled="performing" @click="confirmRepeatCheckIn">
          {{ performing ? 'Recording...' : 'Check In Again' }}
        </button>
        <button v-if="registration.zeffy.ticketId" class="camp-checkin-button camp-checkin-button--secondary mt-4 ml-3" @click="checkInZeffy">
          Check In to Zeffy
        </button>
      </div>
      <p v-else class="mt-6 text-sm text-gray-500">Open the registration record to resolve this before scanning again.</p>
      <p v-if="zeffyCheckInMessage" class="mt-4 text-sm font-semibold text-blue-700">{{ zeffyCheckInMessage }}</p>
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
    refreshingZeffy: false,
    zeffyCheckInMessage: '',
    repeatNote: '',
    pendingRequestId: null,
    lookupResult: null,
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
        repeat_check_in: 'camp-checkin-result--cash',
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

    async lookup(value, refreshZeffy = true) {
      const ticket = value.trim()
      if (!ticket) return
      this.error = ''
      this.loading = true
      try {
        const { data } = await Nova.request().get('/nova-vendor/camp-check-in/lookup', { params: { value: ticket, refresh_zeffy: refreshZeffy ? 1 : 0 } })
        this.lookupResult = data
        this.registration = data.registration
        this.manualValue = ''
        this.repeatNote = ''
        this.pendingRequestId = null
        this.zeffyCheckInMessage = ''
      } catch (error) {
        this.registration = null
        this.lookupResult = null
        this.error = error.response?.data?.message || 'Unable to find this ticket.'
      } finally {
        this.loading = false
      }
    },

    async refreshZeffy() {
      if (!this.lookupResult) return
      this.refreshingZeffy = true
      try {
        await this.lookup(this.lookupResult.rawValue, true)
      } finally {
        this.refreshingZeffy = false
      }
    },

    confirmCash() {
      if (window.confirm('Confirm that cash has been physically received. This will mark the attendee paid and checked in.')) {
        this.perform('collect_cash')
      }
    },

    confirmRepeatCheckIn() {
      if (window.confirm('This attendee is already checked in. Record another admission?')) {
        this.perform('repeat_check_in')
      }
    },

    checkInZeffy() {
      const ticketId = this.registration?.zeffy?.ticketId
      if (!ticketId) return

      const popup = window.open(
        `https://www.zeffy.com/ticket/${encodeURIComponent(ticketId)}`,
        'zeffy-check-in',
        'popup=yes,width=480,height=720',
      )
      if (!popup) {
        this.error = 'Your browser blocked the Zeffy check-in popup. Allow popups for this site and try again.'
        return
      }

      popup.focus()
      this.zeffyCheckInMessage = 'Zeffy check-in opened in a popup. Confirm the result there, then close the popup to continue scanning.'
    },

    async perform(action) {
      this.error = ''
      this.performing = true
      const requestId = this.pendingRequestId || this.requestId()
      this.pendingRequestId = requestId
      try {
        const { data } = await Nova.request().post(`/nova-vendor/camp-check-in/registrations/${this.registration.id}/perform`, {
          action,
          note: action === 'repeat_check_in' ? this.repeatNote.trim() || null : null,
          request_id: requestId,
        })
        this.registration = data.registration
        this.repeatNote = ''
        this.pendingRequestId = null
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
    zeffyAmount(payment) {
      if (payment.amountCents === null || payment.amountCents === undefined) return 'Not recorded'
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency || 'USD' }).format(payment.amountCents / 100)
    },
    checkInTime(value) {
      return value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Unknown'
    },
    requestId() {
      if (window.crypto?.randomUUID) return window.crypto.randomUUID()
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
        const random = Math.floor(Math.random() * 16)
        return (character === 'x' ? random : (random & 0x3) | 0x8).toString(16)
      })
    },
  },
}
</script>

<style scoped>
.camp-checkin-button {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 700;
  justify-content: center;
  line-height: 1.25rem;
  min-height: 2.5rem;
  padding: 0.5rem 1rem;
  transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
}

.camp-checkin-button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.camp-checkin-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.camp-checkin-button--primary {
  background: #2563eb;
  color: #fff;
}

.camp-checkin-button--primary:hover:not(:disabled) { background: #1d4ed8; }

.camp-checkin-button--secondary {
  background: #fff;
  border-color: #94a3b8;
  color: #1e293b;
}

.camp-checkin-button--secondary:hover:not(:disabled) { background: #f1f5f9; }

.camp-checkin-button--success {
  background: #15803d;
  color: #fff;
}

.camp-checkin-button--success:hover:not(:disabled) { background: #166534; }

.camp-checkin-button--cash {
  background: #b45309;
  color: #fff;
}

.camp-checkin-button--cash:hover:not(:disabled) { background: #92400e; }

:global(.dark) .camp-checkin-button--secondary {
  background: #1e293b;
  border-color: #64748b;
  color: #f8fafc;
}

:global(.dark) .camp-checkin-button--secondary:hover:not(:disabled) { background: #334155; }
</style>
