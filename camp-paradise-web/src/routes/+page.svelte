<script lang="ts">
	import { media } from '$lib/stores/media.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import Stats from '$lib/components/home/Stats.svelte';
	import FacilityStrip from '$lib/components/home/FacilityStrip.svelte';
	import Activities from '$lib/components/home/Activities.svelte';
	import Reviews from '$lib/components/home/Reviews.svelte';
	import CtaBand from '$lib/components/home/CtaBand.svelte';
	import HeroMobile from '$lib/components/home/HeroMobile.svelte';
	import FacilityCarousel from '$lib/components/home/FacilityCarousel.svelte';
</script>

{#if media.isMobile}
	<HeroMobile />
	<FacilityCarousel />
	<Stats />
	<Reviews />
	<CtaBand />
{:else}
	<Hero />
	<Stats />
	<FacilityStrip />
	<Activities />
	<Reviews />
	<CtaBand />
{/if}
