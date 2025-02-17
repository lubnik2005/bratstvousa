<script lang="ts">
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
</script>

Error page


<div class="container-fluid bg-icon mb-5">
	<div class="container">
		<div class="row ">
<Header title={page.status.toString()} subtitle={page.error?.message} />
    </div>
		<div class="row align-items-center">
<a
        style="max-width: 20rem;"
  class="btn btn-md btn-secondary rounded-pill px-5 py-3"
  href="/">Вернуться домой</a
>
</div>
</div>
</div>

