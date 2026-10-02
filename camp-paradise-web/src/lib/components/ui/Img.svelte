<script lang="ts">
	// Responsive <picture> for assets produced by scripts/fetch-assets.sh.
	// Each slug has 640w/1280w/1920w variants in avif/webp/jpg under /media.
	interface Props {
		slug: string;
		alt: string;
		sizes?: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
	}

	let {
		slug,
		alt,
		sizes = '100vw',
		width,
		height,
		loading = 'lazy',
		fetchpriority = 'auto',
		class: className = ''
	}: Props = $props();

	const widths = [640, 1280, 1920];
	const srcset = (ext: string) => widths.map((w) => `/media/${slug}-${w}w.${ext} ${w}w`).join(', ');
</script>

<picture>
	<source type="image/avif" srcset={srcset('avif')} {sizes} />
	<source type="image/webp" srcset={srcset('webp')} {sizes} />
	<img
		src={`/media/${slug}-1280w.jpg`}
		srcset={srcset('jpg')}
		{sizes}
		{alt}
		{width}
		{height}
		{loading}
		{fetchpriority}
		decoding="async"
		class={className}
	/>
</picture>
