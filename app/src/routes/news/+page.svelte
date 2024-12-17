<script lang="ts">
	let { data } = $props();
</script>

<div class="container-xxl py-6">
	<div class="container">
		<div class="section-header mx-auto mb-5 text-center" style="max-width: 500px;">
			<h1 class="display-5 mb-3">Новости</h1>
			<p>
				Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor
				duo.
			</p>
		</div>
		<div class="row g-4">
			{#each data.youth_news_articles as article}
				<div class="col-lg-4 col-md-6">
					<img
						class="img-fluid"
						src="http://192.168.7.61:7128/storage/{article.thumbnail}"
						alt=""
					/>
					<div class="bg-light p-4">
						<a class="d-block h5 lh-base mb-4" href="{article.slug}">{article.title}</a>
						<div class="text-muted border-top pt-4">
							<small class="me-3"><i class="fa fa-user text-primary me-2"></i>Admin</small>
							<small class="me-3"
								><i class="fa fa-calendar text-primary me-2"></i>{article.date}</small
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
