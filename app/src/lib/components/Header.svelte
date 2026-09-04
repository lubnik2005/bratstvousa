<script lang="ts">
	export let title = 'Отдел';
	export let subtitle: string | undefined = undefined;
</script>

<div class="container-fluid page-header text-center">
	<div class="container">
		<h1 class="display-3 mb-3">{title}</h1>
		{#if subtitle}
			<p class="col-lg-12">{subtitle}</p>
		{/if}
	</div>
</div>
