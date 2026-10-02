<script lang="ts">
	import { site, nav } from '$lib/content/site';

	const year = new Date().getFullYear();
	const socials = [
		{ href: site.social.facebook, icon: 'facebook', label: 'Facebook' },
		{ href: site.social.instagram, icon: 'instagram', label: 'Instagram' },
		{ href: site.social.youtube, icon: 'youtube', label: 'YouTube' }
	];
</script>

<footer class="bg-forest-deep text-white/80">
	<div class="mx-auto max-w-7xl px-6 pt-16 pb-28 lg:pb-16">
		<div class="grid gap-10 md:grid-cols-3">
			<!-- Brand -->
			<div>
				<a href="/" class="flex items-center gap-2.5" aria-label="{site.name} home">
					<img src="/logo.png" alt="" class="h-12 w-12" width="48" height="48" />
					<span class="font-display text-2xl font-semibold text-white">{site.name}</span>
				</a>
				<p class="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
					{site.description}
				</p>
				<div class="mt-5 flex gap-3">
					{#each socials as s (s.label)}
						<a
							href={s.href}
							target="_blank"
							rel="noopener"
							aria-label={s.label}
							class="hover:bg-primary grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition"
						>
							<i class="bi bi-{s.icon}"></i>
						</a>
					{/each}
				</div>
			</div>

			<!-- Explore -->
			<div>
				<h3 class="font-display text-lg font-semibold text-white">Explore</h3>
				<ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
					{#each nav as item (item.href)}
						<li>
							<a href={item.href} class="hover:text-mint-bright text-white/70 transition">
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h3 class="font-display text-lg font-semibold text-white">Visit &amp; Contact</h3>
				<ul class="mt-4 space-y-2 text-sm text-white/70">
					<li class="flex items-start gap-2">
						<i class="bi bi-geo-alt text-mint-bright mt-0.5"></i>
						<a href={site.mapsLink} target="_blank" rel="noopener" class="hover:text-mint-bright">
							{site.address.full}
						</a>
					</li>
					<li class="flex items-center gap-2">
						<i class="bi bi-telephone text-mint-bright"></i>
						<a href={site.phoneHref} class="hover:text-mint-bright">{site.phone}</a>
					</li>
					<li class="flex items-center gap-2">
						<i class="bi bi-envelope text-mint-bright"></i>
						<a href={site.emailHref} class="hover:text-mint-bright">{site.email}</a>
					</li>
				</ul>
				<p class="mt-4 text-xs text-white/50">{site.distances}</p>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row"
		>
			<p>&copy; {year} {site.name}. All rights reserved.</p>
		</div>
	</div>
</footer>
