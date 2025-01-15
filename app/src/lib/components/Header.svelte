<script lang="ts">
	export let title = 'Отдел';
	export let subtitle: string | undefined = undefined;
</script>

<!-- Page Header Start -->
<div class="container-fluid page-header">
	<div class="container">
		<h1 class="display-3 mb-3">{title}</h1>
		{#if subtitle}
			<p class="col-lg-8">{subtitle}</p>
		{/if}
		<!-- <nav aria-label="breadcrumb"> -->
		<!-- 	<ol class="breadcrumb mb-0"> -->
		<!-- 		<li class="breadcrumb-item"><a class="text-body" href="#">Home</a></li> -->
		<!-- 		<li class="breadcrumb-item"><a class="text-body" href="#">Pages</a></li> -->
		<!-- 		<li class="breadcrumb-item text-dark active" aria-current="page">Молодежный отдел</li> -->
		<!-- 	</ol> -->
		<!-- </nav> -->
	</div>
</div>
<!-- Page Header End -->
