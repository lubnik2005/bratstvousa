<script lang="ts">
	import { BOOKING_URL } from '$lib/config';
	import { site } from '$lib/content/site';

	const bookingUrl = BOOKING_URL;
</script>

<header
	class="glass-dark fixed inset-x-0 top-0 z-40 lg:hidden"
	style="padding-top: var(--safe-top)"
>
	<div class="flex h-14 items-center justify-between px-4">
		<a href="/" class="flex items-center gap-2" aria-label="{site.name} home">
			<img src="/logo.png" alt="" class="h-9 w-9" width="36" height="36" />
			<span class="font-display text-lg font-semibold tracking-tight text-white">
				{site.name}
			</span>
		</a>

		<a
			href={bookingUrl}
			target="_blank"
			rel="noopener"
			class="bg-primary shadow-primary/30 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition active:scale-95"
		>
			Book
		</a>
	</div>
</header>
