<script lang="ts">
	export let kind: 'external' | 'right' | 'left' | 'chevron' = 'external';
</script>

<svg
	class="arrow-icon"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path
		d={kind === 'external'
			? 'M6 18 18 6M6 6h12v12'
			: kind === 'left'
				? 'M19 12H5m7-7-7 7 7 7'
				: kind === 'chevron'
					? 'm9 5 7 7-7 7'
					: 'M5 12h14m-7-7 7 7-7 7'}
	/>
</svg>

<style>
	.arrow-icon {
		display: inline-block;
		width: 1em;
		height: 1em;
		vertical-align: -0.12em;
		flex-shrink: 0;
	}
</style>
