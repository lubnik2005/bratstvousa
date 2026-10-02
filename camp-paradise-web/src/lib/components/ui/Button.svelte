<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		variant?: 'primary' | 'ghost' | 'outline' | 'outline-dark' | 'sunset';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit';
		disabled?: boolean;
		external?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		href,
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		external = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

	const variants: Record<string, string> = {
		primary:
			'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30',
		sunset:
			'bg-sunset text-ink shadow-lg shadow-sunset/25 hover:-translate-y-0.5 hover:brightness-105',
		outline:
			'border border-white/40 text-white backdrop-blur-sm hover:bg-white/10 hover:-translate-y-0.5',
		'outline-dark':
			'border border-ink/25 text-ink hover:bg-ink/5 hover:border-ink/40 hover:-translate-y-0.5',
		ghost: 'text-ink hover:bg-ink/5'
	};

	const sizes: Record<string, string> = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};

	const cls = $derived(`${base} ${variants[variant]} ${sizes[size]} ${className}`);
</script>

{#if href}
	<a
		{href}
		class={cls}
		{onclick}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		{@render children()}
	</a>
{:else}
	<button {type} class={cls} {disabled} {onclick}>
		{@render children()}
	</button>
{/if}
