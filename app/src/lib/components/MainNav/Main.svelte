<script lang="ts">
	import { menu_items } from './menu_items';
	export let media_url;
	import Desktop from './Desktop.svelte';
	import Mobile from './Mobile.svelte';
</script>

<Desktop {menu_items} {media_url} />
<Mobile {media_url} />
