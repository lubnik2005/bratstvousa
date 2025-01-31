<script lang="ts">
	let { data } = $props();
	import '@splidejs/svelte-splide/css';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
</script>

{#if data.event?.featuredImage}
<div class="container p-0">
	<img src="{data.media_url}{data.event.featuredImage}" class="img-fluid w-100" alt="Top Image" />
</div>
{/if}

<div class="container-xxl pb-6">
	<div class="container">
		<div class="section-header mx-auto mt-5 text-center" style="max-width: 1000px;">
			<h1 class="display-5 mb-3">{data.event.title}</h1>
			<p>
				{data.event.description}
			</p>
		</div>
	</div>
</div>

<div class="container">
	{@html data.event.content}
</div>
