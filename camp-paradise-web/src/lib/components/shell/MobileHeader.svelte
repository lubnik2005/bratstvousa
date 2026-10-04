<script lang="ts">
	import { page } from '$app/stores';
	import { site } from '$lib/content/site';
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
			href="/donate"
			aria-current={$page.url.pathname.startsWith('/donate') ? 'page' : undefined}
			class="bg-sunset text-ink shadow-sunset/30 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition active:scale-95"
		>
			<i class="bi bi-heart-fill text-xs" aria-hidden="true"></i>
			Donate
		</a>
	</div>
</header>
