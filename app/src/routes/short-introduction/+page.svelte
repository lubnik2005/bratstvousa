<script>
	export let data;
</script>

<!-- Top Image Section -->
<div class="container-fluid p-0">
	<img src="{data.media_url}img/short-introduction.webp" class="img-fluid w-100" alt="Top Image" />
</div>

<!-- Content Section -->
<div class="container py-5">
	<div class="section-header mx-auto mb-5 text-center" style="max-width: 500px;">
		<h1 class="display-5 mb-3">Краткий Oбзор</h1>
	</div>

	<div class="row">
		<div class="col-md-10 mx-auto">
			{@html data.short_introduction_content}
		</div>
	</div>
</div>
